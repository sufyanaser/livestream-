import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg border text-xs font-semibold tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 disabled:pointer-events-none disabled:opacity-45',
  {
    variants: {
      variant: {
        default: 'border-sky-400/30 bg-sky-400/12 text-sky-100 hover:bg-sky-400/20',
        ghost: 'border-white/8 bg-white/[0.035] text-zinc-300 hover:bg-white/[0.07] hover:text-white',
        danger: 'border-red-400/35 bg-red-500/12 text-red-200 hover:bg-red-500/20'
      },
      size: {
        default: 'h-9 px-3.5',
        sm: 'h-8 px-3',
        icon: 'size-9'
      }
    },
    defaultVariants: { variant: 'default', size: 'default' }
  }
)

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }

export function Button({ className, variant, size, asChild, ...props }: ButtonProps): React.JSX.Element {
  const Component = asChild ? Slot : 'button'
  return <Component className={cn(buttonVariants({ variant, size }), className)} {...props} />
}

