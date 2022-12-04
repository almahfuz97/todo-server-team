const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://<username>:<password>@cluster0.leesidy.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    if (!authHeader) {
        return res.status(401).send({ message: 'Unauthorized access' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(401).send({ message: 'Unauthorized access' });
        }
        req.decoded = decoded;
        next();
    })
}

async function run() {
    try {
        const usersCollection = client.db("todoDB").collection('users');

        //jwt sign in
        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email };
            console.log(query);
            const user = await usersCollection.findOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.SECRET_ACCESS_TOKEN, { expiresIn: '1h' });
                return res.send({ token: token });
            }
            res.status(403).send({ message: 'Unauthorized access', token: '' });
        });

        //user add api
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
