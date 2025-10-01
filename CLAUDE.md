# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: Chromakit - Image Processing Web Application

A full-stack Next.js 14 application for image processing that connects to a FastAPI backend. Features OAuth authentication via Supabase, real-time image processing, and comprehensive editing capabilities.

**Tech Stack:**
- Next.js 14 (App Router)
- React 18 + TypeScript
- Supabase (Authentication)
- Redux Toolkit + RTK Query (State Management)
- Tailwind CSS + Radix UI
- next-themes (Dark Mode)
- FastAPI Backend at `http://localhost:8000`

## Development Rules

**IMPORTANT**: Do NOT create extra markdown documentation files (like IMPLEMENTATION_SUMMARY.md, ROUTING_UPDATE.md, etc.). Only maintain CLAUDE.md and README.md. Follow the project architecture and patterns documented here.

## Common Commands

```bash
# Development
npm run dev          # Start Next.js dev server (default: http://localhost:3000)

# Building
npm run build        # Production build
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## Architecture Overview

### Layout System
All pages use `PageLayout` component (`components/layout/page-layout.tsx`):
- **Header variants**: `public`, `authenticated`, `minimal`
- **Footer**: Auto-shows for public/minimal pages, hidden for authenticated pages
- **Theme**: Dark mode toggle in header (Light/Dark/System)

Components:
- `Header` - Unified header with favicon, theme toggle, user dropdown
- `Footer` - Shows @SwiftControl credit, only on guest pages
- `UserDropdown` - Avatar menu with Dashboard, History, Settings, Sign out
- `ThemeToggle` - Sun/Moon icon for dark mode switching

### Authentication Flow
- Uses **Supabase** for OAuth (Google, Facebook) and email authentication
- Client: `lib/supabase/client.ts` creates browser client
- Server: `lib/supabase/middleware.ts` handles session management
- Middleware: `middleware.ts` protects `/dashboard`, `/history`, `/editor/*` routes
- Auth state managed via Redux (`store/slices/authSlice.ts`)
- User object structure: `{ id, email, name, avatar_url, picture, created_at, updated_at }`

### State Management Architecture
Redux store configured in `store/index.ts` with:
- **Auth Slice** (`store/slices/authSlice.ts`): User authentication state
- **Image Slice** (`store/slices/imageSlice.ts`): Current image and processing state
- **Auth API** (`store/api/authApi.ts`): Authentication endpoints via RTK Query
- **Image API** (`store/api/imageApi.ts`): Image upload, processing, and management

### Backend API Integration
All API calls go through RTK Query in `store/api/imageApi.ts`:
- **Base URL**: `process.env.NEXT_PUBLIC_API_URL` (default: http://localhost:8000)
- **Authentication**: Automatic Bearer token injection from Supabase session
- **Cache Management**: Tagged invalidation with ['Image', 'ImageList', 'History', 'User']

**Key Endpoints:**
```
GET  /                                    - Health check
GET  /auth/me                             - Get user profile
PATCH /auth/profile                       - Update profile

POST /images/upload                       - Upload image (FormData)
GET  /images                              - Get user's images (paginated)
GET  /images/{id}                         - Get image metadata
GET  /images/{id}/download                - Download image file
DELETE /images/{id}                       - Delete image

POST /processing/brightness               - Adjust brightness
POST /processing/contrast                 - Adjust contrast (logarithmic/exponential)
POST /processing/channel                  - RGB/CMY channel manipulation
POST /processing/grayscale                - Convert to grayscale
POST /processing/binarize                 - Apply binarization
POST /processing/negative                 - Apply negative filter
POST /processing/translate                - Translate image
POST /processing/rotate                   - Rotate image
POST /processing/crop                     - Crop image
POST /processing/reduce-resolution        - Scale down
POST /processing/enlarge-region           - Zoom region
POST /processing/merge                    - Merge two images
GET  /processing/{id}/histogram           - Get histogram data

GET  /history                             - Get edit history (paginated)
GET  /history/{image_id}                  - Get history for specific image
DELETE /history/{id}                      - Delete history entry
```

### Page Structure (App Router)
```
app/
├── page.tsx                              - Landing page (uses PageLayout public)
├── dashboard/page.tsx                    - Dashboard (uses PageLayout authenticated)
├── history/page.tsx                      - Edit history (uses PageLayout authenticated)
├── privacy/page.tsx                      - Privacy policy (uses PageLayout minimal)
├── terms/page.tsx                        - Terms of service (uses PageLayout minimal)
├── data-deletion/page.tsx                - Data deletion (uses PageLayout minimal)
├── auth/
│   ├── login/page.tsx                    - Login page
│   ├── sign-up/page.tsx                  - Sign up page
│   ├── callback/page.tsx                 - OAuth callback handler
│   └── error/page.tsx                    - Auth error page
└── editor/[id]/page.tsx                  - Image editor (protected)
```

**Protected Routes:** Middleware redirects unauthenticated users from `/dashboard`, `/history`, `/editor/*` to `/auth/login`

### Component Organization
```
components/
├── layout/                               - Layout components (Header, Footer, PageLayout)
├── landing/                              - Landing page content
├── ui/                                   - Radix UI primitives + custom components
└── providers/                            - Context providers (Redux, Theme)
```

### Custom Hooks
Located in `hooks/`:
- `useAuth.ts` - Authentication state (user, signIn, signUp, signOut, isLoading)
- `useImageOperations.ts` - Image processing mutations with loading/error states
- `use-toast.ts` - Toast notification system
- `use-mobile.ts` - Mobile device detection

### Type Definitions
All TypeScript types in `lib/types/`:
- `auth.types.ts` - User, AuthState interfaces
- `image.types.ts` - ImageMetadata, processing parameters, histogram data

## Environment Variables Required

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Image Processing Implementation Notes

### Image Display Pattern
- Images displayed using `<img>` tags with Next.js Image component
- Image URLs: `${NEXT_PUBLIC_API_URL}/images/{id}/download`
- Authorization handled automatically by RTK Query baseQuery
- Use `fill` prop for aspect-ratio containers

### Processing Workflow
1. User uploads image → `useUploadImageMutation()` → returns ImageMetadata with `id`
2. User applies operations → processing mutations with `image_id` → returns new ImageMetadata
3. Each operation creates a new processed image (immutable)
4. Histogram updates via `useGetHistogramQuery()`
5. Edit history tracked automatically by backend

### File Upload Constraints
- Max size: 10MB
- Allowed types: JPG, PNG, BMP
- Validation via Zod schemas

## Styling System

**Design Tokens:**
- Primary color: `#6366f1` (Indigo-500)
- Icons: Use `/favicon-64x64.png` for header logo (32x32 display)
- Dark mode: Enabled via `next-themes` with ThemeProvider in root layout
- Tailwind CSS v4 with custom design tokens
- Radix UI primitives with custom styling

**Dark Mode:**
- Toggle in header (Sun/Moon icon)
- Options: Light, Dark, System
- Persisted via `next-themes`
- No hydration flash with `suppressHydrationWarning`

## Key Implementation Details

### Layout Pattern
Always use `PageLayout` wrapper:
```tsx
<PageLayout headerVariant="authenticated">
  {children}
</PageLayout>
```

Variants:
- `public`: Shows Sign In/Get Started buttons, shows footer
- `authenticated`: Shows user dropdown, hides footer
- `minimal`: Shows Back to Home button, shows footer

### User Dropdown Structure
Access via `useAuth()` hook:
- `user.name` - Display name
- `user.email` - Email address
- `user.avatar_url` or `user.picture` - Profile image
- Links: Dashboard (`/dashboard`), History (`/history`), Settings (`/dashboard`)

### Redux Store Setup
- Two API slices: `authApi` and `imageApi`
- Auto-setup RTK Query listeners for cache management
- Cache tags for automatic invalidation

### Route Protection Pattern
Middleware in `middleware.ts`:
1. Creates Supabase server client with cookie handling
2. Checks `supabase.auth.getUser()` for authenticated user
3. Redirects unauthenticated users from protected routes → `/auth/login`
4. Redirects authenticated users from auth pages → `/dashboard`

## Important Architectural Decisions

1. **Supabase Authentication**: Uses Supabase for OAuth (Google, Facebook) and email auth
2. **RTK Query**: All API calls through Redux Toolkit Query
3. **PageLayout System**: Unified header/footer with smart visibility logic
4. **Dark Mode**: next-themes with system preference support
5. **Image Display**: Next.js Image component with auth headers
6. **Immutable Processing**: Each operation creates new image, original preserved
7. **Build Config**: TypeScript and ESLint errors ignored during builds
8. **No Extra Docs**: Only maintain CLAUDE.md and README.md

## Creator

Built by **[@SwiftControl](https://github.com/SwiftControl)**
