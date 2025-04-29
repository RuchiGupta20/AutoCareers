from .job_scraper import scrape_simplify_new_grad_positions 
from DB_Connectors.db_connection import store_job_data_in_mongo
import yaml
from pathlib import Path

CONFIG_PATH = Path(__file__).parent / "config.yaml"

def main():
    print("Running job scraper...")
    with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
        config_data = yaml.safe_load(f)
    all_jobs = scrape_simplify_new_grad_positions(config_data)
    if not all_jobs:
        print("No jobs scraped!")
        return

    # Insert into MongoDB
    store_job_data_in_mongo(all_jobs)
    print("Job data stored in MongoDB!")

if __name__ == "__main__":
    main()
