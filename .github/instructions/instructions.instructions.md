---
applyTo: '**'
---

# Chromakit - Modern Image Processing Web Application

## PROJECT OVERVIEW

Build a professional, full-stack image processing web application that connects to a FastAPI backend. This is a modern SaaS-style image editor with OAuth authentication, real-time processing, and comprehensive user management.

**Tech Stack:**
- Frontend: Next.js 14, React 18, TypeScript, Tailwind CSS
- Authentication: NextAuth.js with OAuth (Google, Facebook)
- State Management: Redux Toolkit with RTK Query
- Backend Integration: FastAPI (Python) at `http://localhost:8000`
- UI Components: Radix UI primitives with custom styling
- Styling: Tailwind CSS with custom design system

## MANDATORY
- No in-line comments in the code snippets. Instead use JSDoc for documentation.
- Don't write any documentation outside of JSdoc documentation. Avoid write documents with implementation guide or something like that, only write a change summary at the end of the conversation.

## TYPE SYSTEM ARCHITECTURE

### Centralized Types Structure
All TypeScript types MUST be defined in the `/types` directory and imported via `@/types`:

**Directory Structure:**
```
types/
├── auth/index.ts           # Authentication types (User, AuthState)
├── image/index.ts          # Image metadata and list types
├── processing/index.ts     # All processing operation parameters
├── histogram/index.ts      # Histogram data types
├── editor/index.ts         # Editor state and image data
├── forms/index.ts          # Form validation schemas
└── index.ts                # Main barrel export (re-exports all)
```

**Import Pattern (REQUIRED):**
```typescript
// ✅ CORRECT - Always use @/types
import type { User, ImageMetadata, EditorState } from '@/types';
import type { BrightnessParams, ContrastParams } from '@/types';

// ❌ WRONG - Never use old lib/types paths
import { User } from '@/lib/types/auth.types';
import { ImageMetadata } from '@/lib/types/image.types';
```

**Key Type Categories:**

1. **Authentication Types** (`@/types` - from auth/)
   - `User`: User profile data
   - `AuthState`: Redux auth slice state
   - `ProfileUpdateRequest`: Profile update payload

2. **Image Types** (`@/types` - from image/)
   - `ImageMetadata`: Complete image metadata
   - `ImageListResponse`: Paginated image list
   - `HistoryItem`: Edit history record
   - `ImageState`: Redux image slice state

3. **Processing Types** (`@/types` - from processing/)
   - `ProcessingOperationResponse`: Generic processing response
   - `BrightnessParams`, `ContrastParams`, `ChannelParams`
   - `GrayscaleParams`, `BinarizeParams`, `NegativeParams`
   - `RotateParams`, `CropParams`, `TranslateParams`
   - `ReduceResolutionParams`, `EnlargeRegionParams`, `MergeParams`

4. **Editor Types** (`@/types` - from editor/)
   - `EditorState`: Current editor settings
   - `ImageData`: Image data for editor

5. **Histogram Types** (`@/types` - from histogram/)
   - `HistogramData`: Histogram data (color or grayscale)
   - `HistogramResponseColor`: RGB histogram
   - `HistogramResponseGrayscale`: Grayscale histogram

6. **Form Types** (`@/types` - from forms/)
   - `UploadFormData`: File upload validation
   - `TransformFormData`: Transformation parameters

**Benefits:**
- ✅ Single source of truth - No duplicate type definitions
- ✅ Easy imports - Just use `@/types` everywhere
- ✅ Tree-shakeable - Only imports what you use
- ✅ Organized by domain - Clear separation of concerns
- ✅ Type safety - Compile-time checks across entire app

**Rules:**
1. Never create duplicate type definitions in component files
2. Always use `import type` for type-only imports
3. Use `@/types` alias, never relative paths to types folder
4. Add new types to appropriate domain folder in `/types`
5. Update barrel export (`types/index.ts`) when adding new types

## AUTHENTICATION & SECURITY REQUIREMENTS

