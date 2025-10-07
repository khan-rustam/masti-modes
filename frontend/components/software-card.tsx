"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useMotionValue } from "framer-motion"
import { Download, Star, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Software } from "@/lib/software-data"

interface SoftwareCardProps {
  software: Software
  index?: number
}

export function SoftwareCard({ software, index = 0 }: SoftwareCardProps) {
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const px = (x / rect.width) * 2 - 1
    const py = (y / rect.height) * 2 - 1
    rotateY.set(px * 6)
    rotateX.set(-py * 6)
  }
  const handleMouseLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.25), ease: [0.22, 1, 0.36, 1] }}
      className="h-full [perspective:1000px]"
    >
      <Link href={`/software/${software.id}`} className="block h-full">
        <Card
          className="group relative h-full overflow-hidden rounded-md border border-gray-100 bg-white shadow-sm hover:shadow-none transition-all duration-300 will-change-transform [transform-style:preserve-3d] hover:-translate-y-1.5"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY }}
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
            <motion.div
              className="h-full w-full"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Image
                src={"/placeholder.jpg"}
                alt={software.name}
                fill
                className="object-cover"
              />
            </motion.div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute -inset-40 bg-gradient-to-r from-transparent via-white/25 to-transparent rotate-12 translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-700" />
            </div>

            <div className="absolute right-3 top-3">
              <Badge className="bg-white/95 text-primary shadow backdrop-blur-sm border-0">
                v{software.version}
              </Badge>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md rounded-full px-3 py-1.5">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <span>{software.rating}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md rounded-full px-3 py-1.5">
                  <Download className="h-3.5 w-3.5" />
                  <span>{(software.downloads / 1000000).toFixed(1)}M</span>
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-5 space-y-3">
            <div className="space-y-2">
              <h3 className="text-xl font-medium leading-tight text-balance transition-colors duration-300 group-hover:text-primary line-clamp-2">
                {software.name}
              </h3>

              <p className="text-sm text-muted-foreground line-clamp-2 text-pretty leading-relaxed font-light min-h-[3.25rem]">
                {software.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Badge variant="secondary" className="text-xs font-normal">
                {software.category}
              </Badge>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" />
                  <span>{software.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  <span>{(software.downloads / 1000).toFixed(0)}k</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
