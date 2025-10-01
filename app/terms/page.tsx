import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ImageIcon, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">Chromakit</span>
          </div>
          <Link href="/">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <Card className="border">
          <CardContent className="pt-6 prose prose-sm max-w-none dark:prose-invert">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Chromakit ("Service", "Application", "we", "us", or "our"), you accept
                and agree to be bound by these Terms of Service. If you do not agree to these terms, please do
                not use our Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
              <p>
                Chromakit is a web-based image processing application that provides tools for editing,
                transforming, and enhancing digital images. Our Service includes but is not limited to:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Image upload and storage</li>
                <li>Brightness and contrast adjustments</li>
                <li>Color channel manipulation (RGB/CMY)</li>
                <li>Image transformations (rotate, scale, crop, translate)</li>
                <li>Filters and effects (grayscale, negative, binarization)</li>
                <li>Image fusion and blending</li>
                <li>Histogram analysis</li>
                <li>Edit history tracking</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Account Registration and Security</h2>
              <h3 className="text-xl font-semibold mb-3">3.1 Account Creation</h3>
              <p>
                To use certain features of our Service, you must create an account. You may register using:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Email and password</li>
                <li>Google OAuth</li>
                <li>Facebook OAuth</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">3.2 Account Responsibilities</h3>
              <p>You agree to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Provide accurate and complete information during registration</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Be responsible for all activities under your account</li>
                <li>Not share your account with others</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">3.3 Age Requirement</h3>
              <p>
                You must be at least 13 years old to use our Service. If you are between 13 and 18, you must
                have parental or guardian consent.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use Policy</h2>
              <h3 className="text-xl font-semibold mb-3">4.1 Permitted Use</h3>
              <p>You may use our Service for lawful purposes related to image processing and editing.</p>

              <h3 className="text-xl font-semibold mb-3">4.2 Prohibited Activities</h3>
              <p>You agree NOT to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Upload illegal, harmful, or offensive content</li>
                <li>Violate intellectual property rights of others</li>
                <li>Upload images containing malware or viruses</li>
                <li>Attempt to breach security or authentication systems</li>
                <li>Use automated tools to scrape or harvest data</li>
                <li>Interfere with or disrupt the Service</li>
                <li>Impersonate others or provide false information</li>
                <li>Use the Service for spam or unauthorized advertising</li>
                <li>Process images you don't have rights to use</li>
                <li>Reverse engineer or attempt to extract source code</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Content and Intellectual Property</h2>
              <h3 className="text-xl font-semibold mb-3">5.1 Your Content</h3>
              <p>
                You retain all ownership rights to images you upload. By uploading content, you grant us a
                limited license to:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Store and process your images to provide the Service</li>
                <li>Create temporary copies for processing operations</li>
                <li>Display your images back to you</li>
              </ul>
              <p>
                We do NOT claim ownership of your content and will NOT use your images for any purpose other
                than providing our Service.
              </p>

              <h3 className="text-xl font-semibold mb-3">5.2 Our Intellectual Property</h3>
              <p>
                The Service, including its software, design, features, and branding, is owned by Chromakit and
                protected by copyright, trademark, and other intellectual property laws. You may not copy,
                modify, distribute, or create derivative works without our express permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Service Availability and Modifications</h2>
              <h3 className="text-xl font-semibold mb-3">6.1 Service Availability</h3>
              <p>
                We strive to provide reliable service but do not guarantee uninterrupted access. The Service
                may be temporarily unavailable due to maintenance, updates, or technical issues.
              </p>

              <h3 className="text-xl font-semibold mb-3">6.2 Modifications</h3>
              <p>
                We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time
                with or without notice. We are not liable for any modifications or discontinuation.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Usage Limits and Fair Use</h2>
              <p>To ensure fair access for all users, we impose the following limits:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Maximum file size: 10MB per image</li>
                <li>Supported formats: JPG, PNG, BMP</li>
                <li>Free plan: Up to 50 images per month</li>
                <li>Storage retention: 90 days of inactivity</li>
              </ul>
              <p>
                We may adjust these limits at our discretion. Abuse or excessive use may result in rate limiting
                or account suspension.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Privacy and Data Protection</h2>
              <p>
                Your privacy is important to us. Our collection and use of personal data is governed by our{" "}
                <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>, which is
                incorporated into these Terms by reference.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Disclaimers and Warranties</h2>
              <h3 className="text-xl font-semibold mb-3">9.1 "AS IS" Service</h3>
              <p>
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER
                EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
                PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
              </p>

              <h3 className="text-xl font-semibold mb-3">9.2 No Guarantees</h3>
              <p>We do not guarantee that:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>The Service will be error-free or uninterrupted</li>
                <li>Defects will be corrected</li>
                <li>The Service is free from viruses or harmful components</li>
                <li>Results will meet your expectations</li>
                <li>Data will never be lost (maintain your own backups)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, CHROMAKIT SHALL NOT BE LIABLE FOR ANY INDIRECT,
                INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF
                PROFITS, DATA, USE, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Your use or inability to use the Service</li>
                <li>Unauthorized access to your data</li>
                <li>Errors or omissions in the Service</li>
                <li>Any third-party content or conduct</li>
              </ul>
              <p>
                Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim,
                or $100, whichever is greater.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless Chromakit and its affiliates from any claims, losses,
                damages, liabilities, and expenses (including legal fees) arising from:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Your use of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of others</li>
                <li>Content you upload or process</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">12. Termination</h2>
              <h3 className="text-xl font-semibold mb-3">12.1 Termination by You</h3>
              <p>
                You may stop using the Service and delete your account at any time through your account settings
                or by contacting us.
              </p>

              <h3 className="text-xl font-semibold mb-3">12.2 Termination by Us</h3>
              <p>We may suspend or terminate your account if:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>You violate these Terms</li>
                <li>You engage in illegal or harmful activities</li>
                <li>Your account is inactive for an extended period</li>
                <li>Required by law or legal process</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">12.3 Effect of Termination</h3>
              <p>
                Upon termination, your right to use the Service ceases immediately. We will delete your data
                according to our retention policies, except where required by law to retain it.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">13. Dispute Resolution</h2>
              <h3 className="text-xl font-semibold mb-3">13.1 Governing Law</h3>
              <p>
                These Terms are governed by the laws of [Your Jurisdiction], without regard to conflict of law
                principles.
              </p>

              <h3 className="text-xl font-semibold mb-3">13.2 Informal Resolution</h3>
              <p>
                Before filing a claim, you agree to contact us at legal@chromakit.com to attempt to resolve
                the dispute informally.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">14. Changes to Terms</h2>
              <p>
                We may update these Terms from time to time. Material changes will be notified via email or
                through the Service. Your continued use after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">15. General Provisions</h2>
              <h3 className="text-xl font-semibold mb-3">15.1 Entire Agreement</h3>
              <p>
                These Terms, together with our Privacy Policy, constitute the entire agreement between you and
                Chromakit.
              </p>

              <h3 className="text-xl font-semibold mb-3">15.2 Severability</h3>
              <p>
                If any provision is found unenforceable, the remaining provisions will continue in full effect.
              </p>

              <h3 className="text-xl font-semibold mb-3">15.3 Waiver</h3>
              <p>
                Our failure to enforce any right or provision does not constitute a waiver of such right.
              </p>

              <h3 className="text-xl font-semibold mb-3">15.4 Assignment</h3>
              <p>
                You may not assign these Terms without our consent. We may assign these Terms without restriction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">16. Contact Information</h2>
              <p>
                For questions about these Terms, please contact us:
              </p>
              <ul className="list-none pl-0 mb-4">
                <li>Email: legal@chromakit.com</li>
                <li>Support: support@chromakit.com</li>
              </ul>
            </section>
          </CardContent>
        </Card>

        <div className="mt-8 flex gap-4 justify-center">
          <Link href="/privacy">
            <Button variant="outline">View Privacy Policy</Button>
          </Link>
          <Link href="/data-deletion">
            <Button variant="outline">Data Deletion Instructions</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
