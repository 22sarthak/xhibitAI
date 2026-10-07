import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";
import { TLink, type CurtainSpec } from "../../lib/transition";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "light" | "outline-light" | "whatsapp";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex select-none items-center justify-center gap-2.5 whitespace-nowrap rounded-full font-semibold tracking-[-0.01em] " +
  "transition-[transform,background-color,color,box-shadow] duration-300 ease-(--ease-soft) active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60";

const sizes: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-[0.875rem]",
  md: "h-12 px-6 text-[0.95rem]",
  lg: "h-14 pl-7 pr-7 text-[1rem]",
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-ink text-ivory shadow-[0_14px_30px_-14px_rgb(29_26_22/0.75)] hover:-translate-y-0.5 hover:bg-[#2a2520] hover:shadow-[0_20px_40px_-16px_rgb(29_26_22/0.7)]",
  secondary: "bg-linen/70 text-ink ring-1 ring-ink/12 backdrop-blur-md hover:-translate-y-0.5 hover:bg-linen hover:ring-ink/25",
  ghost: "text-ink hover:bg-ink/5",
  light: "bg-ivory text-ink shadow-[0_14px_30px_-14px_rgb(0_0_0/0.6)] hover:-translate-y-0.5 hover:bg-white",
  "outline-light": "text-ivory ring-1 ring-ivory/25 hover:bg-ivory/10 hover:ring-ivory/45",
  whatsapp: "bg-wa text-[#06301a] shadow-[0_14px_30px_-14px_rgb(18_140_126/0.8)] hover:-translate-y-0.5 hover:bg-[#2be070]",
};

export const buttonClasses = (variant: ButtonVariant = "primary", size: ButtonSize = "md", className?: string) =>
  cn(base, sizes[size], variants[variant], className);

interface Common {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  /** Shows an arrow that nudges on hover. */
  arrow?: boolean;
  className?: string;
  children: ReactNode;
}

function Inner({ icon, arrow, children }: Pick<Common, "icon" | "arrow" | "children">) {
  return (
    <>
      {icon}
      <span>{children}</span>
      {arrow && (
        <svg
          viewBox="0 0 16 16"
          className="size-4 transition-transform duration-300 ease-(--ease-soft) group-hover/btn:translate-x-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </>
  );
}

export function Button({
  variant,
  size,
  icon,
  arrow,
  className,
  children,
  type = "button",
  ...rest
}: Common & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">) {
  return (
    <button type={type} className={buttonClasses(variant, size, className)} {...rest}>
      <Inner icon={icon} arrow={arrow}>
        {children}
      </Inner>
    </button>
  );
}

/** External link (WhatsApp, tel:, booking page) styled as a button. */
export function ButtonLink({
  variant,
  size,
  icon,
  arrow,
  className,
  children,
  external,
  ...rest
}: Common & { external?: boolean } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children">) {
  return (
    <a
      className={buttonClasses(variant, size, className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      <Inner icon={icon} arrow={arrow}>
        {children}
      </Inner>
    </a>
  );
}

/** Internal route link with the curtain transition, styled as a button. */
export function ButtonRoute({
  variant,
  size,
  icon,
  arrow,
  className,
  children,
  to,
  curtain,
  onIntent,
}: Common & { to: string; curtain?: CurtainSpec; onIntent?: () => void }) {
  return (
    <TLink to={to} curtain={curtain} onIntent={onIntent} className={buttonClasses(variant, size, className)}>
      <Inner icon={icon} arrow={arrow}>
        {children}
      </Inner>
    </TLink>
  );
}
