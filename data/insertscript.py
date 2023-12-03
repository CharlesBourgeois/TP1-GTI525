import json
from pymongo import MongoClient


def insert_data_from_json(file_path, collection):
    with open(file_path, 'r') as file:
        data = json.load(file)
    result = collection.insert_many(data)
    print(f"Inserted data from {file_path} with result: {result.inserted_ids}")


# Connect to MongoDB
client = MongoClient("mongodb://127.0.0.1:27017/")
db = client['db']

# Insert data for different collections
insert_data_from_json("territoires.geojson", db.TerritoiresGeoJSON)
insert_data_from_json("reseau_cyclable.geojson", db.Reseau_cyclable)
insert_data_from_json("territoires.json", db.Territoires)
insert_data_from_json("fontaines.json", db.Fontaines)
insert_data_from_json("compteurs.json", db.Compteurs)

# Insert data for 'ComptageVelo' collection from multiple files
comptage_velo_files = [
  "comptage_velo_2019.json",
  "comptage_velo_2020.json",
  "comptage_velo_2021.json",
  "comptage_velo_2022.json"
]

for file_name in comptage_velo_files:
    insert_data_from_json(file_name, db.ComptageVelo)

client.close()
