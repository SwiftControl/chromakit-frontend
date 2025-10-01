# Chromakit

Professional image processing web application with advanced editing tools and real-time transformations.

![Chromakit](public/icon.png)

## Features

- 🎨 **Advanced Image Processing**: Brightness, contrast, RGB/CMY channels, filters
- 🔄 **Transformations**: Rotate, crop, translate, scale, zoom regions
- 📊 **Histogram Analysis**: Real-time RGB channel visualization
- 🖼️ **Image Fusion**: Merge multiple images with transparency control
- 📝 **Edit History**: Track all editing operations with undo capability
- 🔐 **OAuth Authentication**: Sign in with Google or Facebook
- 🌓 **Dark Mode**: Full theme support (Light/Dark/System)
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **State Management**: Redux Toolkit + RTK Query
- **Authentication**: Supabase (OAuth + Email)
- **Styling**: Tailwind CSS v4 + Radix UI
- **Backend**: FastAPI (Python) - [Separate Repository]
- **Deployment**: Vercel (Frontend) + Railway/Render (Backend)

## Getting Started

### Prerequisites

- Node.js 22+ and pnpm
- Supabase account (for authentication)
- FastAPI backend running (see backend setup)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SwiftControl/chromakit-frontend.git
cd chromakit-frontend
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
chromakit/
├── app/                    # Next.js 14 App Router pages
│   ├── page.tsx           # Landing page
│   ├── dashboard/         # User dashboard
│   ├── history/           # Edit history
│   ├── editor/[id]/       # Image editor
│   └── auth/              # Authentication pages
├── components/
│   ├── layout/            # Header, Footer, PageLayout
│   ├── ui/                # Reusable UI components (Radix)
│   └── landing/           # Landing page sections
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and helpers
├── store/                 # Redux store and RTK Query APIs
│   ├── api/              # API endpoints (imageApi, authApi)
│   └── slices/           # Redux slices (auth, image)
├── styles/               # Global styles
└── public/               # Static assets
```

## Key Features Explained

### Image Processing Operations

**Color Adjustments:**
- Brightness: Linear adjustment (-1 to 1)
- Contrast: Logarithmic or exponential enhancement
- Channels: Toggle RGB/CMY channels independently
- Grayscale: Average, Luminosity, or Midgray methods

**Filters:**
- Negative: Color inversion
- Binarization: Threshold-based black/white conversion

**Transformations:**
- Rotate: 0-360 degrees with manual matrix implementation
- Translate: Move image with dx/dy offsets
- Crop: Select region with x/y coordinates
- Scale: Reduce resolution by factor (2-10x)
- Zoom: Enlarge specific region (2-10x)

**Advanced:**
- Image Fusion: Blend two images with transparency control
- Histogram: 256-bin RGB channel analysis

### Authentication

Powered by Supabase with support for:
- **Google OAuth**: One-click sign-in
- **Facebook OAuth**: Social authentication
- **Email/Password**: Traditional authentication
- **Protected Routes**: Automatic redirect for unauthenticated users

### Dark Mode

Full theme support with `next-themes`:
- **Light Mode**: Clean, bright interface
- **Dark Mode**: Eye-friendly dark theme
- **System Mode**: Follows OS preference
- Persistent selection across sessions

## API Integration

The app connects to a FastAPI backend for image processing. All endpoints are pre-configured in RTK Query.

**Main Endpoints:**
```
POST /images/upload           - Upload new image
GET  /images                  - List user's images
GET  /images/{id}/download    - Download image
POST /processing/brightness   - Adjust brightness
POST /processing/contrast     - Adjust contrast
POST /processing/channel      - Manipulate RGB/CMY
POST /processing/grayscale    - Convert to grayscale
POST /processing/rotate       - Rotate image
POST /processing/crop         - Crop image
GET  /processing/{id}/histogram - Get histogram data
GET  /history                 - Get edit history
```

See `store/api/imageApi.ts` for complete API documentation.

## Development

### Commands

```bash
npm run dev          # Start development server
npm run build        # Create production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Building for Production

```bash
npm run build
npm start
```

The app will be optimized and ready for deployment.

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- AWS Amplify
- Digital Ocean

Ensure environment variables are set correctly.

## Environment Variables

Required environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGc...` |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` |

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **FastAPI**: High-performance Python backend
- **Supabase**: Authentication and database
- **Radix UI**: Accessible component primitives
- **Vercel**: Deployment and hosting
- **shadcn/ui**: Component design inspiration

## Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/SwiftControl/chromakit-frontend/issues)
- Email: contact@adriangaitan.dev

## Creator

Created with ❤️ by **[@SwiftControl](https://github.com/SwiftControl)**

---

**Chromakit** - Professional Image Processing Made Simple
