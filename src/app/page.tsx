import Card from "./components/card";
import { cars } from "@/app/data/cars";

export default function Home() {

  return (
    <div className="flex flex-1 flex-col items-center bg-background font-sans text-foreground">
      <main className="max-w-fit flex flex-col items-start gap-8 py-16 px-16">
        <div className="flex flex-col gap-2 items-start pl-2">
          <h1 className="text-2xl font-medium">Featured Cars</h1>
          <p className="text-xl text-[#666666]">{cars.length} cars</p>
        </div>
        <div className="max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 flex-1 items-center">
          {cars.map((car) => (
            <Card
              key={car.id}
              carsData={car}
            />
          ))}
        </div>
      </main>
    </div>
  );
}