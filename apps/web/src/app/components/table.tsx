import type { Car } from "@/packages/types/car";
import Button from "./button";
import { Edit, Trash } from "lucide-react";

export default function Table({ carData }: { carData: Car[] }) {
  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="border-b border-border hover:bg-gray-50">
          <th className="px-0 py-2 font-medium w-fit">Brand</th>
          <th className="px-3 py-2 font-medium w-fit">Model</th>
          <th className="px-3 py-2 font-medium w-fit">Year</th>
          <th className="px-3 py-2 font-medium w-fit">Price</th>
          <th className="px-3 py-2 font-medium w-fit">Images</th>
          <th className="px-3 py-2 font-medium w-fit">Actions</th>
        </tr>
      </thead>
      <tbody>
        {carData.map((car) => (
          <tr key={car.id} className="border-b border-border hover:bg-gray-50">
            <td className="px-0 py-2 w-fit">{car.brand}</td>
            <td className="px-3 py-2 w-fit">{car.model}</td>
            <td className="px-3 py-2 w-fit">{car.year}</td>
            <td className="px-3 py-2 w-fit">${car.price}/week</td>
            <td className="px-3 py-2 w-fit">{car.image}</td>
            <td className="flex flex-row gap-6 px-3 py-2 w-fit">
              <Button onClick={() => {}} icon={<Edit className="w-4 h-4" />}>Edit</Button>
              <Button onClick={() => {}} icon={<Trash className="w-4 h-4" />}>Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}