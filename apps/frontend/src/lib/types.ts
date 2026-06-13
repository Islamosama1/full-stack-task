export interface AuthUser {
  id: string
  name: string
  email: string
  createdAt: string
}

export interface AuthResponse {
  user: AuthUser
}

export type ApiResult<T> = { ok: true; data: T } | { ok: false; status: number; message: string }

export type FormState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; name: string }
  | { status: 'error'; message: string }