### OAuth Integration
- **Google Sign-In**: Use NextAuth.js Google provider
- **Facebook Sign-In**: Use NextAuth.js Facebook provider  
- **Token Management**: Store JWT tokens securely in httpOnly cookies
- **Auto-refresh**: Implement automatic token refresh on 401 responses
- **Session Handling**: 24-hour sessions with 5-minute expiry warnings

### Route Protection
```typescript
// All routes under these paths require authentication:
- /dashboard
- /editor
- /editor/[id]
- /history
- /api/protected/*

// Public routes:
- / (landing page)
- /auth/* (sign-in pages)
- /api/auth/* (NextAuth endpoints)
```

### Security Implementation
- CSRF protection enabled
- XSS protection with Content Security Policy
- Secure token storage (httpOnly cookies preferred)
- Input validation with Zod schemas
- File upload validation (10MB limit, JPG/PNG/BMP only)
- Rate limiting on API calls

## API INTEGRATION REQUIREMENTS

### Backend Endpoints Structure
```typescript
// Authentication
POST /auth/google              // Initiate Google OAuth
POST /auth/google/callback     // Handle callback
POST /auth/facebook           // Initiate Facebook Sign-In
POST /auth/facebook/callback  // Handle callback  
POST /auth/refresh            // Refresh tokens
POST /auth/logout             // Logout user
GET  /auth/me                 // Get current user

// Image Management (Protected)
POST /imagenes/cargar                    // Upload image
GET  /imagenes/{imagen_id}/descargar    // Download image
GET  /imagenes/mis-imagenes             // User's images

// Image Processing (Protected)
POST /procesamiento/brillo              // Brightness adjustment
POST /procesamiento/contraste           // Contrast adjustment  
POST /procesamiento/canal               // Channel manipulation
POST /procesamiento/escala-grises       // Grayscale conversion
POST /procesamiento/binarizar           // Binarization
POST /procesamiento/negativo            // Negative filter
POST /procesamiento/trasladar           // Translation
POST /procesamiento/rotar               // Rotation
POST /procesamiento/recortar            // Cropping
POST /procesamiento/reducir-resolucion  // Scale down
POST /procesamiento/ampliar-region      // Zoom region
POST /procesamiento/fusionar            // Image fusion
GET  /procesamiento/{imagen_id}/histograma // Histogram data
```

### RTK Query Configuration
- Base URL: `process.env.NEXT_PUBLIC_API_URL`
- Automatic token injection in headers
- Error handling with toast notifications
- Cache invalidation with proper tags
- Optimistic updates for UI responsiveness

## PAGE STRUCTURE & COMPONENTS

### 1. Landing Page (`/`) - Public
**Layout Requirements:**
- Modern hero section with gradient background
- Glass-morphism effect cards
- Mobile-first responsive design
- CTA buttons leading to authentication

**Hero Section:**
- Headline: "Professional Image Processing Made Simple"
- Subheadline: "Transform, enhance, and perfect your images with our advanced AI-powered tools"
- Primary CTA: "Get Started Free" (opens sign-in modal)
- Secondary CTA: "View Demo" (scrolls to features)

**Features Grid (6 main capabilities):**
- Brightness & Contrast Control
- RGB/CMY Channel Manipulation  
- Image Transformations (Rotate, Scale, Crop)
- Advanced Filters (Grayscale, Negative, Binarization)
- Image Fusion & Blending
- Histogram Analysis

### 2. Dashboard (`/dashboard`) - Protected
**Layout: Sidebar + Main Content**

**Sidebar Navigation:**
- New Project (upload new image)
- My Images (image library)
- Recent Edits (edit history)
- Settings (user preferences)

**Main Content Area:**
- Stats cards: Total images, Storage used, Recent activity
- Image grid (3-4 columns, responsive)
- Each thumbnail: Preview, filename, date, actions (edit, delete, download)
- Infinite scroll or pagination for large collections

### 3. Image Editor (`/editor/[id]`) - Protected
**Three-Panel Layout:**

