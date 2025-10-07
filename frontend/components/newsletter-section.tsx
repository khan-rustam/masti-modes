"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function NewsletterSection() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    alert("Newsletter signup: " + email)
    setEmail("")
  }

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 p-12 md:p-16 text-center shadow-2xl"
        >
          {/* Animated gradient orbs */}
          <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse" />
          <div
            className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />

          <div className="relative z-10 mx-auto max-w-2xl">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-xl"
            >
              <Mail className="h-10 w-10 text-white" />
            </motion.div>

            <h2 className="mb-4 text-4xl font-extrabold text-white md:text-5xl text-balance drop-shadow-lg">
              Stay Updated with Latest Software
            </h2>

            <p className="mb-10 text-xl text-white/90 text-pretty leading-relaxed">
              Subscribe to our newsletter and get notified about new software releases, updates, and exclusive deals
              delivered to your inbox.
            </p>

            <form onSubmit={handleSubmit} className="mx-auto flex max-w-lg gap-3">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-14 pl-12 bg-white border-0 shadow-xl text-base"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-14 px-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-xl shadow-orange-500/50 border-0 font-semibold transition-all duration-300 hover:scale-105 gap-2"
              >
                Subscribe
                <Send className="h-5 w-5" />
              </Button>
            </form>

            <p className="mt-6 text-sm text-white/70">Join 50,000+ subscribers. Unsubscribe anytime.</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
