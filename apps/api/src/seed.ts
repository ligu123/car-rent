import "dotenv/config";
import postgres from "postgres";
import { cars } from "./app/data/cars";

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

async function seed() {
    const rows = cars.map((car) => ({
        id: car.id,
        brand: car.brand,
        model: car.model,
        year: car.year,
        price: car.price,
        image: car.image,
        image_alt: car.imageAlt,
        description: car.description,
    }));

    await sql`INSERT INTO cars ${sql(rows)}`;
    console.log(`Inserted ${rows.length} cars`);
    await sql.end();
}

seed().catch(async (err) => {
    console.error(err);
    await sql.end();
    process.exit(1);
});