**LEFT PANEL (30% width) - Control Panel:**
```typescript
// Collapsible sections with smooth animations:

1. Basic Adjustments
   - Brightness: Slider (-1 to 1, step 0.1)
   - Contrast Type: Dropdown (Logarithmic/Exponential/None)  
   - Contrast Intensity: Slider (0 to 1)

2. Color Channels
   - RGB Toggles: Red, Green, Blue switches
   - CMY Toggles: Cyan, Magenta, Yellow switches
   - Grayscale Method: Radio buttons (Average/Luminosity/Midgray/Original)

3. Filters & Effects  
   - Apply Negative: Button
   - Binarization: Threshold slider (0-255) + Apply button
   - Reset Filters: Button

4. Transformations
   - Rotation: Slider (0-360°) with degree display
   - Translation: X/Y offset inputs + Apply button
   - Crop Tool: X start/end, Y start/end inputs + Crop button
   - Scale: Factor slider (0.1 to 5x)

5. Image Fusion
   - Upload Second Image: File picker button
   - Transparency: Slider (0-100%)
   - Blend Images: Button

6. Zoom & Analysis
   - Zoom Region: X, Y, width, height inputs
   - Zoom Factor: Slider (1-10x)  
   - Show Histogram: Toggle switch
```

**CENTER CANVAS (50% width) - Image Display:**
- Large image viewer using `<img>` tag (no Canvas)
- Image source: `/imagenes/{imagen_id}/descargar` with auth
- Original vs Processed toggle buttons
- Before/After slider comparison component
- Zoom controls (CSS transforms, not Canvas)
- Loading spinner overlay during processing
- Download processed image (primary CTA)
- Save to history button

**RIGHT PANEL (20% width) - Analytics:**
- Histogram visualization (Recharts)
- RGB channel charts when enabled
- Image metadata display:
  - Original dimensions
  - Current dimensions  
  - File size and format
- Processing status indicator
- Current operation name

**Top Toolbar:**
- Editable filename
- Save/Undo/Redo buttons
- Share button  
- Close editor (back to dashboard)

### 4. History Page (`/history`) - Protected
**Timeline Layout:**
- Date range picker filter
- Operation type filter (badges)
- Search by filename
- Each history item shows:
  - Before → After thumbnail comparison
  - Transformation badges (color-coded by category)
  - Date/time stamps
  - Actions: View, Re-edit, Download, Delete

## COMPONENT ARCHITECTURE

### Core Reusable Components

#### 1. Authentication Components
```typescript
// components/auth/SignInModal.tsx
- OAuth provider buttons (Google, Facebook)
- Loading states during auth flow
- Error message displays  
- Privacy policy links

// components/auth/UserMenu.tsx  
- User avatar dropdown
- Profile info display
- Logout confirmation
- Settings access

// components/auth/ProtectedRoute.tsx
- HOC for route protection
- Loading states during auth check
- Redirect logic for unauthenticated users
```

#### 2. Image Management Components
```typescript
// components/upload/ImageUploader.tsx
- Drag-and-drop zone with file input fallback
- File validation (type, size limits)
- Upload progress bar
- Preview thumbnail generation

// components/editor/ImageCanvas.tsx
- Image display using <img> tag with auth headers
- Zoom controls (CSS transforms)
- Before/after comparison slider
- Loading states during processing

// components/editor/ControlPanel.tsx
- All transformation controls with real-time API calls
- Debounced inputs (300ms) to prevent API spam
- Loading states for individual controls
- Operation queue display
```

#### 3. Data Visualization Components
```typescript
// components/charts/HistogramChart.tsx
- RGB channel line charts using Recharts
- Toggle between count/percentage view  
- Responsive canvas sizing
- Real-time updates when image changes

// components/comparison/ImageComparison.tsx
- Side-by-side or overlay slider views
- "Original" vs "Processed" labels
- Smooth transition animations
```

#### 4. UI Enhancement Components
```typescript
// components/ui/SliderControl.tsx
- Label with current value display
- Smooth slider with immediate visual feedback
- Optional precise input field
- Validation feedback

// components/ui/TransformationBadge.tsx
- Color-coded operation pills
- Categories: color, transform, filter, fusion
- Hover states with operation details

// components/ui/ConfirmDialog.tsx
- Modal for destructive actions
- Clear action descriptions
- Keyboard navigation support
```

