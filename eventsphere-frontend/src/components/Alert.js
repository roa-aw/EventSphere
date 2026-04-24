"use client"

import { CheckCircle, AlertCircle, Info, XCircle } from "lucide-react"
import { cn } from "../lib/utils"

const alertStyles = {
  success: {
    bg: "bg-green-50 border-green-200",
    icon: CheckCircle,
    iconColor: "text-green-600",
    titleColor: "text-green-800",
    messageColor: "text-green-700",
  },
  error: {
    bg: "bg-red-50 border-red-200",
    icon: XCircle,
    iconColor: "text-red-600",
    titleColor: "text-red-800",
    messageColor: "text-red-700",
  },
  warning: {
    bg: "bg-amber-50 border-amber-200",
    icon: AlertCircle,
    iconColor: "text-amber-600",
    titleColor: "text-amber-800",
    messageColor: "text-amber-700",
  },
  info: {
    bg: "bg-blue-50 border-blue-200",
    icon: Info,
    iconColor: "text-blue-600",
    titleColor: "text-blue-800",
    messageColor: "text-blue-700",
  },
}

export default function Alert({
  type = "success",
  title,
  message,
  onClose,
  className,
}) {
  const styles = alertStyles[type]
  const Icon = styles.icon

  return (
    <div className={cn("flex justify-between items-start p-4 rounded-lg border", styles.bg, className)}>
      <div className="flex gap-3">
        <Icon className={cn("w-5 h-5 mt-0.5", styles.iconColor)} />
        <div>
          {/* fallback: if no title, use type */}
          <p className={cn("font-medium capitalize", styles.titleColor)}>
            {title || type}
          </p>
          {message && (
            <p className={cn("text-sm mt-1", styles.messageColor)}>
              {message}
            </p>
          )}
        </div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      )}
    </div>
  )
}