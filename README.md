# GOAT Sports

A next-generation fantasy sports platform built with modern web technologies, designed for intelligent insights, seamless user experience, and social engagement.

## Quick Links

- [Architecture](./docs/ARCHITECTURE.md) - System architecture, tech stack, and technical decisions
- [Roadmap](./docs/ROADMAP.md) - Development phases and high-level plan
- [Development](./docs/DEVELOPMENT.md) - Development workflow, principles, and best practices
- [Deployment](./docs/DEPLOYMENT.md) - Deployment strategy and CI/CD
- [Data](./docs/DATA.md) - Data sources, ETL pipeline, and database schema
- [Security](./docs/SECURITY.md) - Security considerations and best practices
- [Performance](./docs/PERFORMANCE.md) - Performance targets and optimization
- [Limitations](./docs/LIMITATIONS.md) - Known limitations, trade-offs, and technical debt

## Overview

GOAT Sports is a fantasy sports platform that combines:
- **Modern Architecture**: Next.js 14+, Drizzle ORM, TypeScript throughout
- **Advanced Analytics**: Insight-forward analytics and predictive modeling
- **Social Features**: Community building, chat, forums, leaderboards
- **Real-time Updates**: Live scoring, game updates, notifications
- **Data-Driven**: Robust ETL pipeline for sports data ingestion

## Tech Stack Summary

- **Frontend**: Next.js 14+ (App Router), React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Drizzle ORM
- **Database**: PostgreSQL (via Supabase)
- **Real-time**: Supabase real-time subscriptions
- **ETL**: Hybrid approach (Next.js API routes + separate workers)
- **Hosting**: Vercel (frontend/API), Railway/Render (workers)

## Getting Started

*Setup instructions will be added here once the migration to Next.js is complete.*

## Project Status

Currently in **Phase 1: Foundation & Migration** - Migrating from React/Vite to Next.js architecture.

See [Roadmap](./docs/ROADMAP.md) for detailed phase information.
