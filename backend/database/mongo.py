from pymongo import MongoClient
import logging

class MongoDB:
    def __init__(self):
        self.client = None
        self.db = None
        self.collection = None

    def initialize(self, uri, db_name, collection_name):
        try:
            self.client = MongoClient(uri)
            self.db = self.client[db_name]
            self.collection = self.db[collection_name]
            logging.info(f"Connected to MongoDB: {db_name}.{collection_name}")
        except Exception as e:
            logging.error(f"Failed to connect to MongoDB: {e}")
            raise e

db = MongoDB()
