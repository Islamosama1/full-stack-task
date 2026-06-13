import { useState } from 'react'
import { SignupForm } from '@/components/auth/SignupForm'
import { LoginForm } from '@/components/auth/LoginForm'

type Page = 'signup' | 'login'

export default function App() {
  const [page, setPage] = useState<Page>('signup')

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-2xl font-semibold">
          {page === 'signup' ? 'Create an account' : 'Welcome back'}
        </h1>
        {page === 'signup' ? (
          <SignupForm onNavigateToLogin={() => setPage('login')} />
        ) : (
          <LoginForm onNavigateToSignup={() => setPage('signup')} />
        )}
      </div>
    </main>
  )
}
