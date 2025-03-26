# pdf2latex_agent/cli.py

import argparse
import sys
from pathlib import Path
import yaml
from .factory import AgentFactory
from .pdf_converter import pdf_to_text
from .job_scrapper import JobScrapper

CONFIG_PATH = Path(__file__).parent / "config.yaml"

def read_job_description(job_description: str) -> str:
    """
    Reads the job description from a file if a file path is provided.
    Otherwise, returns the job description as is.
    """
    if job_description.endswith(".txt"):
        with open(job_description, 'r', encoding='utf-8') as f:
            return f.read()
    return job_description

def main():
    # Create the main parser
    parser = argparse.ArgumentParser(description="PDF2LaTeX Agent CLI")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # Subcommand for processing PDF to LaTeX
    process_parser = subparsers.add_parser("process", help="Process a PDF and generate LaTeX")
    process_parser.add_argument("pdf_path", help="Path to the PDF file")

    # Subcommand for generating a cover letter
    cover_letter_parser = subparsers.add_parser("cover-letter", help="Generate a cover letter")
    cover_letter_parser.add_argument("pdf_path", help="Path to the PDF file (resume)")
    cover_letter_parser.add_argument("--job-description", help="Job description or path to a .txt file", required=True)

    # Subcommand for calculating ATS score
    ats_score_parser = subparsers.add_parser("ats-score", help="Calculate ATS score")
    ats_score_parser.add_argument("pdf_path", help="Path to the PDF file (resume)")

    # Subcommand for generating resume feedback
    feedback_parser = subparsers.add_parser("feedback", help="Generate resume feedback")
    feedback_parser.add_argument("pdf_path", help="Path to the PDF file (resume)")
    feedback_parser.add_argument("--job-description", help="Job description or path to a .txt file", required=True)

    # Subcommand for scraping jobs
    scrape_jobs_parser = subparsers.add_parser("scrape-jobs", help="Scrape Jobs")

    # Parse the arguments
    args = parser.parse_args()

    # Load the configuration file
    with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
        config_data = yaml.safe_load(f)

    # Create the agent
    agent = AgentFactory.create_agent()

    # Handle the subcommands
    if args.command == "process":
        # Process the PDF and generate LaTeX
        response = agent.process_pdf(args.pdf_path, config_data)
        print("LLM Response:\n")
        print(response)
    elif args.command == "cover-letter":
        # Generate a cover letter
        resume_content = pdf_to_text(args.pdf_path)
        job_description = read_job_description(args.job_description)
        cover_letter = agent.generate_cover_letter(resume_content, job_description, config_data)
        print("Generated Cover Letter:\n")
        print(cover_letter)
    elif args.command == "ats-score":
        # Calculate ATS score
        resume_content = pdf_to_text(args.pdf_path)
        ats_score = agent.calculate_ats_score(resume_content, config_data)
        print("ATS Score and Feedback:\n")
        print(ats_score)
    elif args.command == "feedback":
        # Generate resume feedback
        resume_content = pdf_to_text(args.pdf_path)
        job_description = read_job_description(args.job_description)
        feedback = agent.generate_resume_feedback(resume_content, job_description, config_data)  # Pass config_data
        print("Resume Feedback:\n")
        print(feedback)
    elif args.command == "scrape-jobs":
        jobs = JobScrapper().scrapeJobs()
        for job in jobs:
            print(job)
    else:
        # If no subcommand is provided, print help
        parser.print_help()
        sys.exit(1)

if __name__ == "__main__":
    sys.exit(main())