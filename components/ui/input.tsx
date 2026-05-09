import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex w-full rounded-full border border-[rgba(212,210,203,0.4)] bg-transparent px-5 py-3 text-[11px] tracking-[0.08em] text-[#d4d2cb] placeholder:text-[#a8a69f] placeholder:uppercase placeholder:tracking-[0.1em] outline-none transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus:border-[#d4d2cb] disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
