import jwt from 'jsonwebtoken'

const COOKIE_NAME = 'mm_session'

export function signSession(payload) {
  const secret = process.env.JWT_SECRET || 'change-me-in-prod'
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d'
  return jwt.sign(payload, secret, { expiresIn })
}

export function verifySession(token) {
  const secret = process.env.JWT_SECRET || 'change-me-in-prod'
  try {
    return jwt.verify(token, secret)
  } catch {
    return null
  }
}

export function setSessionCookieExpress(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  })
}

export function getSessionFromReq(req) {
  const token = req.cookies?.[COOKIE_NAME]
  return token ? verifySession(token) : null
}

export function clearSessionCookieExpress(res) {
  res.clearCookie(COOKIE_NAME, { path: '/' })
}

export const SESSION_COOKIE_NAME = COOKIE_NAME
