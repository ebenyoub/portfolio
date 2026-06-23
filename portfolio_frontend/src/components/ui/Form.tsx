import type { FormHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils";

type FormProps = FormHTMLAttributes<HTMLFormElement> & {
  children: ReactNode;
};

type FormSectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

type FormTitleProps = HTMLAttributes<HTMLHeadingElement> & {
  children: ReactNode;
};

type FormDescriptionProps = HTMLAttributes<HTMLParagraphElement> & {
  children: ReactNode;
};

type FormGroupProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export const FormSection = ({ children, className, ...props }: FormSectionProps) => (
  <section className={cn("space-y-6", className)} {...props}>
    {children}
  </section>
);

export const FormTitle = ({ children, className, ...props }: FormTitleProps) => (
  <h2 className={cn(className)} {...props}>
    {children}
  </h2>
);

export const FormDescription = ({ children, className, ...props }: FormDescriptionProps) => (
  <p className={cn("text-sm text-gray-500", className)} {...props}>
    {children}
  </p>
);

export const FormGroup = ({ children, className, ...props }: FormGroupProps) => (
  <div className={cn("flex flex-col gap-1", className)} {...props}>
    {children}
  </div>
);

export const FormActions = ({ children, className, ...props }: FormGroupProps) => (
  <div className={cn("flex justify-end gap-4 pt-4", className)} {...props}>
    {children}
  </div>
);

const Form = ({ children, className, ...props }: FormProps) => (
  <form className={cn(className)} {...props}>
    {children}
  </form>
);

export default Form;
