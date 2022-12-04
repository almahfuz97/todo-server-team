const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://<username>:<password>@cluster0.leesidy.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const usersCollection = client.db("todoDB").collection('users');

        app.post('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const alreadyUser = await usersCollection.find(filter).toArray();
            if (alreadyUser) {
                return res.send({ message: "Already you have an account" });
            }
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })

    }
    finally {

    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Server is running.')
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
