# api.py

from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from job_recommendation_engine.recommend_jobs import recommend_jobs_from_resume

app = FastAPI()
# === ADDING MID LAYER FOR INTER AOU CALL ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or ["*"] to allow any
    allow_credentials=True,
    allow_methods=["*"],                     # enables OPTIONS, POST, GET, etc.
    allow_headers=["*"],
)
class ResumeRequest(BaseModel):
    resume_text: str
    top_k: Optional[int] = 5  # default 5 if not provided

class Recommendation(BaseModel):
    id: str
    company: str
    role: str
    location: str
    similarity_score: float
    apply_link: str

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
