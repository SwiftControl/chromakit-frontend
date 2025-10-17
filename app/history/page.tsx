"use client"

import { PageLayout } from "@/components/layout/page-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetEditHistoryQuery } from "@/store/api/imageApi"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { History, AlertCircle, Download, Eye, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { useState } from "react"

function formatOperation(op: string) {
  return op
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default function HistoryPage() {
  const [limit] = useState(50)
  const [offset] = useState(0)

  const { data, isLoading, error } = useGetEditHistoryQuery({ limit, offset })

  return (
    <PageLayout headerVariant="authenticated">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <History className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Edit History</h1>
              <p className="text-muted-foreground">
                View all your image editing operations
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Skeleton className="h-24 w-24 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-6 w-1/2" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                  </div>
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
              Failed to load edit history. Please try again.
            </AlertDescription>
          </Alert>
        )}

        {/* Empty State */}
        {!isLoading && !error && (!data?.history || data.history.length === 0) && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
                <History className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Edit History Yet</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                Start editing images to see your editing history here. All your image transformations will be tracked.
              </p>
              <Link href="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* History List */}
        {!isLoading && !error && data?.history && data.history.length > 0 && (
          <div className="space-y-4">
            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Operations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.total || data.history.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Showing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.history.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Most Recent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-medium">
                    {formatDistanceToNow(new Date(data.history[0].created_at), { addSuffix: true })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* History Items */}
            {data.history.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {/* Thumbnail */}
                    <div className="flex-shrink-0">
                      <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-muted border">
                        <Image
                          src={item.image.url || `${process.env.NEXT_PUBLIC_API_URL}/images/${item.image.id}/download`}
                          alt={`Image ${item.image_id}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg truncate">
                            {formatOperation(item.operation)}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                          </p>
                        </div>
                        <OperationBadge operation={item.operation} />
                      </div>

                      {/* Parameters */}
                      {item.params && Object.keys(item.params).length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {Object.entries(item.params).map(([key, value]) => (
                            <span
                              key={key}
                              className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded"
                            >
                              <span className="font-medium">{key}:</span>
                              <span className="text-muted-foreground">
                                {typeof value === 'number' ? value.toFixed(2) : String(value)}
                              </span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/editor/${item.image_id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Pagination info */}
            {data.total && data.total > data.history.length && (
              <div className="text-center py-4 text-sm text-muted-foreground">
                Showing {data.history.length} of {data.total} operations
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  )
}

function OperationBadge({ operation }: { operation: string }) {
  const operationColors: Record<string, string> = {
    brightness: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
    contrast: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
    log_contrast: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
    exp_contrast: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
    channel: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
    grayscale: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
    grayscale_luminosity: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
    grayscale_average: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
    grayscale_midgray: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
    negative: "bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/20",
    binarize: "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20",
    translate: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    rotate: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20",
    crop: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
    reduce_resolution: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
    enlarge_region: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20",
    merge: "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20",
    edit: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  }

  return (
    <Badge
      variant="outline"
      className={`${operationColors[operation] || "bg-muted"} font-medium`}
    >
      {formatOperation(operation)}
    </Badge>
  )
}
