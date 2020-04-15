// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = 3000;
// Start up an instance of app
const app = express();


/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());
// Initialize the main project folder
app.use(express.static('website'));


const server = app.listen(PORT, ()=>{
    console.log(`Server started at port ${PORT}`);
})

app.get('/getData', (req, res) => {
    res.status(200).send(projectData);
})

app.post('/postData', (req, res) => {
    const params = req.body;
    if(params.temp && params.date && params.userResponse){
        //projectData()
        count.inc();
        projectData[count.get()] = params;
        res.status(200).send({
            message: 'post successfull'
        });
    } else {
        res.status(500).send({
            message: 'Error: Missing parameters'
        });
    }
})

// I created this closure so I can generate unique IDs 
const incrementor = () => {
    let start = 0;
    return {
        inc() {
            start++;
        },
        get() {
            return start;
        }
    }       
}
const count = incrementor();
// Setup Server
