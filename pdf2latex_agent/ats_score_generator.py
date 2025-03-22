# pdf2latex_agent/ats_score_generator.py

from .latex_feed import feed_prompt_to_llm  # Updated import

def calculate_ats_score(resume_text: str, config_data: dict) -> str:
    """
    Calculates a raw ATS score based on the overall quality of the resume.
    The score is determined by evaluating the resume against general quality metrics.
    """
    # Define the evaluation prompt
    prompt = (
        "You are an ATS (Applicant Tracking System) scoring system. "
        "Your task is to evaluate the following resume and provide a score out of 100 "
        "based on the overall quality of the resume. Consider the following metrics:\n"
        "1. **Structure**: Does the resume have a clear and logical structure (e.g., sections like Work Experience, Education, Skills)?\n"
        "2. **Content**: Is the content detailed and relevant? Does it highlight achievements and responsibilities effectively?\n"
        "3. **Grammar and Typos**: Are there any spelling or grammatical errors?\n"
        "4. **Action Words**: Does the resume use strong action verbs (e.g., 'developed', 'managed', 'optimized')?\n"
        "5. **Quantifiable Achievements**: Does the resume include quantifiable results (e.g., 'Increased sales by 20%')?\n"
        "6. **Professionalism**: Is the tone and language professional and appropriate for a resume?\n"
        "7. **Length**: Is the resume concise and appropriately sized (e.g., 1-2 pages for most professionals)?\n\n"
        "**Resume**:\n"
        f"{resume_text}\n\n"
        "Provide the score and feedback in the following format:\n"
        "**ATS Score**: [score]/100\n"
        "**Feedback**: [detailed feedback]"
    )

    # Feed the prompt to the LLM
    response = feed_prompt_to_llm(prompt, config_data)
    return response