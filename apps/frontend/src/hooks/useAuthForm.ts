import { useForm, type FieldValues, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type ZodSchema } from 'zod'
import { useMutation } from '@tanstack/react-query'
import type { FormState, AuthResponse, ApiResult } from '@/lib/types'

export function useAuthForm<TData extends FieldValues>(
  schema: ZodSchema<TData>,
  apiCall: (data: TData) => Promise<ApiResult<AuthResponse>>,
) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<TData>({ resolver: zodResolver(schema as any) })

  const mutation = useMutation({
    mutationFn: async (data: TData) => {
      const result = await apiCall(data)
      if (!result.ok) throw new Error(result.message)
      return result.data
    },
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken)
    },
  })

  const state: FormState = mutation.isPending
    ? { status: 'loading' }
    : mutation.isSuccess
      ? { status: 'success', name: mutation.data.user.name }
      : mutation.isError
        ? { status: 'error', message: mutation.error.message }
        : { status: 'idle' }

  const onSubmit: SubmitHandler<TData> = (data) => mutation.mutate(data)

  return { state, register, errors, submit: handleSubmit(onSubmit) }
}
