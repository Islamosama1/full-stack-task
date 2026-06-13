import { useState } from 'react'
import { SignupForm } from '@/components/auth/SignupForm'
import { LoginForm } from '@/components/auth/LoginForm'

type Page = 'signup' | 'login'

export default function App() {
  const [page, setPage] = useState<Page>('signup')

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md rounded-xl border bg-card p-8 shadow-sm">
        {page === 'signup' ? (
          <SignupForm onNavigateToLogin={() => setPage('login')} />
        ) : (
          <LoginForm onNavigateToSignup={() => setPage('signup')} />
        )}
      </div>
    </main>
  )
}
