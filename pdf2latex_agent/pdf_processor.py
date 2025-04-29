# pdf2latex_agent/pdf_processor.py

from .pdf_converter import pdf_to_text, text_to_latex
from .latex_feed import feed_prompt_to_llm

def process_pdf(pdf_path: str, config_data: dict) -> str:
    """
    Processes a PDF file by extracting text, converting it to LaTeX, and feeding it to the LLM.
    """
    extracted_text = pdf_to_text(pdf_path)
    latex_content = text_to_latex(extracted_text)
    print("\n Latex content")
    print(latex_content)
    llm_response = feed_prompt_to_llm(latex_content, config_data)
    return llm_response