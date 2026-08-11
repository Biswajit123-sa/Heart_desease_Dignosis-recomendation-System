import os
import sys

# Add project root to path so we can import app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.rag import ingest_directory

if __name__ == "__main__":
    ingest_directory()
