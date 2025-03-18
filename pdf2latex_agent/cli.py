import argparse
import sys
from .factory import AgentFactory
from pathlib import Path
import yaml

CONFIG_PATH = Path(__file__).parent / "config.yaml"
def main():
    parser = argparse.ArgumentParser(description="PDF2LaTeX Agent CLI")
    parser.add_argument("pdf_path", help="Path to the PDF file")
    args = parser.parse_args()  
    with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
        config_data = yaml.safe_load(f)

    agent = AgentFactory.create_agent()
    response = agent.process_pdf(args.pdf_path,config_data)
    print("LLM Response:\n")
    print(response)

if __name__ == "__main__":
    sys.exit(main())
