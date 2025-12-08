'use client'

import { ReactNode } from 'react'

interface ScrollAreaProps {
  className?: string
  children: ReactNode
}

export function ScrollArea({ className, children }: ScrollAreaProps) {
  return (
    <div className={`overflow-y-auto ${className || ''}`.trim()} role="region">
      {children}
    </div>
  )
}
