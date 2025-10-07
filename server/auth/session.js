import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { env } from '../index.js'

const COOKIE_NAME = 'mm_session'

export function signSession(payload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN })
}

export function verifySession(token) {
  try {
    return jwt.verify(token, env.JWT_SECRET)
  } catch {
    return null
  }
}

export function setSessionCookie(token) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  })
}

export function getSession() {
  const token = cookies().get(COOKIE_NAME)?.value
  return token ? verifySession(token) : null
}

export function clearSession() {
  cookies().set(COOKIE_NAME, '', { maxAge: 0, path: '/' })
}


