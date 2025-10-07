"use client"

import type React from "react"
import { useState } from "react"
import { Mail, MessageSquare, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { motion, useScroll, useTransform } from "framer-motion"
import { contactApi } from "@/lib/api"
import { toast } from "sonner"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

export default function ContactPage() {
  const ease = [0.22, 1, 0.36, 1] as const
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08, ease, when: "beforeChildren" } },
  }
  const itemUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }
  const { scrollYProgress } = useScroll()
  const yBubbleLeft = useTransform(scrollYProgress, [0, 1], [0, -80])
  const yBubbleRight = useTransform(scrollYProgress, [0, 1], [0, 100])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const subjectOptions = contactApi.getSubjectOptions().filter(o => o.value !== "")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return
    // Client-side validation
    const trimmed = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    }
    const allowedSubjects = new Set(subjectOptions.map(s => s.value))
    if (!trimmed.name || !trimmed.email || !trimmed.subject || !trimmed.message) {
      toast.warning("Please fill out all required fields.")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed.email)) {
      toast.warning("Please enter a valid email address.")
      return
    }
    if (!allowedSubjects.has(trimmed.subject)) {
      toast.warning("Please select a valid subject from the list.")
      return
    }
    if (trimmed.message.length < 10) {
      toast.warning("Message should be at least 10 characters.")
      return
    }
    try {
      setSubmitting(true)
      await contactApi.submit({
        name: trimmed.name,
        email: trimmed.email,
        subject: trimmed.subject,
        description: trimmed.message,
      })
      toast.success("Message sent successfully.")
      setFormData({ name: "", email: "", subject: "", message: "" })
    } catch (err: any) {
      const serverMsg = err?.data?.error || err?.message || "Failed to send message"
      toast.error(serverMsg)
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section aria-labelledby="contact-hero-title" className="relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <motion.div
          className="absolute top-16 left-10 w-64 h-64 bg-blue-400/30 rounded-full blur-3xl"
          style={{ y: yBubbleLeft }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-16 right-10 w-80 h-80 bg-purple-400/30 rounded-full blur-3xl"
          style={{ y: yBubbleRight }}
          animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div variants={container} initial="hidden" animate="show" className="mx-auto max-w-3xl text-center">
            <motion.h1 id="contact-hero-title" variants={itemUp} className="mb-4 text-4xl font-semibold md:text-5xl lg:text-6xl text-white text-balance tracking-tight">Get in Touch</motion.h1>
            <motion.p variants={itemUp} className="text-lg md:text-xl text-white/90 text-pretty max-w-2xl mx-auto">
              Have questions or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-3">
            {/* Contact Info Cards */}
            <div className="space-y-6 lg:col-span-1">
              <Card>
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Email Us</CardTitle>
                  <CardDescription>Send us an email anytime</CardDescription>
                </CardHeader>
                <CardContent>
                  <a href="mailto:support@mastimode.com" className="text-primary hover:underline">
                    support@mastimode.com
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Live Chat</CardTitle>
                  <CardDescription>Chat with our support team</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Available Monday - Friday, 9AM - 5PM EST</p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>Fill out the form below and we'll get back to you shortly.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your name"
                        className="rounded-sm"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        className="rounded-sm"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select
                      value={formData.subject}
                      onValueChange={(v) => setFormData(prev => ({ ...prev, subject: v }))}
                    >
                      <SelectTrigger className="rounded-sm w-full" id="subject">
                        <SelectValue placeholder="Please select a subject..." />
                      </SelectTrigger>
                      <SelectContent>
                        {subjectOptions
                          .filter(opt => opt.value !== "")
                          .map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us more..."
                      rows={6}
                      className="rounded-sm"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" disabled={submitting} className="w-full gap-2 sm:w-auto bg-orange-500 hover:bg-[#ffa500] text-white">
                    <Send className="h-4 w-4" />
                    {submitting ? 'Sending…' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
