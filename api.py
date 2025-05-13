# api.py

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
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

@app.post("/ats-score")
async def get_ats_score(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        contents = await file.read()
        tmp.write(contents)
        tmp_path = tmp.name

    try:
        result = subprocess.run(
            ["poetry", "run", "pdf2latex-agent", "ats-score", tmp_path],
            capture_output=True,
            text=True,
            check=True
        )
        return {"ats_score": result.stdout.strip()}
    except subprocess.CalledProcessError as e:
        return {"error": e.stderr.strip()}
    
    
@app.post("/generate-cover-letter")
async def generate_cover_letter(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    temp_filename = f"temp_{uuid.uuid4()}.pdf"
    try:
        with open(temp_filename, "wb") as f:
            content = await file.read()
            f.write(content)

        # Run the pdf2latex-agent CLI for cover letter
        command = [
            "poetry",
            "run",
            "pdf2latex-agent",
            "cover-letter",
            temp_filename,
            "--job-description",
            job_description
        ]

        result = subprocess.run(command, capture_output=True, text=True)

        if result.returncode != 0:
            return {"error": result.stderr}

        return {"cover_letter": result.stdout.strip()}

    finally:
        if os.path.exists(temp_filename):
            os.remove(temp_filename)

