# AutoCareers

AutoCareers is designed to streamline the job search process for job seekers and recruiters by providing an intuitive platform for job listings, applications, and candidate management.

## Project Overview

- **Resume Parsing & ATS Scoring**: AI-driven resume analysis to optimize for Applicant Tracking Systems.
- **Job Aggregation**: Scrapes and aggregates job listings from multiple sources.
- **Search & Filtering**: Keyword search plus filters (location, experience, salary, etc.).
- **Role-Based Access**: Separate views and permissions for job seekers, recruiters, and coaches.
- **Messaging & Applications**: In-app messaging and one-click applications with generated cover letters.

## Getting Started

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/autocareers.git
   cd autocareers
   ```

2. **Install Dependencies**:
   > **Note:** We use Poetry for dependency management, and our `pyproject.toml` serves as the equivalent of a `requirements.txt`. Ensure you have Poetry installed.
   
   ```bash
   pip install poetry
   poetry install
   ```

3. **Environment Variables**:

   Create a `.env` file in the project root with:
   ```ini
   OPENAI_API_KEY=your-openai-key
   TOGETHERAI_KEY=your-togetherai-key
   PINECONE_API_KEY=your-pinecone-key
   MONGO_URI=mongodb://username:password@host:port/dbname
   ```

4. **Running Locally** (Development):
   ```bash
   docker-compose up --build
   ```
   The FastAPI server will be available at `http://localhost:8000`.

## File Structure

- `src/` — Application code
- `Dockerfile` & `docker-compose.yml` — Container setup
- `pyproject.toml` & `poetry.lock` — Dependency definitions (equivalent to `requirements.txt`)

## Scripts & CLI

```bash
# PDF-to-LaTeX agent
pdf2latex-agent

# Scrape and push jobs to MongoDB
job-scraper

# Connect to MongoDB
DB-connect

# Upsert data into Pinecone
mongo-to-pinecone

# Recommend jobs for a user
recommend-jobs
```

## Deployment

Our deployment strategy centers around containerization and infrastructure-as-code to ensure consistency across development, staging, and production environments. We leverage Docker images for the application and its dependencies, enabling us to build once and run anywhere. For orchestration and local development, we use Docker Compose to coordinate the API service alongside MongoDB.

In staging and production, we recommend deploying the same Docker image to a container orchestration platform (e.g., Kubernetes or Amazon ECS). Configuration is managed via environment variables stored in a secrets manager, ensuring sensitive keys are never hard-coded. We utilize a CI/CD pipeline (such as GitHub Actions) to automatically build, test, and push Docker images to a registry on each merge to `main`. Deployments to staging and production can then be triggered with zero-downtime rolling updates, health checks, and load balancing.

Below are the commands for local and simple production deployments:

## Deployment

We provide both Docker and docker-compose setups for easy deployment:

### Using Docker
1. **Build the image:**
   ```bash
   docker build -t autocareers:latest .
   ```
2. **Run the container:**
   ```bash
   docker run -d \
     -p 8000:8000 \
     -e OPENAI_API_KEY=your-openai-key \
     -e TOGETHERAI_KEY=your-togetherai-key \
     -e PINECONE_API_KEY=your-pinecone-key \
     -e MONGO_URI=mongodb://username:password@host:port/dbname \
     --name autocareers autocareers:latest
   ```

### Using Docker Compose
1. **Ensure your `.env` file is populated** with the necessary environment variables.
2. **Start services:**
   ```bash
   docker-compose up --build -d
   ```
3. **Access the API** at `http://localhost:8000`.

## License

MIT © autocareers
