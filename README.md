# ANVIDTRAVEL — Premium Travel Agency

A production-ready luxury travel agency website built with Next.js, React 19, TypeScript, and Tailwind CSS.

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** — scroll reveal, hover, page animations
- **SwiperJS** — hero slider, testimonials
- **Lucide React** — icons
- **next-themes** — dark/light mode

## Features

- 8 pages: Home, Tours, Tour Detail, Destinations, Blog, Contact, About, Auth
- 30 realistic tours with full data (itinerary, FAQ, reviews)
- Filter sidebar, search, pagination on tours listing
- Image gallery with lightbox on tour detail
- Sticky booking widget
- SEO metadata, sitemap, robots.txt
- Fully responsive (mobile-first)
- Glassmorphism UI with luxury design

## Getting Started

```bash
cd travel-agency
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/              # Pages & routes
├── components/       # Reusable UI components
│   ├── cards/
│   ├── forms/
│   ├── home/
│   ├── layout/
│   ├── tours/
│   └── ui/
├── data/             # Static data (tours, blogs, etc.)
├── lib/              # Utils & types
└── providers/        # Theme provider
```

## Design

- Primary: `#0F4C81`
- Accent: `#FFB703`
- Fonts: Inter + Playfair Display
- Images: Unsplash (optimized via next/image)
# frontend-tralvel
