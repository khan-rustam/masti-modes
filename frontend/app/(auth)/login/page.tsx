"use client"
import { useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input, PasswordInput } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
// Using Express API instead of server actions
import { motion } from 'framer-motion'
import { authApi } from '@/lib/api'
import { toast } from '@/hooks/use-toast'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) })

  // If already logged in, redirect home
  useEffect(() => {
    authApi.me().then((r) => { if (r.ok) window.location.href = '/' }).catch(() => {})
  }, [])

  const onSubmit = (values: z.infer<typeof schema>) => {
    setError(null)
    startTransition(async () => {
      try {
        const data = await authApi.login(values)
        if (!data.ok) setError(data.error || 'Login failed')
        else {
          toast({ title: 'Signed in' })
          window.location.href = '/'
        }
      } catch (e) {
        setError('Network error')
      }
    })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      <div className="relative z-10 w-full max-w-md px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="backdrop-blur-md/0 border-white/20 bg-white/95">
            <CardHeader>
              <CardTitle>Welcome back</CardTitle>
              <CardDescription>Login to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" {...register('email')} aria-invalid={!!errors.email} />
                  {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <PasswordInput id="password" placeholder="********" {...register('password')} aria-invalid={!!errors.password} />
                  {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
                </div>
                {error && <div className="rounded-md bg-red-50 text-red-700 px-3 py-2 text-sm">{error}</div>}
                <Button type="submit" className="w-full bg-orange-500 hover:bg-[#ffa500] text-white" disabled={isPending}>
                  {isPending ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
              <p className="mt-4 text-sm text-center text-muted-foreground">Don&apos;t have an account? <Link className="text-[#ffa500] hover:underline" href="/register">Create one</Link></p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}


