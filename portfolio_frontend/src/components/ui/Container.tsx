import { cn } from "../../utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const Container = ({ children, className, ...props }: ContainerProps) => {
  return (
    <div className={cn("flex max-w-5xl h-full mx-auto px-5", className)} {...props}>
        {children}
    </div>
  )
}

export default Container