import { X } from "lucide-react";

export default function Button({ onClick, children, icon }: { onClick: () => void, children: React.ReactNode, icon: React.ReactNode }) {
  return (
    <button 
      type="button" 
      onClick={onClick} 
      className="w-fit flex items-center gap-2 text-[#666666] text-sm hover:text-[#666666]/80 rounded-xl">
      {icon}
      {children}
    </button>
  );
}