# tests/test_pdf2latex_agent.py

import pytest
from pdf2latex_agent.pdf_converter import pdf_to_text, text_to_latex

def test_text_to_latex_simple():
    input_text = "Hello & World"
    output_latex = text_to_latex(input_text)
    assert "\\&" in output_latex, "Special char & should be escaped to \\&"

def test_pdf_to_text_empty():
    # If you want to test with a real PDF, place a sample in test resources.
    # For a dummy test, we can check that it doesn't crash or returns a string.
    pdf_path = "tests/resources/empty.pdf"
    # Provide a small empty PDF for testing, or skip if not present.
    # This is just an example. In real usage you’d have an actual file.
    try:
        text = pdf_to_text(pdf_path)
        assert isinstance(text, str), "Should return a string"
    except FileNotFoundError:
        pytest.skip("No test PDF found, skipping.")
