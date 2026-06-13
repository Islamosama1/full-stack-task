import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
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
    <form onSubmit={submit} noValidate className="flex flex-col gap-6">
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="login-email">Email</FieldLabel>
          <Input
            id="login-email"
            type="email"
            placeholder="m@example.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register('email')}
          />
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </Field>

        <Field data-invalid={!!errors.password}>
          <div className="flex items-center">
            <FieldLabel htmlFor="login-password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
              tabIndex={-1}
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            {...register('password')}
          />
          {errors.password && <FieldError>{errors.password.message}</FieldError>}
        </Field>

        {state.status === 'error' && <ErrorAlert message={state.message} />}

        <Field>
          <Button type="submit" disabled={state.status === 'loading'} className="w-full">
            {state.status === 'loading' ? 'Logging in…' : 'Login'}
          </Button>
        </Field>
        <Field>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={onNavigateToSignup}
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign up
            </button>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
