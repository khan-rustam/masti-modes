import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy - Masti Mode",
  description: "Learn how Masti Mode collects, uses, and protects your personal information.",
}

export default function PrivacyPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl text-balance">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: March 2024</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl space-y-8">
            <div>
              <h2 className="mb-4 text-2xl font-bold">Introduction</h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                At Masti Mode, we take your privacy seriously. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you visit our website. Please read this privacy policy
                carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold">Information We Collect</h2>
              <p className="mb-4 text-muted-foreground leading-relaxed text-pretty">
                We may collect information about you in a variety of ways. The information we may collect on the site
                includes:
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-lg font-semibold">Personal Data</h3>
                  <p className="text-muted-foreground leading-relaxed text-pretty">
                    Personally identifiable information, such as your name, email address, and contact information, that
                    you voluntarily give to us when you register with the site or when you choose to participate in
                    various activities related to the site, such as newsletter subscriptions.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold">Derivative Data</h3>
                  <p className="text-muted-foreground leading-relaxed text-pretty">
                    Information our servers automatically collect when you access the site, such as your IP address,
                    your browser type, your operating system, your access times, and the pages you have viewed directly
                    before and after accessing the site.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold">Financial Data</h3>
                  <p className="text-muted-foreground leading-relaxed text-pretty">
                    Financial information, such as data related to your payment method (e.g., valid credit card number,
                    card brand, expiration date) that we may collect when you purchase, order, return, exchange, or
                    request information about our services from the site.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold">Use of Your Information</h2>
              <p className="mb-4 text-muted-foreground leading-relaxed text-pretty">
                Having accurate information about you permits us to provide you with a smooth, efficient, and customized
                experience. Specifically, we may use information collected about you via the site to:
              </p>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li>Create and manage your account</li>
                <li>Process your transactions and send you related information</li>
                <li>Email you regarding your account or order</li>
                <li>Enable user-to-user communications</li>
                <li>Fulfill and manage purchases, orders, payments, and other transactions</li>
                <li>Generate a personal profile about you to make future visits more personalized</li>
                <li>Increase the efficiency and operation of the site</li>
                <li>Monitor and analyze usage and trends to improve your experience</li>
                <li>Notify you of updates to the site</li>
                <li>Offer new products, services, and/or recommendations</li>
                <li>Perform other business activities as needed</li>
                <li>Request feedback and contact you about your use of the site</li>
                <li>Resolve disputes and troubleshoot problems</li>
                <li>Respond to product and customer service requests</li>
                <li>Send you a newsletter</li>
              </ul>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold">Disclosure of Your Information</h2>
              <p className="mb-4 text-muted-foreground leading-relaxed text-pretty">
                We may share information we have collected about you in certain situations. Your information may be
                disclosed as follows:
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-lg font-semibold">By Law or to Protect Rights</h3>
                  <p className="text-muted-foreground leading-relaxed text-pretty">
                    If we believe the release of information about you is necessary to respond to legal process, to
                    investigate or remedy potential violations of our policies, or to protect the rights, property, and
                    safety of others, we may share your information as permitted or required by any applicable law,
                    rule, or regulation.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold">Third-Party Service Providers</h3>
                  <p className="text-muted-foreground leading-relaxed text-pretty">
                    We may share your information with third parties that perform services for us or on our behalf,
                    including payment processing, data analysis, email delivery, hosting services, customer service, and
                    marketing assistance.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold">Security of Your Information</h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                We use administrative, technical, and physical security measures to help protect your personal
                information. While we have taken reasonable steps to secure the personal information you provide to us,
                please be aware that despite our efforts, no security measures are perfect or impenetrable, and no
                method of data transmission can be guaranteed against any interception or other type of misuse.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold">Cookies and Tracking Technologies</h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                We may use cookies, web beacons, tracking pixels, and other tracking technologies on the site to help
                customize the site and improve your experience. When you access the site, your personal information is
                not collected through the use of tracking technology. Most browsers are set to accept cookies by
                default. You can remove or reject cookies, but be aware that such action could affect the availability
                and functionality of the site.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold">Third-Party Websites</h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                The site may contain links to third-party websites and applications of interest, including
                advertisements and external services, that are not affiliated with us. Once you have used these links to
                leave the site, any information you provide to these third parties is not covered by this Privacy
                Policy, and we cannot guarantee the safety and privacy of your information.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold">Policy for Children</h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                We do not knowingly solicit information from or market to children under the age of 13. If we learn that
                we have collected personal information from a child under age 13 without verification of parental
                consent, we will delete that information as quickly as possible.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold">Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                We may update this Privacy Policy from time to time in order to reflect, for example, changes to our
                practices or for other operational, legal, or regulatory reasons. We will notify you of any changes by
                posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                If you have questions or comments about this Privacy Policy, please contact us at: support@mastimode.com
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
