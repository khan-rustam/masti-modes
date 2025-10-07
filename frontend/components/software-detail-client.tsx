"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Download, Star, Calendar, Monitor, ChevronLeft, ChevronRight, Check, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Software } from "@/lib/software-data"

interface SoftwareDetailClientProps {
  software: Software
}

export function SoftwareDetailClient({ software }: SoftwareDetailClientProps) {
  const [currentScreenshot, setCurrentScreenshot] = useState(0)

  const nextScreenshot = () => {
    setCurrentScreenshot((prev) => (prev + 1) % software.screenshots.length)
  }

  const prevScreenshot = () => {
    setCurrentScreenshot((prev) => (prev - 1 + software.screenshots.length) % software.screenshots.length)
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-5xl"
          >
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{software.category}</Badge>
              <Badge variant="outline">{software.license}</Badge>
            </div>

            <h1 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl text-balance">{software.name}</h1>

            <p className="mb-6 text-lg text-muted-foreground md:text-xl text-pretty">{software.description}</p>

            <div className="mb-8 flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{software.rating}</span>
                <span className="text-muted-foreground">Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" />
                <span className="font-semibold">{(software.downloads / 1000000).toFixed(1)}M</span>
                <span className="text-muted-foreground">Downloads</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="font-semibold">
                  {new Date(software.releaseDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="gap-2">
                <Download className="h-5 w-5" />
                Download {software.version}
              </Button>
              <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                <ExternalLink className="h-5 w-5" />
                Visit Website
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              {/* Screenshots */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-8"
              >
                <h2 className="mb-4 text-2xl font-bold">Screenshots</h2>
                <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={software.screenshots[currentScreenshot] || "/placeholder.svg"}
                    alt={`${software.name} screenshot ${currentScreenshot + 1}`}
                    fill
                    className="object-cover"
                  />
                  {software.screenshots.length > 1 && (
                    <>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute left-4 top-1/2 -translate-y-1/2"
                        onClick={prevScreenshot}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                        onClick={nextScreenshot}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                        {software.screenshots.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentScreenshot(index)}
                            className={`h-2 w-2 rounded-full transition-all ${
                              index === currentScreenshot ? "w-8 bg-primary" : "bg-primary/30"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8"
              >
                <h2 className="mb-4 text-2xl font-bold">About {software.name}</h2>
                <p className="text-muted-foreground leading-relaxed text-pretty">{software.longDescription}</p>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-8"
              >
                <h2 className="mb-4 text-2xl font-bold">Key Features</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {software.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* System Requirements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="mb-4 text-2xl font-bold">System Requirements</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {software.requirements.map((requirement, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted">
                            <Monitor className="h-3 w-3" />
                          </div>
                          <span className="text-sm">{requirement}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              {/* Download Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="sticky top-20"
              >
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Download Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Version</span>
                      <Badge variant="secondary">{software.version}</Badge>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">File Size</span>
                      <span className="text-sm font-medium">{software.fileSize}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">License</span>
                      <span className="text-sm font-medium">{software.license}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Developer</span>
                      <span className="text-sm font-medium">{software.developer}</span>
                    </div>
                    <Separator />
                    <div>
                      <span className="mb-2 block text-sm text-muted-foreground">Operating System</span>
                      <div className="flex flex-wrap gap-2">
                        {software.operatingSystem.map((os, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {os}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full gap-2" size="lg">
                      <Download className="h-5 w-5" />
                      Download Now
                    </Button>
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {software.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
