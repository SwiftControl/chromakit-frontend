"use client"

import { useState } from "react"
import { PageLayout } from "@/components/layout/page-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useGetUserImagesQuery } from "@/store/api/imageApi"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ImageIcon, Upload, AlertCircle, Settings, History as HistoryIcon } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { UploadDialog } from "@/components/dashboard/upload-dialog"

export default function DashboardPage() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const { data, isLoading, error } = useGetUserImagesQuery({ limit: 20, offset: 0, sort: "created_at" })

  return (
    <PageLayout headerVariant="authenticated">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage and edit your images
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/history">
              <Button variant="outline">
                <HistoryIcon className="mr-2 h-4 w-4" />
                View Edit History
              </Button>
            </Link>
            <Button onClick={() => setUploadDialogOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? <Skeleton className="h-8 w-16" /> : data?.total || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Storage Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? <Skeleton className="h-8 w-24" /> : "N/A"}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">
                {isLoading ? (
                  <Skeleton className="h-6 w-32" />
                ) : data?.images && data.images.length > 0 ? (
                  formatDistanceToNow(new Date(data.images[0].created_at), { addSuffix: true })
                ) : (
                  "No activity"
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="aspect-square w-full rounded-lg mb-3" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load images. Please try again.
            </AlertDescription>
          </Alert>
        )}

        {/* Empty State */}
        {!isLoading && !error && (!data?.images || data.images.length === 0) && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
                <ImageIcon className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Images Yet</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                Upload your first image to get started with professional image processing tools.
              </p>
              <Button onClick={() => setUploadDialogOpen(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Your First Image
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Images Grid */}
        {!isLoading && !error && data?.images && data.images.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Images</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data.images.map((image) => (
                <Card key={image.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    {/* Image */}
                    <div className="relative aspect-square bg-muted">
                      <Image
                        src={image.url || `${process.env.NEXT_PUBLIC_API_URL}/images/${image.id}/download`}
                        alt={image.original_filename || 'Image'}
                        fill
                        className="object-cover"
                      />
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Link href={`/editor/${image.id}`}>
                          <Button size="sm" variant="secondary">
                            Edit
                          </Button>
                        </Link>
                        <Button size="sm" variant="secondary">
                          Download
                        </Button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-medium truncate mb-1">
                        {image.original_filename || 'Untitled'}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{image.width} × {image.height}</span>
                        <span>{formatDistanceToNow(new Date(image.created_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Upload Dialog */}
      <UploadDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} />
    </PageLayout>
  )
}
