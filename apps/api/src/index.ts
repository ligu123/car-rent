import "dotenv/config";
import express from "express";
import cors from "cors";
import sql from "./db";

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.get("/health", (_req,res) => {
    res.json({ ok:true });
});

app.get("/cars", async (req,res) => {
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const brand = typeof req.query.brand === "string" ? req.query.brand.trim() : "" ;

    const cars = await sql`
    SELECT id, brand, model, year, price, image, image_alt, description 
    FROM cars
    WHERE TRUE
    ${
      search
      ? sql`AND (
      brand ILIKE ${"%" + search + "%"}
      OR model ILIKE ${"%" + search + "%"}
      OR year::text ILIKE ${ "%" + search + "%"}
      )`
      : sql``
    }
    ${brand ? sql`AND brand ILIKE ${brand}` : sql``}
    ORDER BY id ASC
    `;

    res.json({ cars });
});

app.get("/cars/:id", async (req,res) => {
    const {id} = req.params;
    const car = await sql`
    SELECT id, brand, model, year, color, price, image, image_alt, description 
    FROM cars
    WHERE id = ${id}
    `;


    if(!car) {
        res.status(404).json({
            status: "error", message: `Car with id ${id} not found`});
        }
    if(car.length === 0) {
        res.status(404).json({
            status: "error", message: `No car is found`});
    } else {
        res.json({status: "success", car});
    }
});

app.listen(4000,() => {
    console.log("Server is running on port 4000");
});