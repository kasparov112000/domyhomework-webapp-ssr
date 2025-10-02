# LearnByTesting SSR Landing Pages

<!-- Deployment fixed: 2025-10-01 -->

This is the Angular Universal SSR application that serves the marketing and landing pages for LearnByTesting at https://learnbytesting.ai

## Overview

This application is optimized for SEO and serves server-rendered pages to improve:
- Search engine visibility
- Initial page load performance
- Social media preview cards
- Core Web Vitals scores

## Architecture

- **Framework**: Angular 19 with Angular Universal SSR
- **Server**: Express.js running on Node.js
- **Port**: 4000
- **Deployment**: Kubernetes with Helm

## Development

### Prerequisites
- Node.js 18+
- npm

### Setup
```bash
npm install
```

### Development Server
```bash
npm run dev:ssr
```
Navigate to http://localhost:4200/. The application will automatically reload on changes.

### Build
```bash
npm run build:ssr
```

### Production Server
```bash
npm run build:ssr
npm run serve:ssr
```

## Deployment

### Docker Build
```bash
docker build -t kasparov112000/learnbytesting-webapp-ssr .
docker push kasparov112000/learnbytesting-webapp-ssr
```

### Kubernetes Deployment
```bash
helm upgrade --install webapp-ssr ./helm
```

## Routes

- `/` - Home page with hero section and features overview
- `/features` - Detailed features page
- `/about` - About us page
- `/pricing` - Pricing plans
- `/contact` - Contact information

## SEO Optimization

The application includes:
- Server-side rendering for all pages
- Optimized meta tags for each route
- Structured data markup
- XML sitemap generation
- Robots.txt configuration
- Optimized images and assets

## Notes

- The main application remains at https://app.learnbytesting.ai
- This SSR app only handles marketing/landing pages
- All "Launch App" buttons redirect to the main application