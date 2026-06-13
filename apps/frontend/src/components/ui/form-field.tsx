import type { ComponentProps } from 'react'

interface FormFieldProps {
  id: string
  label: string
  error?: string
  inputProps: ComponentProps<'input'>
}

export function FormField({ id, label, error, inputProps }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring/50 transition focus:ring-3 aria-[invalid=true]:border-destructive"
        {...inputProps}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
