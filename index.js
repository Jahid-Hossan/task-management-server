const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors({
    origin: [
        "http://localhost:5174",
        "http://localhost:5173",
        "https://task-manager-82059.web.app",
        "https://task-manager-82059.firebaseapp.com/"
    ]
}));
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.shpjug3.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {

    try {

        const todoCollection = client.db("AllTodo").collection("Todo");

        app.get('/todo', async (req, res) => {
            try {
                const result = await todoCollection.find().toArray()
                console.log(result)
                res.send(result)
            } catch (error) {

            }
        })

        app.post('/todo', async (req, res) => {
            try {
                const todo = req.body;
                // console.log(todo)
                const result = await todoCollection.insertOne(todo)
                res.send(result)
            } catch (error) {
                console.log(error)
            }
        })

        app.patch('/todo/:id', async (req, res) => {
            try {

                const id = req.params.id;
                const item = req.body;
                console.log(id)
                const filter = { _id: new ObjectId(id) }
                const updatedDoc = {
                    $set: {
                        title: item.title,
                        description: item.description,
                        priority: item.priority,
                        deadline: item.deadline,
                        status: item.status,
                    }
                }

                console.log(item)
                const result = await todoCollection.updateOne(filter, updatedDoc)
                res.send(result);
            } catch (error) {
                console.log(error)
            }
        })

        app.delete('/todo/:id', async (req, res) => {
            try {
                const id = req.params.id;
                // console.log(id)
                const query = { _id: new ObjectId(id) }
                const result = await todoCollection.deleteOne(query)
                res.send(result)
            } catch (error) {
                console.log(error)
            }
        })

        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})