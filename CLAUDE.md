# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 project bootstrapped with `create-next-app`, using:
- React 19
- TypeScript
- Tailwind CSS v4
- Shadcn
- ESLint v9
- App Router architecture

## Common Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout with Geist fonts
│   ├── page.tsx        # Home page
│   ├── globals.css     # Global styles with Tailwind CSS
│   └── favicon.ico     # Site favicon
public/
├── next.svg           # Next.js logo
├── vercel.svg         # Vercel logo
└── other assets       # Additional SVG icons
```

## Architecture Notes

- Uses the new App Router structure with `src/app` directory
- Implements Tailwind CSS v4 with `@import "tailwindcss"` in globals.css
- Configured with TypeScript strict mode
- Uses Next.js font optimization for Geist fonts
- ESLint configured with Next.js core web vitals and TypeScript rules

## Key Configuration Files

- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration with path aliases
- `eslint.config.mjs` - ESLint configuration
- `postcss.config.mjs` - PostCSS configuration for Tailwind