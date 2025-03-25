import requests
from bs4 import BeautifulSoup
import yaml
from pathlib import Path
from DB_Connectors.db_connection import store_job_data_in_mongo

CONFIG_PATH = Path(__file__).parent / "config.yaml"
def get_job_description(link):
    """
    Given a URL for the job listing, fetches the page and returns
    (a naive version of) the job description text.
    """
    try:
        job_page = requests.get(link, timeout=10)
        if job_page.status_code == 200:
            job_soup = BeautifulSoup(job_page.text, "html.parser")
            # Naively extract *all* text from the page:
            return job_soup.get_text(separator="\n").strip()
        else:
            return f"Could not retrieve job page, status code: {job_page.status_code}"
    except Exception as e:
        return f"Error fetching job description: {e}"

def scrape_simplify_new_grad_positions(config_data: str):
    """
    Scrapes the GitHub README page for SimplifyJobs/New-Grad-Positions,
    extracts each row from the first job table it finds, and then
    follows the "apply" link to grab the job description.
    """
    url = config_data.get("job_posting_sites","").get("git","").get("url","")
    response = requests.get(url)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")

    table = soup.find("table")
    if not table:
        print("No table found on the page!")
        return

    jobs_data = []
    rows = table.find_all("tr")[1:]  # skip header

    for row in rows:
        cols = row.find_all("td")
        # Create a list of cell texts, filling missing columns with empty strings
        # We expect 5 columns: [company, role, location, apply, date_posted]
        cells = [col.get_text(strip=True) for col in cols]
        # If some cells are missing, extend the list with empty strings
        if len(cells) < 5:
            cells.extend([""] * (5 - len(cells)))

        company, role, location, apply_text, date_posted = cells
        print(company, role, location, apply_text, date_posted )

        # Get the apply link, if present, from the fourth column
        apply_link = ""
        if len(cols) >= 4:
            link_tag = cols[3].find("a", href=True)
            if link_tag:
                apply_link = link_tag["href"]

        job_description = get_job_description(apply_link) if apply_link else ""

        job_info = {
            "company": company,
            "role": role,
            "location": location,
            "date_posted": date_posted,
            "apply_link": apply_link,
            "description": job_description
        }
        jobs_data.append(job_info)

    return jobs_data

def main():
    with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
        config_data = yaml.safe_load(f)

    print("Running job scraper...")
    all_jobs = scrape_simplify_new_grad_positions(config_data)
    store_job_data_in_mongo(all_jobs)
    if all_jobs:
        for idx, job in enumerate(all_jobs, start=1):
            print(f"{idx}. {job['company']} - {job['role']} - {job['location']} - Posted: {job['date_posted']}")
            print(f"   Link: {job['apply_link']}")
            print("   Description sample:")
            print("   ", (job["description"][:300] + "...") if job["description"] else "No description")
            print("-" * 80)
    print("Ended job scraper run...")

if __name__ == "__main__":
    main()
