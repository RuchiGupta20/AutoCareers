# pdf2latex_agent/agent.py

from .pdf_processor import process_pdf  # Import the new function
from .cover_letter_generator import generate_cover_letter
from .ats_score_generator import calculate_ats_score
from .resume_feedback_generator import generate_resume_feedback

class PDFLatexAgent:
    def __init__(self):
        pass

    def process_pdf(self, pdf_path: str, config_data: dict) -> str:
        """
        Processes a PDF file by extracting text, converting it to LaTeX, and feeding it to the LLM.
        """
        return process_pdf(pdf_path, config_data)

    def generate_cover_letter(self, resume_content: str, job_description: str, config_data: dict) -> str:
        """
        Generates a cover letter using the resume content and job description.
        """
        return generate_cover_letter(resume_content, job_description, config_data)

    def calculate_ats_score(self, resume_content: str, config_data: dict) -> str:
        """
        Calculates an ATS score using the LLM based on comprehensive metrics.
        """
        return calculate_ats_score(resume_content, config_data)

    def generate_resume_feedback(self, resume_content: str, job_description: str, config_data: dict) -> str:
        """
        Generates feedback on what to add to the resume to better match the job description.
        """
        return generate_resume_feedback(resume_content, job_description, config_data)