import Card from "./components/card";
import { cars } from "@/app/data/cars";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center bg-background font-sans text-foreground">
      <main className="max-w-fit flex flex-col items-start gap-8 py-16 px-16">
        <div className="flex flex-col gap-3 items-start pl-2">
          <h1 className="text-4xl font-medium">Featured Cars</h1>
          <p className="text-lg text-[#666666]">{cars.length} cars</p>
        </div>
        <div className="max-w-6xl grid grid-cols-5 flex-1 items-center">
        {cars.map((car) => (
          <Card brand={car.brand} model={car.model} year={car.year} price={car.price} description={car.description} image={car.image} />
        ))}
        </div>
      </main>
    </div>
  );
}
