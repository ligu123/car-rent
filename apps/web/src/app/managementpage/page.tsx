"use client";
import { use, useEffect, useState } from "react";
import Table from "../components/table";
import type { Car } from "@/packages/types/car";
import Link from "next/link";


export default function ManagementPage() {

  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    fetch("http://localhost:4000/cars")
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Could not load cars (${res.status})`);
        }
        const data: { cars?: Car[]} = await res.json();
        setCars(data.cars ?? []);
      })
      .catch((error: unknown) => {
        const message =
          error instanceof Error ? error.message : "Could not load cars";
        throw new Error(message);
      });
  })

  return(
  <div className="flex flex-col items-center bg-background font-sans text-foreground">
    <main className="flex flex-col w-full max-w-5xl items-start gap-8 py-16 px-16">
      <Link href="/">Home</Link>
      <h1 className="text-2xl font-medium">Management Page</h1>
      <Table carData={cars} />
    </main>
  </div>
)}
