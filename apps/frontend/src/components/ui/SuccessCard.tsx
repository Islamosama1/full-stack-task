interface SuccessCardProps {
  title: string
  message: string
  onLogout?: () => void
  loggingOut?: boolean
}

export function SuccessCard({ title, message, onLogout, loggingOut }: SuccessCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 text-center text-card-foreground">
      <p className="text-lg font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      {onLogout && (
        <button
          type="button"
          onClick={onLogout}
          disabled={loggingOut}
          className="mt-4 text-sm font-medium text-foreground underline-offset-4 hover:underline disabled:opacity-50"
        >
          {loggingOut ? 'Logging out…' : 'Log out'}
        </button>
      )}
    </div>
  )
}
