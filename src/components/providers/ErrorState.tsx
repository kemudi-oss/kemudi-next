import React from 'react'
import { AlertTriangleIcon } from 'lucide-react'

interface ErrorStateProps {
  title?: string
  description?: string
  action?: React.ReactNode
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  description = 'We couldn&rsquo;t load this content. Please try again.',
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-error/20 bg-error/5 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error/10">
        <AlertTriangleIcon className="h-6 w-6 text-error" />
      </div>
      <h3 className="mt-4 font-heading text-lg font-medium text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
