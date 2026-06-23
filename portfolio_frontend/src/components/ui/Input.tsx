import { cn } from "../../utils";

export const Label = ({ children, className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
    <label className={cn("block text-xs font-mono text-[#A1A1AA] uppercase tracking-wider mb-2", className)} {...props}>
        {children}
    </label>
);

const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input 
        type="text" 
        className={cn("w-full bg-[#0A0A0A] border border-[#262626] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#4B4B4B] font-mono outline-none focus:border-[#3B82F6] transition-colors disabled:opacity-30 disabled:cursor-not-allowed", className)}
        {...props}
    />
  )
}

export default Input
