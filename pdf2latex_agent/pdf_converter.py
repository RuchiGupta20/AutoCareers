# pdf2latex_agent/pdf_converter.py

import re
from pypdf import PdfReader

def pdf_to_text(pdf_path: str) -> str:
    """
    Extracts text from a PDF file.

    :param pdf_path: Path to the PDF file.
    :return: Extracted text as a string.
    """
    reader = PdfReader(pdf_path)
    extracted_text = []
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            extracted_text.append(page_text)
    return "\n".join(extracted_text)

def text_to_latex(text: str) -> str:
    """
    (Naive) Convert extracted text into a rudimentary LaTeX-formatted string.
    This example just escapes basic LaTeX special chars and wraps with
    a "document" environment.

    :param text: Input text
    :return: A string containing naive LaTeX
    """
    # Escape some special chars often used in LaTeX
    text_escaped = text
    text_escaped = text_escaped.replace("\\", "\\textbackslash ")
    text_escaped = text_escaped.replace("&", "\\&")
    text_escaped = text_escaped.replace("%", "\\%")
    text_escaped = text_escaped.replace("$", "\\$")
    text_escaped = text_escaped.replace("#", "\\#")
    text_escaped = text_escaped.replace("_", "\\_")
    text_escaped = text_escaped.replace("{", "\\{")
    text_escaped = text_escaped.replace("}", "\\}")
    text_escaped = text_escaped.replace("~", "\\textasciitilde ")
    text_escaped = text_escaped.replace("^", "\\textasciicircum ")
    
    # Very naive transformation: each line becomes a line in LaTeX
    text_lines = text_escaped.split("\n")
    latex_lines = [line + " \\\\" for line in text_lines]
    latex_body = "\n".join(latex_lines)

    # Wrap in a minimal LaTeX document:
    latex_template = (
        "\\documentclass{article}\n"
        "\\begin{document}\n"
        f"{latex_body}\n"
        "\\end{document}\n"
    )

    return latex_template
