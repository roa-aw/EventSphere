"use client"

import { Inbox } from "lucide-react"
import { cn } from "@/lib/utils"

// Optional: only if you already use shadcn button
// import { Button } from "@/components/ui/button"

export default function EmptyState({
  icon: Icon,
  title,
  description,
  message, // backward compatibility
  action,
  className,
}) {
  const text = description || message
  const FinalIcon = Icon || Inbox

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center mb-4">
        <FinalIcon className="w-8 h-8 text-violet-600" />
      </div>

      <h3 className="text-lg font-semibold mb-2">{title}</h3>

      {text && (
        <p className="text-muted-foreground max-w-sm mb-6">{text}</p>
      )}

      {action && (
        // OPTION A: if you use shadcn Button
        // <Button
        //   onClick={action.onClick}
        //   className="bg-gradient-to-r from-violet-600 to-indigo-600"
        // >
        //   {action.label}
        // </Button>

        // OPTION B: fallback (safe with your current setup)
        <button
          onClick={action.onClick}
          className="px-4 py-2 rounded-md text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}