import mongoose from 'mongoose'
const { Schema, model, models } = mongoose

const CategorySchema = new Schema({
  title: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
  description: { type: String, trim: true, maxlength: 500 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

CategorySchema.index({ title: 1 }, { unique: true })

export const Category = models.Category || model('Category', CategorySchema)


