import { Search as SearchIcon } from "lucide-react";

export default function Input ({placeholder, onSearch, value}: {placeholder: string, onSearch: (inputValue: string) => void, value: string}) {
        return (
            <div className="flex items-center gap-2 border border-gray-300 rounded-xl p-1.5"> 
               <SearchIcon className="size-4 text-[#666666]"/>
               <input 
                 className="outline-none" 
                 type="string" 
                 value={value}
                 placeholder={placeholder} 
                 onChange={(inputValue) => onSearch(inputValue.target.value)}
               />
            </div>
)}