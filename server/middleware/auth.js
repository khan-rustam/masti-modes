import { getSessionFromReq } from '../auth/session-express.js'

export function attachSession(req, _res, next) {
  req.session = getSessionFromReq(req)
  next()
}

export function requireAuth(req, res, next) {
  const session = req.session || getSessionFromReq(req)
  if (!session) return res.status(401).json({ ok: false, error: 'Unauthorized' })
  next()
}

export function requireAdmin(req, res, next) {
  const session = req.session || getSessionFromReq(req)
  if (!session || !session.isAdmin) return res.status(403).json({ ok: false, error: 'Forbidden' })
  next()
}


