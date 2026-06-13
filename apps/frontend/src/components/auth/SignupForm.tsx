import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { SuccessCard } from '@/components/ui/SuccessCard'
import { ErrorAlert } from '@/components/ui/ErrorAlert'
import { useAuthForm } from '@/hooks/useAuthForm'
import { signup } from '@/lib/api'
import { signupSchema, type SignupFormData } from '@/lib/schemas'

interface SignupFormProps {
  onNavigateToLogin: () => void
}

export function SignupForm({ onNavigateToLogin }: SignupFormProps) {
  const { state, register, errors, submit } = useAuthForm<SignupFormData>(signupSchema, signup)

  if (state.status === 'success')
    return (
      <SuccessCard title={`Welcome, ${state.name}!`} message="Your account has been created." />
    )

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <FormField
        id="signup-name"
        label="Name"
        error={errors.name?.message}
        inputProps={{ type: 'text', autoComplete: 'name', ...register('name') }}
      />
      <FormField
        id="signup-email"
        label="Email"
        error={errors.email?.message}
        inputProps={{ type: 'email', autoComplete: 'email', ...register('email') }}
      />
      <FormField
        id="signup-password"
        label="Password"
        error={errors.password?.message}
        inputProps={{ type: 'password', autoComplete: 'new-password', ...register('password') }}
      />
      {state.status === 'error' && <ErrorAlert message={state.message} />}
      <Button type="submit" disabled={state.status === 'loading'} className="w-full">
        {state.status === 'loading' ? 'Creating account…' : 'Sign up'}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onNavigateToLogin}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Log in
        </button>
      </p>
    </form>
  )
}
