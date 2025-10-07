import bcrypt from 'bcryptjs'
import { User } from '../models/User.js'
import { signSession, setSessionCookieExpress, clearSessionCookieExpress } from '../auth/session-express.js'
import { registerSchema, loginSchema } from '../validators/auth.js'

export async function register(req, res) {
  try {
    const parsed = registerSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ ok: false, error: 'Invalid input' })
    const exists = await User.findOne({ email: parsed.data.email })
    if (exists) return res.status(409).json({ ok: false, error: 'Email already in use' })
    const passwordHash = await bcrypt.hash(parsed.data.password, 12)
    const user = await User.create({
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
    })
    const token = signSession({
      uid: user._id.toString(),
      name: user.name,
      email: user.email,
      isAdmin: !!user.isAdmin,
    })
    setSessionCookieExpress(res, token)
    return res.json({ ok: true })
  } catch (e) {
    console.error('Register error', e)
    return res.status(500).json({ ok: false, error: 'Server error' })
  }
}

export async function login(req, res) {
  try {
    const parsed = loginSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ ok: false, error: 'Invalid credentials' })
    const user = await User.findOne({ email: parsed.data.email })
    if (!user) return res.status(400).json({ ok: false, error: 'Invalid credentials' })
    const valid = await bcrypt.compare(parsed.data.password, user.passwordHash)
    if (!valid) return res.status(400).json({ ok: false, error: 'Invalid credentials' })
    const token = signSession({
      uid: user._id.toString(),
      name: user.name,
      email: user.email,
      isAdmin: !!user.isAdmin,
    })
    setSessionCookieExpress(res, token)
    return res.json({ ok: true })
  } catch (e) {
    console.error('Login error', e)
    return res.status(500).json({ ok: false, error: 'Server error' })
  }
}

export function logout(_req, res) {
  clearSessionCookieExpress(res)
  return res.json({ ok: true })
}

export function me(req, res) {
  const session = req.session
  if (!session) return res.status(401).json({ ok: false })
  return res.json({ ok: true, user: session })
}


