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
# Copy other necessary files if any (e.g., assets, views)
# COPY --from=builder /app/src/views ./dist/views

EXPOSE 5000

CMD ["npm", "run", "start:prod"]
