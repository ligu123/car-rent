"use client";
import Card from "./components/card";
import Input from "./components/input";
import Dropdown from "./components/dropdown";
import Button from "./components/button";
import { useCallback, useEffect, useState } from "react";
import type { Car } from "@/packages/types/car";
import Link from "next/link";

type CarsRequest =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; cars: Car[] };

  export default function Home() 
{
  const [request, setRequest] = useState<CarsRequest>({ status: "loading" });
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");

  const loadCars = useCallback(() => {
    setRequest({ status: "loading" });

    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (brand.trim()) params.set("brand", brand.trim());
    const qs = params.toString();

    fetch (`http://localhost:4000/cars${qs ? `?${qs}` : ""}`)
      .then(async (res) => {
       if (!res.ok) {
        throw new Error(`Could not load cars (${res.status})`);
       }
       else {
        const data: { cars?: Car[]} = await res.json();
        setRequest({ status: "success", cars: data.cars ?? [] });
       }
      })
      .catch((error: unknown) => {
        const message =
          error instanceof Error ? error.message : "Could not load cars";
        setRequest({ status: "error", message });
      });
  }, [search, brand]);

  useEffect(() => {loadCars();}, [loadCars]);

  const cars = request.status === "success" ? request.cars : [];



  return (
    <div className="flex flex-1 flex-col items-center bg-background font-sans text-foreground">
      <main className="max-w-fit flex flex-col items-start gap-8 py-16 px-16">

       <div className="flex w-full items-center justify-between gap-3">
        <div className="flex flex-col gap-2 items-start pl-2">
           <h1 className="text-2xl font-medium">Featured Cars</h1>
           <p className="text-xl text-[#666666]">
             {request.status === "success" ? `${cars.length} cars` : "\u00a0"}
           </p>
        </div>
          <Link href="/managementpage">Manage cars</Link>
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

        {request.status === "loading" ? (
          <p className="flex min-w-5xl justify-center items-center text-lg text-[#666666] pl-2">Loading cars…</p>
        ) : request.status === "error" ? (
          <div className="flex flex-col items-start gap-3 pl-2">
            <p className="text-lg min-w-5xl text-[#666666]">{request.message}</p>
            <button
              type="button"
              onClick={loadCars}
              className="text-sm text-foreground underline underline-offset-4"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 flex-1 items-center">
            {cars.length === 0 ? 
            (<p className="flex min-w-5xl text-lg text-[#666666] pl-2">No cars found</p>) 
            :(
             cars.map((carsData) => (
               <Card
               key={carsData.id}
               carsData={carsData}
               />
            ))
            )}
          </div>
        )}

      </main>
    </div>
  );
}