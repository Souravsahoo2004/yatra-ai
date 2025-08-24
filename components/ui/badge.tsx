import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline"
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors",
        variant === "default" && "bg-blue-600 text-white",
        variant === "secondary" && "bg-gray-200 text-gray-900",
        variant === "destructive" && "bg-red-600 text-white",
        variant === "outline" && "border border-gray-400 text-gray-900",
        className
      )}
      {...props}
    />
  )
}
