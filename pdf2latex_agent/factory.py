# pdf2latex_agent/factory.py

from .agent import PDFLatexAgent

class AgentFactory:
    """
    A simple factory that creates a PDFLatexAgent.
    You can add more sophisticated logic to choose between
    different agent types, configurations, etc.
    """
    @staticmethod
    def create_agent() -> PDFLatexAgent:
        return PDFLatexAgent()
