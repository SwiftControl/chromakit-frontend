"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ImageIcon, ArrowLeft, Trash2, AlertCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { useState } from "react"

export default function DataDeletionPage() {
  const { user } = useAuth()
  const [showDeleteSection, setShowDeleteSection] = useState(false)

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
          <h1 className="text-4xl font-bold tracking-tight mb-2">Data Deletion Instructions</h1>
          <p className="text-muted-foreground">
            Learn how to request deletion of your personal data and account
          </p>
        </div>

        {/* Quick Delete for Logged In Users */}
        {user && (
          <Alert className="mb-8 border-primary/50 bg-primary/5">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <AlertDescription>
              You're currently logged in. You can delete your account directly from your{" "}
              <Link href="/dashboard" className="text-primary font-medium hover:underline">
                Dashboard Settings
              </Link>.
            </AlertDescription>
          </Alert>
        )}

        {/* Overview */}
        <Card className="border mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Your Right to Data Deletion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Under data protection laws (including GDPR and CCPA), you have the right to request deletion of
              your personal data. We are committed to honoring these rights and making the process as simple
              as possible.
            </p>
            <p>
              When you request account deletion, we will permanently remove all your personal information and
              uploaded images from our systems, subject to legal retention requirements.
            </p>
          </CardContent>
        </Card>

        {/* What Gets Deleted */}
        <Card className="border mb-8">
          <CardHeader>
            <CardTitle>What Data Will Be Deleted</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">When you delete your account, the following data will be permanently removed:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>Account Information:</strong> Email, name, profile data</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>Uploaded Images:</strong> All images you've uploaded for processing</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>Processed Images:</strong> All edited and processed versions</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>Edit History:</strong> All editing operations and metadata</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>Authentication Tokens:</strong> OAuth tokens and session data</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>Usage Data:</strong> Activity logs and preferences (except as noted below)</span>
              </li>
            </ul>

            <Alert className="mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Legal Retention:</strong> Some data may be retained for legal compliance (e.g., transaction
                records, fraud prevention logs) for up to 7 years as required by law. This data is anonymized
                where possible and kept in secure, isolated storage.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Deletion Methods */}
        <Card className="border mb-8">
          <CardHeader>
            <CardTitle>How to Request Data Deletion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Method 1: In-App */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">1</span>
                Delete Account From Dashboard (Recommended)
              </h3>
              <div className="pl-8 space-y-2">
                <p>If you have access to your account:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Log in to your Chromakit account</li>
                  <li>Go to <strong>Dashboard → Settings → Account</strong></li>
                  <li>Scroll to the "Danger Zone" section</li>
                  <li>Click "Delete Account"</li>
                  <li>Confirm your decision (this action is immediate and irreversible)</li>
                </ol>
                {user && (
                  <div className="mt-4">
                    <Link href="/dashboard">
                      <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Go to Dashboard Settings
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Method 2: Email Request */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">2</span>
                Email Deletion Request
              </h3>
              <div className="pl-8 space-y-2">
                <p>If you cannot access your account or prefer email:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Send an email to: <strong className="text-primary">privacy@chromakit.com</strong></li>
                  <li>Use the subject line: <strong>"Data Deletion Request"</strong></li>
                  <li>Include your registered email address</li>
                  <li>Provide any additional information to verify your identity</li>
                  <li>We will respond within 48 hours and complete deletion within 30 days</li>
                </ol>

                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm font-semibold mb-2">Email Template:</p>
                  <pre className="text-xs bg-background p-3 rounded border overflow-x-auto">
{`To: privacy@chromakit.com
Subject: Data Deletion Request

I am requesting the deletion of my Chromakit account and all associated data.

Account Email: [your-email@example.com]
Date of Request: ${new Date().toLocaleDateString()}

Please confirm receipt of this request and the expected deletion timeline.

Thank you.`}
                  </pre>
                </div>

                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => window.location.href = `mailto:privacy@chromakit.com?subject=Data%20Deletion%20Request&body=I%20am%20requesting%20the%20deletion%20of%20my%20Chromakit%20account%20and%20all%20associated%20data.%0A%0AAccount%20Email%3A%20%5Byour-email%40example.com%5D%0ADate%20of%20Request%3A%20${new Date().toLocaleDateString()}%0A%0APlease%20confirm%20receipt%20of%20this%20request%20and%20the%20expected%20deletion%20timeline.%0A%0AThank%20you.`}
                >
                  Open Email Template
                </Button>
              </div>
            </div>

            {/* Method 3: OAuth Provider */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">3</span>
                Through OAuth Provider (Google/Facebook)
              </h3>
              <div className="pl-8 space-y-2">
                <p>If you signed up using Google or Facebook:</p>

                <div className="mt-4 space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="font-semibold mb-2">Google Users:</p>
                    <ol className="list-decimal pl-5 space-y-1 text-sm">
                      <li>Visit <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Account Permissions</a></li>
                      <li>Find "Chromakit" in the list of connected apps</li>
                      <li>Click "Remove Access"</li>
                      <li>Then follow Method 1 or 2 above to delete your Chromakit data</li>
                    </ol>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <p className="font-semibold mb-2">Facebook Users:</p>
                    <ol className="list-decimal pl-5 space-y-1 text-sm">
                      <li>Visit <a href="https://www.facebook.com/settings?tab=applications" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Facebook Apps and Websites</a></li>
                      <li>Find "Chromakit" in the list</li>
                      <li>Click "Remove"</li>
                      <li>Then follow Method 1 or 2 above to delete your Chromakit data</li>
                    </ol>
                  </div>
                </div>

                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Note: Removing OAuth access only disconnects the authorization. You must separately request
                    deletion of your Chromakit data using Method 1 or 2.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="border mb-8">
          <CardHeader>
            <CardTitle>Deletion Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold flex-shrink-0">
                24h
              </div>
              <div>
                <p className="font-semibold">Immediate to 24 Hours</p>
                <p className="text-sm text-muted-foreground">In-app deletions are processed immediately. Email requests are acknowledged within 24 hours.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold flex-shrink-0">
                7d
              </div>
              <div>
                <p className="font-semibold">Within 7 Days</p>
                <p className="text-sm text-muted-foreground">All user-facing data (account, images) is deleted from active systems.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold flex-shrink-0">
                30d
              </div>
              <div>
                <p className="font-semibold">Within 30 Days</p>
                <p className="text-sm text-muted-foreground">Complete deletion including backups and cached data. Confirmation email sent.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="border mb-8">
          <CardHeader>
            <CardTitle>Important Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Irreversible Action:</strong> Account deletion is permanent and cannot be undone. Make sure
                to download any images you want to keep before proceeding.
              </AlertDescription>
            </Alert>

            <div className="space-y-2 text-sm">
              <p><strong>Before Deleting:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Download any images you want to keep</li>
                <li>Cancel any active subscriptions (if applicable)</li>
                <li>Note that you won't be able to create a new account with the same email for 30 days</li>
              </ul>
            </div>

            <div className="space-y-2 text-sm">
              <p><strong>What Happens After Deletion:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>You will receive a confirmation email when deletion is complete</li>
                <li>All your images and data will be permanently deleted</li>
                <li>OAuth connections will be automatically revoked</li>
                <li>You can create a new account in the future if desired (after 30 days)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="border">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              If you have questions about data deletion or need assistance with the process, our support team
              is here to help:
            </p>
            <div className="space-y-2">
              <p><strong>Privacy Questions:</strong> privacy@chromakit.com</p>
              <p><strong>General Support:</strong> support@chromakit.com</p>
              <p><strong>Data Protection Officer:</strong> dpo@chromakit.com</p>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Links */}
        <div className="mt-8 flex gap-4 justify-center flex-wrap">
          <Link href="/privacy">
            <Button variant="outline">View Privacy Policy</Button>
          </Link>
          <Link href="/terms">
            <Button variant="outline">View Terms of Service</Button>
          </Link>
          {user && (
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
