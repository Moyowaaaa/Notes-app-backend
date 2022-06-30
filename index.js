const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {graphqlHTTP} = require('express-graphql');
const colors = require('colors');
require('dotenv').config();
const connectDB = require('./config/db');
const schema = require('./schema/schema');



const app = express();





//connect database
connectDB();

app.use(cors());


app.get('/',(req,res) => {
    res.send("we are live ")
})

app.use('/graphql',graphqlHTTP({
    schema,
    graphiql: true
}))


 

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`)});