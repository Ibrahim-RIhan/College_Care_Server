require('dotenv').config()
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
const port = process.env.PORT || 5000;



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aibqdpa.mongodb.net/?retryWrites=true&w=majority`;

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
    const userCollection = client.db("CollegeCareDB").collection("users")
    const reviewCollection = client.db("CollegeCareDB").collection("reviews")
    const collegesCollection = client.db("CollegeCareDB").collection("colleges")
    const usersCollegeCollection = client.db("CollegeCareDB").collection("usersCollege")


    app.get('/colleges', async (req, res) => {
      const result = await collegesCollection.find().toArray()
      res.send(result);
    })


    app.get('/colleges/:id', async (req, res) => {
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)}
      const result = await collegesCollection.findOne(filter)
      res.send(result);
    })

    app.get('/reviews', async (req, res) => {
      const result = await reviewCollection.find().toArray()
      res.send(result);
    })

    app.get('/users', async (req, res) => {
      const result = await userCollection.find().toArray()
      res.send(result);
    })

    app.get('/users/:email', async (req, res) => {
      const email = req.params.email
      const filter = { email: email }
      const result = await userCollection.findOne(filter).toArray()
      res.send(result);
    })

    app.post('/users', async (req, res) => {
      const user = req.body;
      const email = user.email;
      const query = { email: email }
      const existingUser = await userCollection.findOne(query)
      if (existingUser) {
        return res.send({ message: 'User already exists' })
      }
      const result = await userCollection.insertOne(user)
      res.send(result)
    })
     
    app.post('/my-college', async (req, res) => {
      const item = req.body ;
      const result = await usersCollegeCollection.insertOne(item)
      res.send(result)
    })

    app.get('/my-college:email', async (req, res) => {
      const email = req.params.email;
      const filter = {email: email}
      const result = await usersCollegeCollection.find(filter).toArray()
      res.send(result)
    })



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('College Care Server is Running')
})

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
})

