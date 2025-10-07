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
  name: z.string().min(2, 'Enter your full name').max(80, 'Too long'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Minimum 8 characters').max(128, 'Too long'),
  confirmPassword: z.string().min(8, 'Minimum 8 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export default function RegisterPage() {
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
        const data = await authApi.register({ name: values.name, email: values.email, password: values.password })
        if (!data.ok) setError(data.error || 'Registration failed')
        else {
          toast({ title: 'Account created' })
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
              <CardTitle>Create your account</CardTitle>
              <CardDescription>Join the community in a minute</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Jane Doe" {...register('name')} aria-invalid={!!errors.name} />
                  {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                </div>
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
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <PasswordInput id="confirmPassword" placeholder="********" {...register('confirmPassword')} aria-invalid={!!errors.confirmPassword} />
                  {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}
                </div>
                {error && <div className="rounded-md bg-red-50 text-red-700 px-3 py-2 text-sm">{error}</div>}
                <Button type="submit" className="w-full bg-orange-500 hover:bg-[#ffa500] text-white" disabled={isPending}>
                  {isPending ? 'Creating account...' : 'Create account'}
                </Button>
              </form>
              <p className="mt-4 text-sm text-center text-muted-foreground">Already have an account? <Link className="text-[#ffa500] hover:underline" href="/login">Sign in</Link></p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}


