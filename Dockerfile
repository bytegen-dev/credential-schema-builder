FROM node:20-alpine

WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/
COPY shared/package.json ./shared/

# Install all dependencies (including dev for build)
# Use --legacy-peer-deps to handle React version conflicts
RUN npm install --legacy-peer-deps

# Copy source files
COPY shared ./shared
COPY frontend ./frontend
COPY backend ./backend

# Build packages in order
RUN npm run build:shared
RUN npm run build:frontend
RUN npm run build:backend

# Remove dev dependencies (keep production deps)
RUN npm install --omit=dev --legacy-peer-deps

EXPOSE 3001

ENV NODE_ENV=production
ENV PORT=3001

CMD ["node", "backend/dist/index.js"]

