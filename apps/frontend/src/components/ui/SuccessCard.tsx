interface SuccessCardProps {
  title: string
  message: string
}

export function SuccessCard({ title, message }: SuccessCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 text-center text-card-foreground">
      <p className="text-lg font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
