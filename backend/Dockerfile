# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
# Install only production dependencies
RUN npm install --omit=dev

# Copy compiled code from builder stage
COPY --from=builder /app/dist ./dist
# Copy ecosystem config for PM2
COPY --from=builder /app/ecosystem.config.js ./

EXPOSE 5000

# Run both API and Worker using PM2
CMD ["npx", "pm2-runtime", "ecosystem.config.js"]
