import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { PageLayout } from "@/components/layout/page-layout"

export default function PrivacyPolicyPage() {
  return (
    <PageLayout headerVariant="minimal">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <Card className="border">
          <CardContent className="pt-6 prose prose-sm max-w-none dark:prose-invert">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p>
                Welcome to Chromakit. We respect your privacy and are committed to protecting your personal data.
                This privacy policy explains how we collect, use, and safeguard your information when you use our
                image processing application.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
              <h3 className="text-xl font-semibold mb-3">2.1 Account Information</h3>
              <p>When you create an account, we collect:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Email address</li>
                <li>Name (if provided via OAuth)</li>
                <li>Profile picture (if provided via OAuth)</li>
                <li>Authentication tokens from OAuth providers (Google, Facebook)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">2.2 Images and Content</h3>
              <p>
                We temporarily store the images you upload for processing. Images are stored securely and are
                only accessible to you. We do not use your images for any purpose other than providing our
                image processing services.
              </p>

              <h3 className="text-xl font-semibold mb-3">2.3 Usage Data</h3>
              <p>We automatically collect:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>IP address</li>
                <li>Usage patterns and feature interactions</li>
                <li>Error logs and performance data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Provide and maintain our image processing services</li>
                <li>Authenticate your account and manage access</li>
                <li>Process and store your images temporarily</li>
                <li>Improve our services and develop new features</li>
                <li>Send you service-related notifications</li>
                <li>Detect and prevent fraud or abuse</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Data Storage and Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal data:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Encrypted data transmission using HTTPS/TLS</li>
                <li>Secure authentication using industry-standard OAuth 2.0</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication requirements</li>
                <li>Automated backups and disaster recovery procedures</li>
              </ul>
              <p>
                Images are stored temporarily during processing and can be deleted at any time from your
                dashboard. We automatically delete images after 90 days of inactivity.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Third-Party Services</h2>
              <p>We use the following third-party services:</p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Supabase:</strong> Authentication and database services</li>
                <li><strong>Google OAuth:</strong> Optional sign-in method</li>
                <li><strong>Facebook OAuth:</strong> Optional sign-in method</li>
                <li><strong>Vercel Analytics:</strong> Privacy-friendly analytics</li>
              </ul>
              <p>
                These services have their own privacy policies. We only share the minimum necessary information
                required for authentication and service functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct your information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                <li><strong>Portability:</strong> Export your data in a common format</li>
                <li><strong>Objection:</strong> Object to certain data processing activities</li>
                <li><strong>Withdraw Consent:</strong> Revoke consent for data processing</li>
              </ul>
              <p>
                To exercise these rights, please visit our <Link href="/data-deletion" className="text-primary hover:underline">
                Data Deletion page</Link> or contact us at privacy@chromakit.com.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
              <p>
                We retain your personal data only as long as necessary for the purposes outlined in this policy:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Account information: Until you delete your account or request deletion</li>
                <li>Images: 90 days after last modification or until manually deleted</li>
                <li>Usage logs: 12 months for security and analytics</li>
                <li>Legal compliance data: As required by applicable law</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Cookies and Tracking</h2>
              <p>
                We use essential cookies for authentication and session management. We also use privacy-friendly
                analytics that do not track individual users across websites. You can control cookie preferences
                through your browser settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
              <p>
                Our service is not intended for children under 13 years of age. We do not knowingly collect
                personal information from children. If you believe we have inadvertently collected information
                from a child, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. International Data Transfers</h2>
              <p>
                Your data may be processed in countries outside your residence. We ensure appropriate safeguards
                are in place to protect your data in compliance with applicable data protection laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any significant
                changes by posting the new policy on this page and updating the "Last updated" date. Your
                continued use of our service after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
              <p>
                If you have questions about this privacy policy or how we handle your data, please contact us:
              </p>
              <ul className="list-none pl-0 mb-4">
                <li>Email: privacy@chromakit.com</li>
                <li>Data Protection Officer: dpo@chromakit.com</li>
              </ul>
            </section>
          </CardContent>
        </Card>

        <div className="mt-8 flex gap-4 justify-center">
          <Link href="/terms">
            <Button variant="outline">View Terms of Service</Button>
          </Link>
          <Link href="/data-deletion">
            <Button variant="outline">Data Deletion Instructions</Button>
          </Link>
        </div>
      </div>
    </PageLayout>
  )
}
