import Button from "@/app/components/button";
import { DollarSign } from "lucide-react";

export default function Card({brand, model, year, price, description, image}: {brand: string, model: string, year: number, price: number, description: string, image: string}) {
    return (
        <div className="flex h-full w-full flex-col gap-1 p-2 transition-all duration-300">
          <img
            src={image}
            className="aspect-7/6 w-full rounded-3xl object-cover"
          />
          <div className="flex h-full w-full flex-col p-1.5 gap-1 text-text-primary">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <h3 className="text-base font-medium">{brand}</h3>
                <div className="flex flex-row gap-3 text-sm text-[#666666]">
                  <p>{model}</p>
                  <p>{year}</p>
                </div>
              </div>
              <Button />
            </div>
            <p className="flex items-center text-xl font-medium text-primary">
              <DollarSign className="h-4 w-4" />
              {price}
            </p>
          </div>
        </div>
      );
}