## STATE MANAGEMENT ARCHITECTURE

### Redux Store Structure
```typescript
// store/index.ts - Main store configuration
- RTK Query middleware
- Auth slice
- Image slice  
- UI slice (modals, toasts)

// store/slices/authSlice.ts
interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// store/slices/imageSlice.ts  
interface ImageState {
  currentImageId: string | null;
  originalImageId: string | null;
  processingHistory: Operation[];
  isProcessing: boolean;
  currentOperation: string | null;
  uploadProgress: number;
}

// store/api/imageApi.ts - RTK Query API
- All backend endpoints as mutations/queries
- Automatic token injection
- Cache invalidation with proper tags
- Error handling with user feedback
```

### Custom Hooks
```typescript
// hooks/useAuth.ts
- Authentication state access
- Login/logout functions  
- Token refresh logic

// hooks/useImageOperations.ts
- All image processing mutations
- Loading states management
- Error handling

// hooks/useProtectedRoute.ts
- Route protection logic
- Redirect handling
- Loading states
```

## STYLING SYSTEM

### Design Tokens
```css
/* Primary Colors */
--primary-50: #eff6ff;
--primary-500: #6366f1;  /* Main brand color */
--primary-600: #4f46e5;
--primary-900: #312e81;

/* Gradients */
--gradient-primary: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
--gradient-glass: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);

/* Glass-morphism */
--glass-bg: rgba(255, 255, 255, 0.1);
--glass-border: rgba(255, 255, 255, 0.2);
--glass-blur: blur(10px);
```

### Component Styling Guidelines
- **Cards**: Glass-morphism effect with subtle borders
- **Buttons**: Gradient backgrounds with hover animations  
- **Inputs**: Clean borders with focus states
- **Modals**: Backdrop blur with smooth entrance animations
- **Transitions**: 200ms ease-in-out for interactions
- **Dark Mode**: Automatic system preference detection

### Responsive Breakpoints
```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */  
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

## FORM HANDLING & VALIDATION

### React Hook Form Integration
```typescript
// Use react-hook-form for all forms with Zod validation

// Image upload validation
const uploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine(file => file.size <= 10 * 1024 * 1024, "File too large (10MB max)")
    .refine(file => ["image/jpeg", "image/png", "image/bmp"].includes(file.type), "Invalid file type")
});

// Transformation parameter validation  
const transformSchema = z.object({
  brightness: z.number().min(-1).max(1),
  contrast: z.number().min(0).max(1),
  rotation: z.number().min(0).max(360),
  cropX: z.number().min(0),
  cropY: z.number().min(0)
});
```

### Error Handling Strategy
- **Field-level**: Real-time validation with inline messages
- **Form-level**: Summary of errors above form  
- **API-level**: Toast notifications for server errors
- **Network-level**: Retry buttons and offline indicators

## PERFORMANCE OPTIMIZATION

### API Optimization
- **Debouncing**: 300ms delay on slider inputs before API calls
- **Caching**: RTK Query cache with 5-minute stale time
- **Optimistic Updates**: Immediate UI feedback for fast operations
- **Request Cancellation**: Cancel in-flight requests when new ones start

### Image Optimization
- **Lazy Loading**: Images in gallery use intersection observer
- **Compression**: Client-side compression before upload  
- **Caching**: Browser cache for processed images
- **Prefetching**: Preload likely next operations

### Bundle Optimization
- **Code Splitting**: Route-based splitting for large components
- **Tree Shaking**: Remove unused UI components
- **Dynamic Imports**: Lazy load heavy libraries (charts, image processing)

## ERROR HANDLING & USER FEEDBACK

### Error Categories & Responses
```typescript
// Network Errors
- Connection lost: Show offline banner with retry button
- Slow connection: Show progress indicators  
- Server errors: Generic error message with support contact

// Authentication Errors  
- Token expired: Auto-refresh attempt, then redirect to login
- Invalid credentials: Clear error message on sign-in form
- OAuth failures: Provider-specific error messages

