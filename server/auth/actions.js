"use server"
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { connectMongo } from '../db.js'
import { User } from '../models/User.js'
import { setSessionCookie, signSession, clearSession } from './session.js'

const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).max(128),
})

const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).max(128),
})

export async function registerAction(formData) {
  const data = Object.fromEntries(formData)
  const parsed = registerSchema.safeParse(data)
  if (!parsed.success) return { ok: false, error: 'Invalid input' }

  await connectMongo()
  const existing = await User.findOne({ email: parsed.data.email })
  if (existing) return { ok: false, error: 'Email already in use' }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12)
  const user = await User.create({ name: parsed.data.name, email: parsed.data.email, passwordHash })

  const token = signSession({ uid: user._id.toString(), name: user.name, email: user.email, isAdmin: !!user.isAdmin })
  setSessionCookie(token)
  return { ok: true }
}

export async function loginAction(formData) {
  const data = Object.fromEntries(formData)
  const parsed = loginSchema.safeParse(data)
  if (!parsed.success) return { ok: false, error: 'Invalid credentials' }

  await connectMongo()
  const user = await User.findOne({ email: parsed.data.email })
  if (!user) return { ok: false, error: 'Invalid credentials' }
  const valid = await bcrypt.compare(parsed.data.password, user.passwordHash)
  if (!valid) return { ok: false, error: 'Invalid credentials' }

  const token = signSession({ uid: user._id.toString(), name: user.name, email: user.email, isAdmin: !!user.isAdmin })
  setSessionCookie(token)
  return { ok: true }
}

export async function logoutAction() {
  clearSession()
  return { ok: true }
}


