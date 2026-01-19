# BoxDefense Deployment Guide

## Overview
BoxDefense is a legally defensible inventory documentation system. It is designed for high availability and security.

## Prerequisites
- Node.js (v18+)
- PostgreSQL (Database)
- S3 Compatible Storage (Photos)

## Infrastructure Setup
1. **Frontend**: The React application can be built and deployed to any static hosting service (e.g., Vercel, Netlify, AWS Amplify).
2. **API/Server**: Deploy the Node/Express server (located in the `server/` directory) to a containerized platform or serverless function provider.
3. **Database**: Provision a PostgreSQL instance. The application logic assumes a relational structure managed by migrations (see `services/db.ts`).
4. **Cache Generation**: Ensure the `server/cache-generator.ts` script runs after any deployment or database migration to warm the JSON read-optimized cache.

## Build Steps
```bash
npm install
npm run build
# Ensure environment variables are set (see env-example.md)
```