"use client";
import Card from "./components/card";
import Input from "./components/input";
import Dropdown from "./components/dropdown";
import Button from "./components/button";
import { cars } from "./data/cars";
import { useState } from "react";

export default function Home() 
{
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");

  const filteredCars = cars.filter((carsData) => 
    (brand === "" ? true : carsData.brand === brand) &&
    (carsData.brand.toLowerCase().includes( search.toLowerCase() ) || 
     carsData.model.toLowerCase().includes( search.toLowerCase() ) || 
     carsData.year.toString().includes( search.toString() )
    ));

  return (
    <div className="flex flex-1 flex-col items-center bg-background font-sans text-foreground">
      <main className="max-w-fit flex flex-col items-start gap-8 py-16 px-16">
       
        <div className="flex flex-col gap-2 items-start pl-2">
           <h1 className="text-2xl font-medium">Featured Cars</h1>
           <p className="text-xl text-[#666666]">{filteredCars.length} cars</p>
        </div>

        <div className="flex items-center gap-3 pl-2">
          <Input 
             value={search}
             placeholder="Search for a car" 
             onSearch={(inputValue) => setSearch(inputValue)}
          />
          <Dropdown 
             options={[...new Set(cars.map((carsData) => carsData.brand))]}
             value={brand} 
             onSelect={(selectedValue) => setBrand(selectedValue)}
          />
          <Button
             onClick={() => {setSearch(""); setBrand("");}}
          />
        </div>

        <div className="max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 flex-1 items-center">
            {filteredCars.length === 0 ? 
            (<p className="flex min-w-5xl text-lg text-[#666666] pl-2">No cars found</p>) 
            :(
             filteredCars.map((carsData) => (
               <Card
               key={carsData.id}
               carsData={carsData}
               />
            ))
            )}
        </div>

      </main>
    </div>
  );
}