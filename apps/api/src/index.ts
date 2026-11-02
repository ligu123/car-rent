import express from "express";
import cors from "cors";
import { cars } from "./app/data/cars"

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.get("/health", (_req,res) => {
    res.json({ok:true});
});

app.get("/cars", (_req,res) => {
    res.json({cars});
});

app.get("/cars/:id", (req,res) => {
    const {id} = req.params;
    const car = cars.find((car) => car.id === id);
    if(!car) {
        res.status(404).json({status: "error", message: `Car with id ${id} not found`});
    } else {
        res.json({status: "success", car});
    }
});

app.listen(4000,() => {
    console.log("Server is running on port 4000");
});