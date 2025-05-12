# upsert_to_pinecone.py
import time
from DB_Connectors.db_connection import fetch_jobs_from_mongo, get_pinecone_index

def chunker(seq, batch_size=64):
    for i in range(0, len(seq), batch_size):
        yield seq[i : i + batch_size]

def truncate_text(text, max_bytes=40000):
    """
    Convert text to utf-8 bytes, truncate if over max_bytes,
    then decode back to a string.
    """
    encoded = text.encode("utf-8", errors="ignore")
    if len(encoded) > max_bytes:
        encoded = encoded[:max_bytes]
    return encoded.decode("utf-8", errors="ignore")

def upsert_jobs_to_pinecone():
    jobs = fetch_jobs_from_mongo()
    if not jobs:
        print("No job documents found in MongoDB.")
        return

    records = []
    for job in jobs:
        description = job.get("description", "")
        if not description.strip():
            continue  # skip empty

        # Truncate to avoid Pinecone's 40KB metadata limit
        description = truncate_text(description, max_bytes=40000)

        record = {
            "_id": str(job["_id"]),
            "text": description,      # for integrated embeddings
            "company": job.get("company", ""),
            "role": job.get("role", ""),
            "location": job.get("location", ""),
            "apply_link": job.get("apply_link", ""),
        }
        records.append(record)

    print(f"Preparing to upsert {len(records)} records to Pinecone...")

    index = get_pinecone_index(index_name="resumeembeddings", dimension=2048)

    batch_count = 0
    for batch in chunker(records, batch_size=64):
        batch_count += 1
        print(f"Upserting batch {batch_count} with {len(batch)} records...")
        index.upsert_records(namespace="job-listings", records=batch)
        time.sleep(0.5)

    print("All batches sent to Pinecone. Waiting a few seconds for indexing...")
    time.sleep(5)
    print("Done! Your job data is now in Pinecone.")

def main():
    upsert_jobs_to_pinecone()

if __name__ == "__main__":
    main()
