import { X } from "lucide-react";

export default function Button({ onClick }: { onClick: () => void }) {
  return (
    <button 
      type="button" 
      onClick={onClick} 
      className="w-fit flex items-center gap-2 text-[#666666] text-sm hover:text-[#666666]/80 rounded-xl">
      <X className="w-4 h-4" />
    </button>
  );
}