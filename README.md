# Hidden Treasures Network

A Next.js web application for Hidden Treasures Network - empowering underrepresented youth to soar in STEM and aviation.

## Features

- **Modern Next.js 14** with App Router
- **Optimized Images** using next/image component with Unsplash integration
- **Responsive Design** with Tailwind CSS
- **TypeScript** for type safety
- **Performance Optimized** with automatic image optimization

## Image Integration

All images are sourced from Unsplash with proper optimization:

- **Hero Background**: Aviation students diversity theme
- **Mission Section**: STEM education children theme
- **Success Stories**: Portrait photos with aviation theme
- **Footer Background**: Aviation pattern with gradient overlay

Images are configured in `next.config.js` to allow Unsplash domain and use Next.js Image optimization features including:
- Automatic lazy loading
- Responsive image sizing
- Modern image formats (WebP)
- Priority loading for above-the-fold content

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

## Project Structure

```
├── app/
│   ├── layout.tsx      # Root layout with metadata
│   ├── page.tsx        # Homepage with all sections
│   └── globals.css     # Global styles with Tailwind
├── next.config.js      # Next.js configuration with image domains
├── tailwind.config.ts  # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

## Sections

### Hero Section
Full-screen hero with aviation students diversity background image and call-to-action.

### Mission Section
Two-column layout explaining HTN's mission with STEM education imagery.

### Success Stories
Grid of three success story cards with portrait photos and testimonials.

### Footer
Multi-column footer with navigation links and aviation-themed background.

## Technologies

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Unsplash** - High-quality stock photography

## License

© 2024 Hidden Treasures Network. All rights reserved.
