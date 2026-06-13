import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { SuccessCard } from '@/components/ui/SuccessCard'
import { ErrorAlert } from '@/components/ui/ErrorAlert'
import { useAuthForm } from '@/hooks/useAuthForm'
import { login } from '@/lib/api'
import { loginSchema, type LoginFormData } from '@/lib/schemas'

interface LoginFormProps {
  onNavigateToSignup: () => void
}

export function LoginForm({ onNavigateToSignup }: LoginFormProps) {
  const { state, register, errors, submit, handleLogout, loggingOut } = useAuthForm<LoginFormData>(
    loginSchema,
    login,
  )

  if (state.status === 'success')
    return (
      <SuccessCard
        title={`Welcome back, ${state.name}!`}
        message="Welcome to the application."
        onLogout={handleLogout}
        loggingOut={loggingOut}
      />
    )

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <FormField
        id="login-email"
        label="Email"
        error={errors.email?.message}
        inputProps={{ type: 'email', autoComplete: 'email', ...register('email') }}
      />
      <FormField
        id="login-password"
        label="Password"
        error={errors.password?.message}
        inputProps={{ type: 'password', autoComplete: 'current-password', ...register('password') }}
      />
      {state.status === 'error' && <ErrorAlert message={state.message} />}
      <Button type="submit" disabled={state.status === 'loading'} className="w-full">
        {state.status === 'loading' ? 'Logging in…' : 'Log in'}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={onNavigateToSignup}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign up
        </button>
      </p>
    </form>
  )
}
