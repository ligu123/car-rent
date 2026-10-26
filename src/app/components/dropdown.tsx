import {ChevronDown as ChevronDownIcon} from "lucide-react";

export default function Dropdown (
    {options, value, onSelect}: {
        options: string[], 
        value: string, 
        onSelect: (selectedValue: string) => void
    }) 
    {
      return (
        <div className="flex items-center gap-2 border border-gray-300 rounded-xl py-1.5 px-3">
             <select
                 className="appearance-none outline-none w-full"
                 value={value}
                 onChange={(event) => onSelect(event.target.value)}
             >
                 <option value="">
                   All
                 </option>

                 {options.map((option) => (
                     <option key={option} value={option}>
                     {option}
                   </option>
              ))}
            </select>
            <ChevronDownIcon className= "pointer-events-none size-4 text-[#666666]"/>
        </div>
      );
    }