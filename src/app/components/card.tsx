import { Car } from "@/app/types/car";

export default function Card({carsData}: {carsData: Car}) {
    return (
        <div className="flex h-full w-full flex-col gap-1 p-2 transition-all duration-300">
          <img
            src={carsData.image}
            alt={carsData.imageAlt}
            className="aspect-7/6 w-full rounded-2xl object-cover"
          />
          <div className="flex h-full w-full flex-col p-1.5 gap-1 text-text-primary">
                <h3 className="text-md font-medium">{carsData.brand}</h3>
                <div className="flex flex-row items-center justify-start gap-3 text-sm text-[#666666]">
                  <p>{carsData.model}</p>
                  <p>{carsData.year}</p>
                </div>
            <p className="flex items-center text-md font-medium text-primary">
              ${carsData.price}/week
            </p>
          </div>
        </div>
      );
}