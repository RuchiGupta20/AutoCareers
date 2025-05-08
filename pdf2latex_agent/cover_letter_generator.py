# pdf2latex_agent/cover_letter_generator.py

from .pdf_converter import pdf_to_text
from .latex_feed import feed_prompt_to_llm  # Updated import

def generate_cover_letter(resume_content: str, job_description: str, config_data: dict) -> str:
    """
    Generates a personalized and impactful cover letter using the resume content and job description.
    """
    # Define the comprehensive prompt
    prompt = (
        "You are a professional career advisor. Your task is to generate a personalized and impactful cover letter "
        "based on the provided resume and job description. The cover letter should:\n"
        "1. **Highlight Relevant Experience and Skills**: Focus on work experience and skills that directly relate to the job description.\n"
        "2. **Show Passion and Connection**: Demonstrate enthusiasm for the role and the company.\n"
        "3. **Use a Human-Persuasive Voice**: Make the tone conversational yet professional.\n"
        "4. **Include Soft Skills**: Highlight soft skills like teamwork, communication, and problem-solving.\n"
        "5. **Tailor to the Job Description**: Explicitly address key requirements and responsibilities from the job description.\n\n"
        "**Resume Content**:\n"
        f"{resume_content}\n\n"
        "**Job Description**:\n"
        f"{job_description}\n\n"
        "Generate a cover letter that is personalized, impactful, and tailored to the job description."
    )
    
    # Feed the prompt to the LLM
    cover_letter = feed_prompt_to_llm(prompt, config_data)
    return cover_letter