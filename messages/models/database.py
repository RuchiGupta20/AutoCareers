from pymongo import MongoClient
import yaml
from pathlib import Path
import sys
from contextlib import contextmanager

# Use the existing DB connection from DB_Connectors
sys.path.append(".")
from DB_Connectors.db_connection import get_mongo_client

def get_db():
    """Get MongoDB database connection"""
    client = get_mongo_client()
    db = client["mydatabase"]
    return db

def get_messages_collection():
    """Get messages collection"""
    db = get_db()
    return db["messages"]

def get_conversations_collection():
    """Get conversations collection"""
    db = get_db()
    return db["conversations"]

def get_users_collection():
    """Get users collection"""
    db = get_db()
    return db["users"] 