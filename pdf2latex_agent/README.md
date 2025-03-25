# PDF2LaTeX Agent

A basic agent that converts PDF files into LaTeX-formatted text and then feeds it into an LLM (like OpenAI GPT-4 or Llama3 8B, etc.).

## Installation

1. Using Python version 3.11.8
2. pip install poetry
3. poetry install
4. poetry run pdf2latex-agent resume-sample.pdf

```bash
# Ensure you have Poetry installed:
# https://python-poetry.org/docs/#installation

poetry install

## Usage :

poetry run pdf2latex-agent /path/to/yourfile.pdf

