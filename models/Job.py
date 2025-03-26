class Job:
    def __init__(self, job_title="", company_name="", location="", job_description="", seniority_level="", 
                 employment_type="", job_function="", industries="", job_link=""):
        self._job_title = job_title
        self._location = location
        self._company_name = company_name
        self._job_description = job_description
        self._seniority_level = seniority_level
        self._employment_type = employment_type
        self._job_function = job_function
        self._industries = industries
        self._job_link = job_link

    # Getters
    def get_job_title(self):
        return self._job_title

    def get_location(self):
        return self._location

    def get_company_name(self):
        return self._company_name

    def get_job_description(self):
        return self._job_description

    def get_seniority_level(self):
        return self._seniority_level

    def get_employment_type(self):
        return self._employment_type

    def get_job_function(self):
        return self._job_function

    def get_industries(self):
        return self._industries
    
    def get_job_link(self):
        return self._job_link

    # Setters
    def set_job_title(self, job_title):
        self._job_title = job_title

    def set_location(self, location):
        self._location = location

    def set_company_name(self, company_name):
        self._company_name = company_name

    def set_job_description(self, job_description):
        self._job_description = job_description

    def set_seniority_level(self, seniority_level):
        self._seniority_level = seniority_level

    def set_employment_type(self, employment_type):
        self._employment_type = employment_type

    def set_job_function(self, job_function):
        self._job_function = job_function

    def set_industries(self, industries):
        self._industries = industries
    
    def set_job_link(self, job_link):
        self._job_link = job_link

    # String representation for better readability
    def __str__(self):
        return (f"Job Title: {self._job_title}\n"
                f"Location: {self._location}\n"
                f"Company Name: {self._company_name}\n"
                f"Job Description: {self._job_description}\n"
                f"Seniority Level: {self._seniority_level}\n"
                f"Employment Type: {self._employment_type}\n"
                f"Job Function: {self._job_function}\n"
                f"Industries: {self._industries}\n"
                f"Job Link: {self._job_link}\n")
