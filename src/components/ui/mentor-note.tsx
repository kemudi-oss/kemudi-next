import React from 'react'
import { cn } from '@/utilities/ui'

interface MentorNoteProps {
  children: React.ReactNode
  className?: string
}

export const MentorNote: React.FC<MentorNoteProps> = ({ children, className }) => {
  return (
    <aside
      className={cn(
        'my-8 border-l-2 border-clay-rose/30 py-4 pl-6 font-serif text-lg italic text-muted-foreground',
        className,
      )}
    >
      {children}
    </aside>
  )
}
