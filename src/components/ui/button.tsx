
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 [&_svg]:text-primary-foreground",
        destructive: 
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 [&_svg]:text-destructive-foreground",
        outline:
          "border border-primary/30 bg-background hover:bg-accent hover:text-accent-foreground text-foreground [&_svg]:text-foreground",
        secondary:
          "bg-secondary text-foreground hover:bg-secondary/80 [&_svg]:text-foreground",
        ghost: "hover:bg-accent/10 hover:text-accent-foreground text-foreground [&_svg]:text-foreground",
        link: "text-primary underline-offset-4 hover:underline [&_svg]:text-foreground",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90 [&_svg]:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
