import mongoose from 'mongoose'
const { Schema, model, models } = mongoose

const ContactSchema = new Schema({
  fullName: { type: String, trim: true },
  name: { type: String, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  subject: { type: String, trim: true, enum: [
    // current subjects
    'request-software',
    'report-broken-link',
    'premium-access',
    'general-inquiry',
    'mobile-apps',
    'games',
    'feedback',
    'other',
    // legacy subjects (kept for backward compatibility)
    'hire-us',
    'join-us',
    'partnership',
    'support',
  ], default: 'other' },
  description: { type: String, trim: true },
  status: { type: String, enum: ['new','contacted','in-progress','closed','archived'], default: 'new' },
  isRead: { type: Boolean, default: false },
}, { timestamps: true })

export const Contact = models.Contact || model('Contact', ContactSchema)


