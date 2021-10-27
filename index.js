const express = require("express")
const { MongoClient } = require('mongodb');

const ObjectId = require("mongodb").ObjectId
require('dotenv').config()
const app = express()

const cors = require("cors")

const port = process.env.PORT || 8000

app.use(cors())
app.use(express.json())


// pass: 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6doss.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();

        const database = client.db("carRepair");
        const servicesCollection = database.collection("services")

        app.get("/services", async(req, res) => {
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray(cursor)
            res.send(services)
        })

        // Get Single Product

        app.get("/services/:id", async(req, res) => {
            const id = req.params.id
            const service = await servicesCollection.findOne({ _id: ObjectId(id) })
            res.json(service)
        })

        app.delete("/services/:id", async(req, res) => {
            const id = req.params.id
            const result = await servicesCollection.deleteOne({ _id: ObjectId(id) })
            res.json(result)
        })

        app.post("/services", async(req, res) => {

            console.log("post hitted")
            const service = req.body

            const result = await servicesCollection.insertOne(service)
            console.log("A document was inserted with the _id", result.insertedId)

            // const result = await servicesCollection.insertOne(data)
            // console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.json(result)
        })
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Connecting to the server")
})

app.listen(port)