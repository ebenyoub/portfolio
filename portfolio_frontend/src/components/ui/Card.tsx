import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

type CardTitleProps = HTMLAttributes<HTMLHeadingElement> & {
  children: ReactNode;
};

export const CardHeader = ({ children, className, ...props }: CardProps) => (
  <div className={cn("mb-4 border-b pb-2", className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className, ...props }: CardTitleProps) => (
  <h3 className={cn("text-lg font-semibold", className)} {...props}>
    {children}
  </h3>
);

export const CardContent = ({ children, className, ...props }: CardProps) => (
  <div className={cn("text-gray-700", className)} {...props}>
    {children}
  </div>
);

export const CardActions = ({ children, className, ...props }: CardProps) => (
  <div className={cn("flex items-center gap-3", className)} {...props}>
    {children}
  </div>
);

const Card = ({ children, className, ...props }: CardProps) => (
  <div className={cn("rounded-lg bg-white p-6 shadow-md", className)} {...props}>
    {children}
  </div>
);

export default Card;
