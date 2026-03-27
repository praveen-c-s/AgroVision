from db import db

print("Connected successfully!")

collections = db.list_collection_names()
print("Collections in DB:", collections)
