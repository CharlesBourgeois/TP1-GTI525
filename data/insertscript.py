import ast
import pymongo
import json
from pymongo import MongoClient

client = pymongo.MongoClient("mongodb://127.0.0.1:27017/db")
db = client.db
print(db)


collection = db.TerritoiresGeoJSON
requesting = []

with open(r"territoires.geojson") as f:
    for jsonObj in f:
        myDict = json.loads(jsonObj)
        requesting = myDict

result = collection.insert_many(requesting)
print(result)

collection = db.Reseau_cyclable
requesting = []

with open(r"reseau_cyclable.geojson") as f:
    for jsonObj in f:
        myDict = json.loads(jsonObj)
        requesting = myDict

result = collection.insert_many(requesting)
print(result)

collection = db.Territoires
requesting = []

with open(r"territoires.json") as f:
    for jsonObj in f:
        myDict = json.loads(jsonObj)
        requesting = myDict

result = collection.insert_many(requesting)
print(result)

collection = db.Fontaines
requesting = []

with open(r"fontaines.json") as f:
    for jsonObj in f:
        myDict = json.loads(jsonObj)
        requesting = myDict

result = collection.insert_many(requesting)
print(result)

collection = db.Compteurs
requesting = []
with open(r"compteurs.json") as f:
    for jsonObj in f:
        myDict = json.loads(jsonObj)
        requesting = myDict

result = collection.insert_many(requesting)
print(result)

collection = db.ComptageVelo2019
requesting = []
with open(r"comptage_velo_2019.json") as f:
    for jsonObj in f:
        myDict = json.loads(jsonObj)
        requesting = myDict

result = collection.insert_many(requesting)
print(result)

collection = db.ComptageVelo2020
requesting = []
with open(r"comptage_velo_2020.json") as f:
    for jsonObj in f:
        myDict = json.loads(jsonObj)
        requesting = myDict

result = collection.insert_many(requesting)
print(result)

collection = db.ComptageVelo2021
requesting = []
with open(r"comptage_velo_2021.json") as f:
    for jsonObj in f:
        myDict = json.loads(jsonObj)
        requesting = myDict

result = collection.insert_many(requesting)
print(result)

collection = db.ComptageVelo2022
requesting = []
with open(r"comptage_velo_2022.json") as f:
    for jsonObj in f:
        myDict = json.loads(jsonObj)
        requesting = myDict

result = collection.insert_many(requesting)
print(result)

client.close()