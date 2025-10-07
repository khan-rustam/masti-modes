import mongoose from 'mongoose'
import { hasValidMongoUri } from './env.js'

export async function connectToDatabase(mongoUri, dbName = 'mastimode') {
  if (!hasValidMongoUri(mongoUri)) {
    console.warn('MONGODB_URI is missing or invalid. Skipping DB connection.')
    return null
  }
  try {
    const conn = await mongoose.connect(mongoUri, { dbName })
    console.log('Connected to MongoDB✅✅')
    return conn
  } catch (err) {
    console.log('Error connecting to MongoDB❌❌', err)
    return null
  }
}


