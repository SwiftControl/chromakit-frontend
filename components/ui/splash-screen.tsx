import Image from "next/image"

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
      <div className="flex flex-col items-center gap-6 animate-in fade-in duration-500">
        {/* Icon with pulse animation */}
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl animate-pulse" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
            <Image
              src="/icon.png"
              alt="Chromakit"
              width={64}
              height={64}
              className="animate-pulse"
              priority
            />
          </div>
        </div>

        {/* App name */}
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Chromakit
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Professional Image Processing
          </p>
        </div>

        {/* Loading indicator */}
        <div className="flex gap-1.5">
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce" />
        </div>
      </div>
    </div>
  )
}
