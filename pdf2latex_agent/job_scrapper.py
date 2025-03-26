from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from models.Job import Job
import time

class JobScrapper:
    def __init__(self, jobs = "", job_roles = ""):
        self._jobs = []
        self._JOB_ROLES = [
        "Software Engineer",
        # "Data Scientist",
        # "Machine Learning Engineer",
        # "DevOps Engineer",
        # "QA Engineer",
    ]
    
    def get_jobs(self):
        return self._jobs
    
    def get_job_roles(self):
        return self._JOB_ROLES

    def set_jobs(self, jobs):
        self._jobs = jobs

    def scrapeJobs(self) -> list:
        # set up ChromeOptions
        options = webdriver.ChromeOptions()

        # add headless Chrome option
        options.add_argument("--headless=new")

        # set up Chrome in headless mode
        driver = webdriver.Chrome(options=options)

        executingFirstTime = True
        jobs = []

        for role_keyword in self.get_job_roles():
            url = 'https://www.linkedin.com/jobs/search?trk=guest_homepage-basic_guest_nav_menu_jobs&position=1&pageNum=0'
            driver.get(url)

            # Give the page some time to load
            time.sleep(2)

            if executingFirstTime:
                close_button = driver.find_element(By.XPATH, "//button[@data-tracking-control-name='public_jobs_contextual-sign-in-modal_modal_dismiss']")
                driver.execute_script("arguments[0].click();", close_button)
                time.sleep(1)
                executingFirstTime = False

            input_field = driver.find_element(By.XPATH, "//*[@id='job-search-bar-keywords']")
            input_field.send_keys(role_keyword)
            input_field.send_keys(Keys.RETURN)

            titles = driver.find_elements(By.CLASS_NAME, "base-search-card__title")
            company_names = driver.find_elements(By.XPATH, '//h4[@class="base-search-card__subtitle"]//a[@class="hidden-nested-link"]')
            locations = driver.find_elements(By.CLASS_NAME, "job-search-card__location")
            job_links = driver.find_elements(By.CLASS_NAME, "base-card__full-link")

            for index, job_link in enumerate(job_links[:10]): # currently scrapes first 10, later on remove list slicing part
                try:
                    # Click on each job link
                    driver.execute_script("arguments[0].click();", job_link)
                    time.sleep(3)  # Allow job details to load

                    try:
                        job_description = driver.find_element(By.CLASS_NAME, "show-more-less-html__markup").text  
                    except:
                        job_description = "N/A"
                    
                    try:
                        meta_data = driver.find_elements(By.CLASS_NAME, "description__job-criteria-text")
                        if len(meta_data) == 4:
                            seniority_level, employment_type, job_function, industries = [data.text.strip() for data in meta_data]
                        else:
                            seniority_level, employment_type, job_function, industries = "", "", "", ""
                    except:
                        seniority_level, employment_type, job_function, industries = meta_data = "", "", "", ""

                    job = Job(titles[index].text, company_names[index].text, locations[index].text, job_description, seniority_level, employment_type, job_function, industries, job_link.get_attribute("href"))
                    jobs.append(job)
                except Exception as e:
                    print(f"Error processing job: {e}")
                time.sleep(1)

        self.set_jobs(jobs)

        return jobs
