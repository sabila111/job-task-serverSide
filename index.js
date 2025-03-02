const express = require('express')
const cors = require('cors') 
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mf0sj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");


    const jobsCollection = client.db("jobTask").collection("jobs");



    app.get('/jobs', async (req, res) => {
        const result = await jobsCollection.find().toArray();
        res.send(result);
      })

      app.post('/jobs', async (req, res) => {
        const job = req.body;
        console.log(job)
        const result = await jobsCollection.insertOne(job)
        res.send(result)
      })

      app.put("/jobs/:id", async (req, res) => {
        const { id } = req.params;
        const { category } = req.body;
      
        const result = await jobsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { category } }
        );
      
        res.send(result);
      });
      

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('job task page is available')
  })
  
  app.listen(port, () => {
    console.log(`job task page is running on port ${port}`)
  })
