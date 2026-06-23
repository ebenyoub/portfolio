import { cn } from "../../utils";

export const Label = ({ children, className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
    <label className={cn("mb-1 font-medium", className)} {...props}>
        {children}
    </label>
);

const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input 
        type="text" 
        className={cn("border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500", className)}
        {...props}
    />
  )
}

export default Input
