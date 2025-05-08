# api.py

from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional

from job_recommendation_engine.recommend_jobs import recommend_jobs_from_resume

app = FastAPI()

class ResumeRequest(BaseModel):
    resume_text: str
    top_k: Optional[int] = 5  # default 5 if not provided

class Recommendation(BaseModel):
    id: str
    company: str
    role: str
    location: str
    similarity_score: float

@app.post("/recommend", response_model=List[Recommendation])
def recommend_jobs(request: ResumeRequest):
    """
    Takes 'resume_text' and an optional 'top_k', returns a list of recommended jobs.
    """
    recommendations = recommend_jobs_from_resume(
        resume_text=request.resume_text,
        top_k=request.top_k
    )
    return recommendations
