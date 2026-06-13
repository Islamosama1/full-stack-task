import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { SuccessCard } from '@/components/ui/SuccessCard'
import { useAuthForm } from '@/hooks/useAuthForm'
import { signup } from '@/lib/api'
import { signupSchema, type SignupFormData } from '@/lib/schemas'

interface SignupFormProps {
  onNavigateToLogin: () => void
}

export function SignupForm({ onNavigateToLogin }: SignupFormProps) {
  const { state, register, errors, submit, handleLogout, loggingOut } = useAuthForm<SignupFormData>(
    signupSchema,
    signup,
  )

  if (state.status === 'success')
    return (
      <SuccessCard
        title={`Welcome, ${state.name}!`}
        message="Your account has been created."
        onLogout={handleLogout}
        loggingOut={loggingOut}
      />
    )

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-6">
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Fill in the form below to get started
          </p>
        </div>

        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="signup-name">Full Name</FieldLabel>
          <Input
            id="signup-name"
            type="text"
            placeholder="John Doe"
            autoComplete="name"
            className="bg-background"
            {...register('name')}
          />
          {errors.name ? (
            <FieldError errors={[errors.name]} />
          ) : (
            <FieldDescription>Enter your full name.</FieldDescription>
          )}
        </Field>

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="signup-email">Email</FieldLabel>
          <Input
            id="signup-email"
            type="email"
            placeholder="m@example.com"
            autoComplete="email"
            className="bg-background"
            {...register('email')}
          />
          {errors.email ? (
            <FieldError errors={[errors.email]} />
          ) : (
            <FieldDescription>
              We&apos;ll use this to contact you. We will not share your email with anyone else.
            </FieldDescription>
          )}
        </Field>

        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="signup-password">Password</FieldLabel>
          <Input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            className="bg-background"
            {...register('password')}
          />
          {errors.password ? (
            <FieldError errors={[errors.password]} />
          ) : (
            <FieldDescription>
              Must be at least 8 characters with a letter, number, and special character.
            </FieldDescription>
          )}
        </Field>

        {state.status === 'error' && <FieldError>{state.message}</FieldError>}

        <Field>
          <Button type="submit" className="w-full" disabled={state.status === 'loading'}>
            {state.status === 'loading' ? 'Creating account…' : 'Create Account'}
          </Button>
        </Field>

        <FieldDescription className="px-6 text-center">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign in
          </button>
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}
