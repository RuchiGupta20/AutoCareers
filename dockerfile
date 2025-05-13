# Use official Python image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install Poetry
RUN pip install poetry

# Copy project files
COPY pyproject.toml poetry.lock ./
COPY src/ ./src/

# Install dependencies
RUN poetry config virtualenvs.create false && \
    poetry install --no-dev

# Expose port
EXPOSE 8000

# Default command
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]