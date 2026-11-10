import type { Car } from "@/packages/types/car";

export default function Table({ carData }: { carData: Car[] }) {
  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="border-b border-border hover:bg-gray-50">
          <th className="px-0 py-2 font-medium w-fit">Brand</th>
          <th className="px-3 py-2 font-medium w-fit">Model</th>
          <th className="px-3 py-2 font-medium w-fit">Year</th>
          <th className="px-3 py-2 font-medium w-fit">Price</th>
        </tr>
      </thead>
      <tbody>
        {carData.map((car) => (
          <tr key={car.id} className="border-b border-border hover:bg-gray-50">
            <td className="px-0 py-2 w-fit">{car.brand}</td>
            <td className="px-3 py-2 w-fit">{car.model}</td>
            <td className="px-3 py-2 w-fit">{car.year}</td>
            <td className="px-3 py-2 w-fit">${car.price}/week</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}