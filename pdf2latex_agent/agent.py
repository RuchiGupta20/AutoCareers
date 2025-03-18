# pdf2latex_agent/agent.py

from .pdf_converter import pdf_to_text, text_to_latex
from .latex_feed import feed_latex_to_llm, feed_latex_to_llm_via_together
from .pdf_converter import pdf_to_text
from llama_index.llms.together import TogetherLLM


class PDFLatexAgent:
    def __init__(self):
        pass

    def process_pdf(self, pdf_path: str,config_data: str) -> str:
        extracted_text = pdf_to_text(pdf_path)
        latex_content = text_to_latex(extracted_text)
        print("\n Latex content")
        print(latex_content)
        llm_response = feed_latex_to_llm(latex_content,config_data)
        return llm_response

