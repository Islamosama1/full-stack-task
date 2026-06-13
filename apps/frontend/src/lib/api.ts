import axios, { isAxiosError } from 'axios'
import type { AuthResponse, ApiResult } from './types'
import type { LoginFormData, SignupFormData } from './schemas'

export type { AuthUser, AuthResponse, ApiResult } from './types'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',
  headers: { 'Content-Type': 'application/json' },
})

function extractMessage(data: unknown): string {
  const raw = (data as { message?: string | string[] })?.message
  return (Array.isArray(raw) ? raw[0] : raw) || 'Something went wrong. Please try again.'
}

async function post<T>(
  path: string,
  body: unknown,
  statusMessages: Record<number, string> = {},
): Promise<ApiResult<T>> {
  try {
    const { data } = await client.post<T>(path, body)
    return { ok: true, data }
  } catch (err) {
    if (isAxiosError(err) && err.response) {
      const status = err.response.status
      const message = statusMessages[status] ?? extractMessage(err.response.data)
      return { ok: false, status, message }
    }
    return { ok: false, status: 0, message: 'Unable to reach the server.' }
  }
}

export const signup = (body: SignupFormData) =>
  post<AuthResponse>('/auth/signup', body, { 409: 'That email is already registered.' })

export const login = (body: LoginFormData) =>
  post<AuthResponse>('/auth/login', body, { 401: 'Invalid email or password.' })
