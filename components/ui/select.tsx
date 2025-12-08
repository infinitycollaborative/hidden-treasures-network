import * as React from "react"

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

const Select = ({ value, onValueChange, children }: SelectProps) => {
  const [open, setOpen] = React.useState(false)
  const [selectedValue, setSelectedValue] = React.useState(value)

  const handleSelect = (newValue: string) => {
    setSelectedValue(newValue)
    onValueChange?.(newValue)
    setOpen(false)
  }

  return (
    <div className="relative">
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { 
            open, 
            setOpen, 
            selectedValue, 
            handleSelect 
          } as any)
        }
        return child
      })}
    </div>
  )
}

const SelectTrigger = ({ children, className = "" }: { children: React.ReactNode, className?: string, open?: boolean, setOpen?: any }) => (
  <button
    type="button"
    className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ${className}`}
    onClick={(e) => {
      e.preventDefault()
      const props = (children as any)?.props
      props?.setOpen?.(!props?.open)
    }}
  >
    {children}
  </button>
)

const SelectValue = ({ placeholder }: { placeholder?: string, selectedValue?: string }) => (
  <span>{placeholder}</span>
)

const SelectContent = ({ children, open }: { children: React.ReactNode, open?: boolean }) => {
  if (!open) return null
  
  return (
    <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border bg-white shadow-lg">
      {children}
    </div>
  )
}

const SelectItem = ({ value, children, handleSelect }: { value: string, children: React.ReactNode, handleSelect?: (value: string) => void }) => (
  <div
    className="px-3 py-2 cursor-pointer hover:bg-gray-100"
    onClick={() => handleSelect?.(value)}
  >
    {children}
  </div>
)

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
