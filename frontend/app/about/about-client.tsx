"use client";
import { Shield, Zap, Users, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, useScroll, useTransform } from "framer-motion";

export default function AboutClientPage() {
  const ease = [0.22, 1, 0.36, 1] as const;
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, ease, when: "beforeChildren" },
    },
  };
  const itemUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
  };
  const { scrollYProgress } = useScroll();
  const yBubbleLeft = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const yBubbleRight = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const features = [
    {
      icon: Shield,
      title: "Safe & Secure",
      description:
        "All software is scanned and verified to ensure your safety and security.",
    },
    {
      icon: Zap,
      title: "Fast Downloads",
      description:
        "Experience lightning-fast download speeds with our optimized servers.",
    },
    {
      icon: Users,
      title: "Trusted by Millions",
      description:
        "Join millions of users who trust Masti Mode for their software needs.",
    },
    {
      icon: Award,
      title: "Quality Assured",
      description:
        "We only feature high-quality, tested software from reputable developers.",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section
        aria-labelledby="about-hero-title"
        className="relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700"
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <motion.div
          className="absolute top-16 left-10 w-64 h-64 bg-blue-400/30 rounded-full blur-3xl"
          style={{ y: yBubbleLeft }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-16 right-10 w-80 h-80 bg-purple-400/30 rounded-full blur-3xl"
          style={{ y: yBubbleRight }}
          animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="mx-auto max-w-3xl text-center"
          >
            <motion.h1
              id="about-hero-title"
              variants={itemUp}
              className="mb-4 text-4xl md:text-5xl lg:text-6xl font-semibold text-white text-balance tracking-tight"
            >
              About Masti Mode
            </motion.h1>
            <motion.p
              variants={itemUp}
              className="text-lg md:text-xl text-white/90 text-pretty max-w-2xl mx-auto"
            >
              Your trusted destination for discovering and downloading the best
              software applications.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-3xl font-semibold md:text-4xl">
              Our Mission
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p className="text-pretty">
                At Masti Mode, we believe that everyone should have access to
                high-quality software without the hassle of searching through
                countless websites. Our mission is to provide a centralized
                platform where users can discover, learn about, and download the
                software they need with confidence.
              </p>
              <p className="text-pretty">
                We carefully curate our software collection, ensuring that every
                application meets our strict standards for quality, security,
                and functionality. Whether you're looking for productivity
                tools, creative software, or entertainment applications, we've
                got you covered.
              </p>
              <p className="text-pretty">
                Our team works tirelessly to keep our database updated with the
                latest versions, provide accurate information, and maintain a
                user-friendly experience that makes finding and downloading
                software as simple as possible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-muted/30 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-10 md:mb-12 text-center text-3xl font-semibold md:text-4xl">
              Why Choose Masti Mode?
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={index}
                    className="border-2 transition-all hover:border-primary/50 hover:shadow-lg"
                  >
                    <CardContent className="p-6">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="mb-2 text-xl font-semibold">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-pretty">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-3xl font-semibold md:text-4xl">
              Our Values
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-xl font-semibold">Transparency</h3>
                <p className="text-muted-foreground leading-relaxed text-pretty">
                  We provide clear, accurate information about every software
                  application, including system requirements, licensing, and any
                  potential limitations.
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold">Security</h3>
                <p className="text-muted-foreground leading-relaxed text-pretty">
                  Your safety is our priority. We scan all software for malware
                  and only feature applications from trusted sources.
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold">User Experience</h3>
                <p className="text-muted-foreground leading-relaxed text-pretty">
                  We continuously improve our platform to ensure a seamless,
                  intuitive experience for all users, regardless of their
                  technical expertise.
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold">Community</h3>
                <p className="text-muted-foreground leading-relaxed text-pretty">
                  We value our community's feedback and actively work to address
                  user needs and suggestions to make Masti Mode better for
                  everyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
