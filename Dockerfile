# Multi-stage build: Build frontend first
FROM node:18 AS frontend-build

WORKDIR /frontend
COPY lead-compass/ ./
RUN npm install
RUN npm run build

# Main Python stage
FROM python:3.11-slim

# Install system dependencies if needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy Python requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project
COPY . .

# Copy built frontend from the build stage
COPY --from=frontend-build /frontend/dist ./static

# Expose port for the API
EXPOSE 8000

# Default command to run the Flask app
CMD ["python", "app.py"]