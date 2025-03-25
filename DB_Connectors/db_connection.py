# db_connection.py

from pymongo import MongoClient
import yaml
from pathlib import Path
from pinecone import Pinecone

CONFIG_PATH = Path(__file__).parent / "config.yaml"
with open(CONFIG_PATH, "r", encoding="utf-8") as f:
    config_data = yaml.safe_load(f)

def get_mongo_client():
    """
    Returns a MongoClient instance connected to the MongoDB Atlas cluster.
    """
    MONGO_URI = config_data.get("MongoDB", {}).get("MONGO_URI")
    print("MongoDB URI:", MONGO_URI)
    return MongoClient(MONGO_URI)

def store_job_data_in_mongo(job_docs):
    """
    Takes a list of job data dictionaries (e.g. from your scraper) and inserts them
    into the 'jobs' collection in the 'mydatabase' database.
    """
    if not job_docs:
        print("No job documents to store.")
        return
    
    client = get_mongo_client()
    db = client["mydatabase"]         # Use whatever DB name you prefer
    collection = db["jobs"]           # Use a 'jobs' collection for your job docs

    # Insert many documents at once
    result = collection.insert_many(job_docs)
    print(f"Inserted {len(result.inserted_ids)} job documents into MongoDB.")

def fetch_jobs_from_mongo(filter_query=None):
    """
    Reads job documents from the 'jobs' collection.
    An optional filter_query (dictionary) can be used to narrow the search.
    Returns a list of job documents.
    """
    if filter_query is None:
        filter_query = {}

    client = get_mongo_client()
    db = client["mydatabase"]
    collection = db["jobs"]
    
    docs = list(collection.find(filter_query))
    print(f"Fetched {len(docs)} documents from MongoDB with filter: {filter_query}")
    return docs

def get_pinecone_index(index_name: str, dimension: int, metric: str = "cosine"):
    """
    Creates or connects to a Pinecone 2.0 serverless index.
    Returns a handle to that index.
    - index_name: Unique name for your Pinecone index (e.g., "job-embeddings")
    - dimension: Dimensionality of your embeddings (e.g., 768)
    - metric: distance metric ("cosine", "dotproduct", or "euclidean")
    """
    # Pull Pinecone API key, environment, cloud, and region from config
    PINECONE_API_KEY = config_data["Pinecone"].get("API_KEY", "")
    PINECONE_ENVIRONMENT = config_data["Pinecone"].get("ENVIRONMENT", "")
    PINECONE_CLOUD = config_data["Pinecone"].get("CLOUD", "aws")
    PINECONE_REGION = config_data["Pinecone"].get("REGION", "us-west1")

    # Create Pinecone client
    pc = Pinecone(api_key=PINECONE_API_KEY, environment=PINECONE_ENVIRONMENT)
    
    # For simplicity, we're skipping the creation logic with a Spec object.
    # If you want to create the index from scratch, see prior examples with ServerlessSpec.
    # For now, just return a handle to an existing index name.
    return pc.Index(index_name)

def main():
    """
    Simple demonstration of MongoDB + Pinecone functionality:
    1) Connect to MongoDB and insert some placeholder data.
    2) Read data back from MongoDB.
    3) Connect to Pinecone and list existing indexes.
    """

    # 1) MongoDB test
    print("Creating MongoDB client and testing write/read ...")
    sample_jobs = [
        {"company": "Acme Corp", "role": "Software Eng", "location": "NYC"},
        {"company": "Beta Inc", "role": "Data Scientist", "location": "LA"}
    ]
    store_job_data_in_mongo(sample_jobs)
    fetched = fetch_jobs_from_mongo()
    print("Fetched documents:", fetched)

    # 2) Pinecone test
    PINECONE_API_KEY = config_data["Pinecone"]["API_KEY"]
    PINECONE_ENVIRONMENT = config_data["Pinecone"]["ENVIRONMENT"]
    pc = Pinecone(api_key=PINECONE_API_KEY, environment=PINECONE_ENVIRONMENT)
    print("Listing Pinecone indexes:")
    before_resp = pc.list_indexes()
    print([ix.name for ix in before_resp.indexes])

    # Get index handle
    index_name = "example-index"
    dimension = 768
    index = get_pinecone_index(index_name, dimension)
    print(f"Got Pinecone index handle for '{index_name}'")

if __name__ == "__main__":
    main()
