import os
import sys

# Add project root to path so we can import app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.ml import train_and_select_model

if __name__ == "__main__":
    train_and_select_model()
