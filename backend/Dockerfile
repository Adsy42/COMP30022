# Development Dockerfile for Flask
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Expose port
EXPOSE 5001

# Set Flask app entry point for flask run command
ENV FLASK_APP=run.py

# Default command (can be overridden in docker-compose)
CMD ["flask", "run", "--host=0.0.0.0", "--port=5001"]