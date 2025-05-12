import sys
from DB_Connectors.db_connection import get_pinecone_index
from pdf2latex_agent.pdf_converter import pdf_to_text
import argparse

def recommend_jobs_from_resume(resume_text: str, top_k: int = 5):
    """
    Performs a similarity search on the Pinecone index using integrated embeddings.
    Returns the top_k most relevant job postings for the given resume.
    """
    # 1) Grab the index handle (already created with integrated embeddings)
    #    Make sure the dimension matches your index’s configured dimension.
    index = get_pinecone_index(index_name="resumeembeddings", dimension=2048)
    
    # 2) Perform a semantic search. We pass:
    #    - The text of the resume as "inputs.text"
    #    - top_k to limit how many results we get
    #    - fields to retrieve from each record (e.g. "company", "role", "location", "text")
    search_response = index.search_records(
        namespace="job-listings",           # or "" for default namespace
        query={
            "inputs": {"text": resume_text},
            "top_k": top_k
        },
       fields=["company", "role", "location", "text", "apply_link"]
    )

    # The result is structured as a dict with search_response["result"]["hits"]
    hits = search_response["result"]["hits"]

    # 3) Format the hits into a friendlier structure
    recommendations = []
    for hit in hits:
        # Each hit has an _id, _score, and a 'fields' dict with your metadata
        fields = hit.get("fields", {})
        score = hit.get("_score", 0.0)

        # Construct a small record to return
        recommendation = {
            "id": hit.get("_id", ""),
            "company": fields.get("company", ""),
            "role": fields.get("role", ""),
            "location": fields.get("location", ""),
            "apply_link": fields.get("apply_link", ""), 
            "similarity_score": score,
            # 'text' is the job description if you want to see it:
             "description": fields.get("text", "")
        }
        recommendations.append(recommendation)

    return recommendations

def main():
    
    if len(sys.argv) < 2:
        print("Usage: python recommend_jobs.py 'YOUR_RESUME_PATH'")
        sys.exit(1)
    parser = argparse.ArgumentParser(description="CLI")
    parser.add_argument("pdf_path", help="Usage: python recommend_jobs.py 'YOUR_RESUME_PATH")
    args = parser.parse_args()  

    resume_text = pdf_to_text(args.pdf_path)
    # Get top 5 recommended jobs
    recs = recommend_jobs_from_resume(resume_text, top_k=5)

    if not recs:
        print("No recommendations found.")
        return

    print("Job Recommendations based on your resume:\n")
    for i, job in enumerate(recs, start=1):
        print(f"{i}. {job['company']} - {job['role']} ({job['location']}) ({job['apply_link']})")
        print(f"   Similarity score: {job['similarity_score']:.4f}")
        print(f"")
        print("   ----------------------------")

if __name__ == "__main__":
    main()
