"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Carousel, CarouselContent, CarouselItem, CarouselDots } from "@/components/ui/carousel"
import { TypingText } from "@/components/typing-text"
import { Star, TrendingUp, Clock, Zap, Shield, Users } from "lucide-react"
import { SoftwareCard } from "@/components/software-card"
import { NewsletterSection } from "@/components/newsletter-section"
import { Button } from "@/components/ui/button"
import { getLatestSoftware, getMostDownloaded, getRecentlyUpdated } from "@/lib/software-data"
import Link from "next/link"


export default function HomePage() {
  // Shared easing and variants for smooth in/out effects
  const ease = [0.22, 1, 0.36, 1] as const
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, ease, when: "beforeChildren" },
    },
  }
  const itemUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
  }

  // Parallax for hero background accents
  const { scrollYProgress } = useScroll()
  const yBubbleLeft = useTransform(scrollYProgress, [0, 1], [0, -120])
  const yBubbleRight = useTransform(scrollYProgress, [0, 1], [0, 140])
  const latestSoftware = getLatestSoftware(6)
  const mostDownloaded = getMostDownloaded(6)
  const recentlyUpdated = getRecentlyUpdated(6)

  return (
    <div className="flex flex-col">

      {/* Hero Section */}
      <section className="relative h-[100vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-blue-400/30 rounded-full blur-3xl"
          style={{ y: yBubbleLeft }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl"
          style={{ y: yBubbleRight }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[-1]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="absolute -left-32 top-1/3 h-64 w-64 rounded-full bg-white/10 blur-3xl"
              style={{ rotate: 0 }}
              animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-white/10 blur-3xl"
              animate={{ y: [0, 30, 0], rotate: [0, -8, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="text-center max-w-3xl md:max-w-4xl mx-auto"
          >
            <motion.div
              variants={itemUp}
              className="mb-6 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 text-white text-sm"
            >
              <Zap className="h-4 w-4" />
              <span>Trusted by millions worldwide</span>
            </motion.div>

            <motion.h1 variants={itemUp} className="text-5xl md:text-7xl font-semibold text-white mb-5 text-balance leading-tight font-apple tracking-tight">
              <span className="sr-only">Discover Premium Software</span>
              <span className="inline-block align-top">
                <TypingText
                  phrases={["Discover Premium Software.", "Download Safely.", "Find Your Next App."]}
                  speed={38}
                  pause={1100}
                />
              </span>
            </motion.h1>

            <motion.p variants={itemUp} className="text-xl md:text-2xl text-white/90 mb-8 text-pretty leading-relaxed max-w-2xl md:max-w-3xl mx-auto font-light">
              Your trusted source for downloading safe, verified, and high-quality software applications
            </motion.p>

            <motion.div variants={itemUp} className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-[#ffa500] text-white px-7 md:px-8 py-5 md:py-6 text-lg rounded-full shadow-xl shadow-orange-500/30"
                asChild
              >
                <Link href="#latest">Browse Software</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 px-7 md:px-8 py-5 md:py-6 text-lg rounded-full"
                asChild
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </motion.div>

            <motion.div variants={itemUp} className="mt-10 flex items-center justify-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span className="text-sm">Verified apps</span>
              </div>
              <div className="h-4 w-px bg-white/30" />
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span className="text-sm">Community trusted</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Masti Mode Section */}
      <section aria-labelledby="why-title" className="relative py-20 md:py-24 bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50">
        <div className="container mx-auto px-4">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.3 }}
            className="text-center mb-14 md:mb-16"
          >
            <h2 id="why-title" className="text-4xl md:text-5xl font-semibold mb-3 text-gradient relative inline-block after:content-[''] after:block after:mx-auto after:mt-3 after:h-1.5 after:w-[68%] after:rounded-full after:bg-gradient-to-r after:from-blue-500/60 after:to-purple-600/60">
              Why Choose Masti Mode
            </h2>
            <motion.p variants={itemUp} className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
              Experience the best software download platform with premium features
            </motion.p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.25 }}
            className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto"
          >
            {[
              {
                icon: Shield,
                title: "Safe & Secure",
                description: "All software is verified and scanned for malware to ensure your safety",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                icon: Zap,
                title: "Fast Downloads",
                description: "Lightning-fast download speeds with optimized servers worldwide",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                icon: Users,
                title: "Trusted Community",
                description: "Join millions of users who trust us for their software needs",
                gradient: "from-orange-500 to-red-500",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemUp}
                whileHover={{ y: -10, rotateX: 2, rotateY: -2 }}
                className="relative group [perspective:1000px]"
              >
                <div className="bg-white rounded-2xl p-7 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full border border-gray-100 will-change-transform [transform-style:preserve-3d]">
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6 shadow-lg`}
                  >
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2.5">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed font-light">{feature.description}</p>
                  <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute -inset-40 bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-12 translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-700" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Latest Uploads Section */}
      <section id="latest" aria-labelledby="latest-title" className="py-20 md:py-24 bg-gradient-to-b from-purple-50/20 via-white to-blue-50/30">
        <div className="container mx-auto px-4">
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.3 }} className="mb-12 md:mb-16 text-center">
            <h2 id="latest-title" className="mb-3 text-4xl font-semibold md:text-5xl text-gradient relative inline-block after:content-[''] after:block after:mx-auto after:mt-3 after:h-1.5 after:w-[64%] after:rounded-full after:bg-gradient-to-r after:from-blue-500/60 after:to-purple-600/60">
              Latest Uploads
            </h2>
            <motion.p variants={itemUp} className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
              Discover the newest software additions to our collection
            </motion.p>
          </motion.div>

          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.25 }}>
            <Carousel opts={{ align: 'start', loop: true, dragFree: true }}>
              <CarouselContent>
                {latestSoftware.map((software, index) => (
                  <CarouselItem key={software.id} className="basis-full sm:basis-1/2 md:basis-1/3 xl:basis-1/4">
                    <motion.div variants={itemUp}>
                      <SoftwareCard software={software} index={index} />
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselDots />
            </Carousel>
          </motion.div>
        </div>
      </section>

      <section aria-labelledby="most-title" className="py-20 md:py-24 bg-gradient-to-b from-blue-50/30 via-purple-50/20 to-white">
        <div className="container mx-auto px-4">
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.3 }} className="mb-12 md:mb-16 text-center">
            <h2 id="most-title" className="mb-3 text-4xl font-semibold md:text-5xl text-gradient relative inline-block after:content-[''] after:block after:mx-auto after:mt-3 after:h-1.5 after:w-[64%] after:rounded-full after:bg-gradient-to-r after:from-orange-500/60 after:to-pink-600/60">
              Most Downloaded
            </h2>
            <motion.p variants={itemUp} className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
              Popular software trusted by millions of users worldwide
            </motion.p>
          </motion.div>

          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.25 }}>
            <Carousel opts={{ align: 'start', loop: true, dragFree: true }}>
              <CarouselContent>
                {mostDownloaded.map((software, index) => (
                  <CarouselItem key={software.id} className="basis-full sm:basis-1/2 md:basis-1/3 xl:basis-1/4">
                    <motion.div variants={itemUp}>
                      <SoftwareCard software={software} index={index} />
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselDots />
            </Carousel>
          </motion.div>
        </div>
      </section>

      <section aria-labelledby="recent-title" className="py-20 md:py-24 bg-gradient-to-b from-white via-blue-50/30 to-purple-50/20">
        <div className="container mx-auto px-4">
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.3 }} className="mb-12 md:mb-16 text-center">
            <h2 id="recent-title" className="mb-3 text-4xl font-semibold md:text-5xl text-gradient relative inline-block after:content-[''] after:block after:mx-auto after:mt-3 after:h-1.5 after:w-[64%] after:rounded-full after:bg-gradient-to-r after:from-purple-500/60 after:to-blue-600/60">
              Recently Updated
            </h2>
            <motion.p variants={itemUp} className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
              Fresh updates with new features and improvements
            </motion.p>
          </motion.div>

          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.25 }}>
            <Carousel opts={{ align: 'start', loop: true, dragFree: true }}>
              <CarouselContent>
                {recentlyUpdated.map((software, index) => (
                  <CarouselItem key={software.id} className="basis-full sm:basis-1/2 md:basis-1/3 xl:basis-1/4">
                    <motion.div variants={itemUp}>
                      <SoftwareCard software={software} index={index} />
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselDots />
            </Carousel>
          </motion.div>
        </div>
      </section>

      <NewsletterSection />
    </div>
  )
}