// Validation Errors
- File too large: "File size must be under 10MB" 
- Invalid format: "Please upload JPG, PNG, or BMP files"
- Missing parameters: Highlight required fields

// Processing Errors
- API failures: "Processing failed. Please try again."
- Invalid operations: "Cannot apply this operation to current image"
- Server overload: "Server busy. Please wait and retry."
```

### User Feedback System
- **Toast Notifications**: Success/error messages (4-second duration)
- **Loading States**: Spinners, progress bars, skeleton screens
- **Empty States**: Helpful messages with action buttons
- **Confirmation Dialogs**: For destructive actions (delete, reset)

## TESTING REQUIREMENTS

### Unit Testing
```typescript
// Components to test:
- Authentication flows (sign-in, sign-out, token refresh)
- Image upload and processing operations  
- Form validation and error handling
- State management (Redux slices)

// Testing tools:
- Jest for unit tests
- React Testing Library for component tests
- MSW (Mock Service Worker) for API mocking
```

### Integration Testing
- Complete user workflows (upload → edit → save → download)
- OAuth authentication flows  
- API error scenarios and recovery
- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)

### Performance Testing
- Image processing response times
- Large file upload handling
- Concurrent user scenarios
- Memory usage during extended editing sessions

## ACCESSIBILITY REQUIREMENTS

### WCAG 2.1 AA Compliance
- **Keyboard Navigation**: Full app usable without mouse
- **Screen Readers**: Proper ARIA labels and roles
- **Color Contrast**: 4.5:1 minimum ratio for all text
- **Focus Management**: Visible focus indicators, logical tab order

### Specific Implementations
```typescript
// Image editor accessibility
- Alt text for processed images
- Keyboard shortcuts for common operations (Ctrl+Z for undo)
- Voice announcements for processing status
- High contrast mode for better visibility

// Form accessibility  
- Label association with form controls
- Error announcements for screen readers
- Required field indicators
- Clear error messages
```

## DEPLOYMENT & ENVIRONMENT

### Environment Variables
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Authentication  
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret  
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret

# Security
CSRF_SECRET=your-csrf-secret
```

### Build Configuration
```typescript
// next.config.js
- Image optimization for thumbnails
- Security headers (CSP, HSTS)  
- API route protection
- Bundle analyzer for optimization
```

## CODE STYLE & CONVENTIONS

### TypeScript Standards
- **Strict mode**: Enable all strict type checking
- **Interfaces over types**: For object shapes
- **Explicit return types**: For all functions  
- **Proper generics**: For reusable components

### File Organization
```
src/
├── app/                    # Next.js 14 app directory
├── components/             # Reusable UI components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
├── store/                  # Redux store and slices
├── types/                  # TypeScript type definitions
└── styles/                 # Global CSS and Tailwind
```

### Naming Conventions
- **Components**: PascalCase (UserProfile.tsx)
- **Hooks**: camelCase starting with 'use' (useImageOperations.ts)
- **API endpoints**: kebab-case for URLs  
- **CSS classes**: Tailwind utility classes preferred

### Documentation Requirements
- **Component Props**: JSDoc comments for all props
- **API Functions**: Parameter and return type documentation
- **Complex Logic**: Inline comments for business logic
- **README**: Setup instructions and architecture overview

## SECURITY CHECKLIST

### Authentication Security
- ✅ JWT tokens stored in httpOnly cookies
- ✅ Automatic token refresh before expiration  
- ✅ Secure logout (clear all client state)
- ✅ CSRF protection on all forms
- ✅ OAuth state parameter validation

### Data Protection
- ✅ Input validation on all user data
- ✅ File upload restrictions (type, size)  
- ✅ XSS protection with Content Security Policy
- ✅ No sensitive data in localStorage
- ✅ Secure API communication (HTTPS in production)

### Route Protection  
- ✅ Middleware for authentication checks
- ✅ Server-side route protection
- ✅ Client-side route guards
- ✅ Proper error handling for unauthorized access

This comprehensive instruction set ensures the development of a professional, secure, and performant image processing web application that integrates seamlessly with the FastAPI backend while providing an excellent user experience.