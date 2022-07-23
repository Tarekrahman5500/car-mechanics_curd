import express from 'express'
import cors from 'cors'
import {MongoClient, ObjectId, ServerApiVersion} from 'mongodb'
import 'dotenv/config'
import req from "express/lib/request";
import res from "express/lib/response";


const app = express()
const port = process.env.PORT || 5000


//handle cors policy
app.use(cors())

// work done as middle ware body parser
app.use(express.json())


//handle mongodb

const client = new MongoClient(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
});

async function run() {

    try {
        await client.connect()
        console.log('connected to server')
        // create database

        const database = await client.db("carmechanic")
        // create collection
        const serviceCollection = await database.collection('services')

        // get api
        app.get('/services', async (req, res) => {

            const cursor = serviceCollection.find({})
            const services = await cursor.toArray()
            res.send(services)
        })

        // get api for a single element
        app.get('/services/:id', async (req, res) => {

            // get the id from font end
            const id = req.params.id
          //  console.log(id)
            // get the _id
            const query = {_id:ObjectId(id)}
            // find the specific id data
            const service = await  serviceCollection.findOne(query)
            res.json(service)
        })

        // post api
        app.post('/services', async (req, res) => {

            // get the properties from the body
            //  const {name, price, description, img} = req.body

            // convert them into object for mongodb
            //  const service = {name, price, description, img}
            const service = req.body
            // insert into mongodb
            const result = await serviceCollection.insertOne(service)
            console.table(result)
            res.json(result)

        })

        // delete api

        app.delete('/services/:id', async (req, res) => {
            // get the id from font end
            const id = req.params.id
            //  console.log(id)
            // get the _id
            const query = {_id:ObjectId(id)}
            // remove the specific id data
            const result = await serviceCollection.deleteOne(query)
            res.json(result)
        })
    } finally {
        // await client.close()
    }

}

// call function
run().catch(console.dir);

// make a simple get request
app.get('/', (req, res) => {
    res.send('simple curd server')
})

//run the server
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

