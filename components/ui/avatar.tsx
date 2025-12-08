import * as React from "react"

const Avatar = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}>
    {children}
  </div>
)

const AvatarImage = ({ src, alt }: { src: string, alt?: string }) => (
  <img src={src} alt={alt} className="aspect-square h-full w-full object-cover" />
)

const AvatarFallback = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-200 text-gray-600 font-medium">
    {children}
  </div>
)

export { Avatar, AvatarImage, AvatarFallback }
