# PDF2LaTeX Agent

A basic agent that converts PDF files into LaTeX-formatted text and then feeds it into an LLM (like OpenAI GPT-4 or Llama3 8B, etc.).

## Installation

1. Using Python version 3.11.8
2. pip install poetry
3. poetry install

```bash
# Ensure you have Poetry installed:
# https://python-poetry.org/docs/#installation

poetry install

## Usage :

# Process a PDF and generate LaTeX
poetry run pdf2latex-agent process resume.pdf

# Generate a cover letter
poetry run pdf2latex-agent cover-letter resume.pdf --job-description "Software Engineer role at Google"

# Calculate ATS score
poetry run pdf2latex-agent ats-score resume.pdf

# Generate resume feedback
poetry run pdf2latex-agent feedback resume.pdf --job-description "job_description.txt"