import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms & Conditions - Masti Mode",
  description: "Read our terms and conditions for using Masti Mode software download platform.",
}

export default function TermsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl text-balance">Terms & Conditions</h1>
            <p className="text-muted-foreground">Last updated: March 2024</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl space-y-8">
            <div>
              <h2 className="mb-4 text-2xl font-bold">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                By accessing and using Masti Mode, you accept and agree to be bound by the terms and provision of this
                agreement. If you do not agree to these terms, please do not use our service.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold">2. Use License</h2>
              <p className="mb-4 text-muted-foreground leading-relaxed text-pretty">
                Permission is granted to temporarily download one copy of the materials (information or software) on
                Masti Mode's website for personal, non-commercial transitory viewing only. This is the grant of a
                license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to decompile or reverse engineer any software contained on Masti Mode's website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold">3. Disclaimer</h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                The materials on Masti Mode's website are provided on an 'as is' basis. Masti Mode makes no warranties,
                expressed or implied, and hereby disclaims and negates all other warranties including, without
                limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or
                non-infringement of intellectual property or other violation of rights.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold">4. Software Downloads</h2>
              <p className="mb-4 text-muted-foreground leading-relaxed text-pretty">
                Masti Mode provides links and information about software applications. Users acknowledge that:
              </p>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li>Software is provided by third-party developers and is subject to their respective licenses</li>
                <li>Users are responsible for reading and accepting the license agreements of downloaded software</li>
                <li>Masti Mode is not responsible for any damages caused by downloaded software</li>
                <li>Users should verify software authenticity and scan for malware before installation</li>
              </ul>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold">5. Limitations</h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                In no event shall Masti Mode or its suppliers be liable for any damages (including, without limitation,
                damages for loss of data or profit, or due to business interruption) arising out of the use or inability
                to use the materials on Masti Mode's website, even if Masti Mode or a Masti Mode authorized
                representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold">6. Accuracy of Materials</h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                The materials appearing on Masti Mode's website could include technical, typographical, or photographic
                errors. Masti Mode does not warrant that any of the materials on its website are accurate, complete, or
                current. Masti Mode may make changes to the materials contained on its website at any time without
                notice.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold">7. Links</h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                Masti Mode has not reviewed all of the sites linked to its website and is not responsible for the
                contents of any such linked site. The inclusion of any link does not imply endorsement by Masti Mode of
                the site. Use of any such linked website is at the user's own risk.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold">8. Modifications</h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                Masti Mode may revise these terms of service for its website at any time without notice. By using this
                website you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold">9. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                These terms and conditions are governed by and construed in accordance with the laws and you irrevocably
                submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold">10. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                If you have any questions about these Terms & Conditions, please contact us at support@mastimode.com.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
