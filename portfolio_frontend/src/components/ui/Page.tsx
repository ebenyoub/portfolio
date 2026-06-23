import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils";

type DivProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  children: ReactNode;
};

type ParagraphProps = HTMLAttributes<HTMLParagraphElement> & {
  children: ReactNode;
};

export const PageHeader = ({ children, className, ...props }: DivProps) => (
  <div className={cn(className)} {...props}>
    {children}
  </div>
);

export const PageTitle = ({ children, className, ...props }: HeadingProps) => (
  <h1 className={cn(className)} {...props}>
    {children}
  </h1>
);

export const PageDescription = ({ children, className, ...props }: ParagraphProps) => (
  <p className={cn(className)} {...props}>
    {children}
  </p>
);

export const Section = ({ children, className, ...props }: SectionProps) => (
  <section className={cn(className)} {...props}>
    {children}
  </section>
);

export const SectionTitle = ({ children, className, ...props }: HeadingProps) => (
  <h2 className={cn(className)} {...props}>
    {children}
  </h2>
);

export const SectionDescription = ({ children, className, ...props }: ParagraphProps) => (
  <p className={cn(className)} {...props}>
    {children}
  </p>
);

export const LoadingState = ({ children, className, ...props }: DivProps) => (
  <div className={cn("flex w-full items-center justify-center", className)} {...props}>
    {children}
  </div>
);

export const EmptyState = ({ children, className, ...props }: ParagraphProps) => (
  <p className={cn("text-center text-gray-500", className)} {...props}>
    {children}
  </p>
);
