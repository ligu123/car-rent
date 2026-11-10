import "dotenv/config";
import express from "express";
import cors from "cors";
import sql from "./db";

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

const ALLOWED_FIELDS = [
  "brand",
  "model",
  "year",
  "price",
  "image",
  "image_alt",
  "description",
] as const;

type CarFields = (typeof ALLOWED_FIELDS)[number];

function isBlank(value: unknown) {
  return typeof value !== "string" || value.trim() === "";
}

function validateCarBody(
  body: unknown,
  partial: boolean
): { error: string } | { data: Record<string, unknown> } {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Request body must be an object" };
  }

  const record = body as Record<string, unknown>;
  const unexpected = Object.keys(record).filter(
    (key) => !ALLOWED_FIELDS.includes(key as CarFields)
  );
  if (unexpected.length > 0) {
    return { error: `Unexpected fields: ${unexpected.join(", ")}` };
  }

  const data: Record<string, unknown> = {};

  for (const key of ALLOWED_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(record, key)) {
      if (!partial) {
        return { error: `${key} is required` };
      }
      continue;
    }

    const value = record[key];

    if (key === "year") {
      const year = typeof value === "number" ? value : Number(value);
      if (!Number.isInteger(year)) {
        return { error: "Year must be a whole number" };
      }
      if (year < 1900 || year > 2026) {
        return { error: "Year must be between 1900 and 2026" };
      }
      data.year = year;
      continue;
    }

    if (key === "price") {
      const price = typeof value === "number" ? value : Number(value);
      if (!Number.isFinite(price)) {
        return { error: "Price must be a number" };
      }
      if (price < 0) {
        return { error: "Price must be 0 or greater" };
      }
      data.price = price;
      continue;
    }

    if (isBlank(value)) {
      return { error: `${key} is required` };
    }
    data[key] = (value as string).trim();
  }

  if (partial && Object.keys(data).length === 0) {
    return { error: "No updatable fields provided" };
  }

  return { data };
}

function sendServerError(res: express.Response, error: unknown) {
  console.error(error);
  res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
}

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/cars", async (req, res) => {
  const parsed = validateCarBody(req.body, false);
  if ("error" in parsed) {
    return res.status(400).json({ status: "error", message: parsed.error });
  }

  try {
    const { brand, model, year, price, image, image_alt, description } =
      parsed.data;
    const id = crypto.randomUUID();
    const car = await sql`
      INSERT INTO cars (id, brand, model, year, price, image, image_alt, description)
      VALUES (${id}, ${brand}, ${model}, ${year}, ${price}, ${image}, ${image_alt}, ${description})
      RETURNING *
    `;
    res.status(201).json({ car: car[0] });
  } catch (error) {
    sendServerError(res, error);
  }
});

app.patch("/cars/:id", async (req, res) => {
  const parsed = validateCarBody(req.body, true);
  if ("error" in parsed) {
    return res.status(400).json({ status: "error", message: parsed.error });
  }

  try {
    const car = await sql`
      UPDATE cars
      SET ${sql(parsed.data, ...Object.keys(parsed.data))}
      WHERE id = ${req.params.id}
      RETURNING *
    `;

    if (car.length === 0) {
      return res.status(404).json({
        status: "error",
        message: `Car with id ${req.params.id} not found`,
      });
    }

    res.json({ status: "success", car: car[0] });
  } catch (error) {
    sendServerError(res, error);
  }
});

app.delete("/cars/:id", async (req, res) => {
  try {
    const car = await sql`
      DELETE FROM cars WHERE id = ${req.params.id} RETURNING *
    `;

    if (car.length === 0) {
      return res.status(404).json({
        status: "error",
        message: `Car with id ${req.params.id} not found`,
      });
    }

    res.json({ status: "success", car: car[0] });
  } catch (error) {
    sendServerError(res, error);
  }
});

app.get("/cars", async (req, res) => {
  const search =
    typeof req.query.search === "string" ? req.query.search.trim() : "";
  const brand =
    typeof req.query.brand === "string" ? req.query.brand.trim() : "";

  try {
    const cars = await sql`
      SELECT id, brand, model, year, price, image, image_alt, description
      FROM cars
      WHERE TRUE
      ${
        search
          ? sql`AND (
              brand ILIKE ${"%" + search + "%"}
              OR model ILIKE ${"%" + search + "%"}
              OR year::text ILIKE ${"%" + search + "%"}
            )`
          : sql``
      }
      ${brand ? sql`AND brand ILIKE ${brand}` : sql``}
      ORDER BY id ASC
    `;
    res.json({ cars });
  } catch (error) {
    sendServerError(res, error);
  }
});

app.get("/cars/:id", async (req, res) => {
  try {
    const car = await sql`
      SELECT id, brand, model, year, price, image, image_alt, description
      FROM cars
      WHERE id = ${req.params.id}
    `;

    if (car.length === 0) {
      return res.status(404).json({
        status: "error",
        message: `Car with id ${req.params.id} not found`,
      });
    }

    res.json({ status: "success", car: car[0] });
  } catch (error) {
    sendServerError(res, error);
  }
});

app.get("/brands", async (req, res) => {
  try {
    const brands = await sql`
      SELECT brand
      FROM cars
      GROUP BY brand
      ORDER BY brand ASC
    `;
    res.json({ brands });
  } catch (error) {
    sendServerError(res, error);
  }
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
