# Stage 1: Base image with necessary compatibility libraries
FROM node:18-alpine AS base
# Install libc6-compat for compatibility with native modules
RUN apk add --no-cache libc6-compat

# Stage 2: Install all dependencies (including devDependencies) for the build
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 3: Build the Next.js application
FROM base AS builder
WORKDIR /app
# Copy dependencies and source code
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable telemetry during build if desired
# ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# --- KEY CHANGE ---
# Copy the package-lock.json to the standalone directory.
# This is required for npm ci to work in the final stage.
COPY package-lock.json ./.next/standalone/


# Stage 4: Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Disable telemetry during runtime if desired
# ENV NEXT_TELEMETRY_DISABLED 1

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the standalone output from the builder stage
# This now includes the package-lock.json
COPY --from=builder /app/.next/standalone ./

# Run npm ci to install production dependencies based on the lock file
RUN npm ci --omit=dev

# Copy public and static assets
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

# Set correct ownership for all files
RUN chown -R nextjs:nodejs .

# Switch to the non-root user
USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start the application using the standalone server file
CMD ["node", "server.js"]