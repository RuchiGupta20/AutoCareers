# pdf2latex_agent/resume_feedback_generator.py

from .latex_feed import feed_prompt_to_llm

def generate_resume_feedback(resume_text: str, job_description: str, config_data: dict) -> str:
    """
    Generates detailed feedback on how to optimize the resume for the given job description.
    Uses the LLM to analyze the resume and provide actionable suggestions.
    """
    # Define the detailed prompt
    prompt = (
        "You are a professional career advisor. Your task is to analyze the following resume and job description, "
        "and provide detailed feedback on how to optimize the resume for the role. Your feedback should include:\n"
        "1. **Keyword Matching**: Check if keywords from the job description are present in the resume.\n"
        "2. **Optimization Suggestions**: Provide specific suggestions for improving the resume, such as:\n"
        "   - Adding relevant projects.\n"
        "   - Improving experience bullets to highlight achievements and impact.\n"
        "   - Highlighting skills that match the job description.\n"
        "3. **Detailed Feedback**: Offer a long description of how the resume can be optimized for the role, including:\n"
        "   - Metrics and keywords to include.\n"
        "   - Specific instances where experience bullets or other sections can be improved.\n"
        "   - Suggestions for relevant projects or skills to add.\n"
        "4. **General Tips**: Provide general tips for improving the resume's overall quality and alignment with the job description.\n\n"
        "**Resume**:\n"
        f"{resume_text}\n\n"
        "**Job Description**:\n"
        f"{job_description}\n\n"
        "Provide your feedback in a clear and structured format."
    )

    # Feed the prompt to the LLM
    feedback = feed_prompt_to_llm(prompt, config_data)
    return feedback