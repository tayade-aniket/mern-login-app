import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

// MongoDB Connection 
import connect from './database/conn.js';

// Router String
import router from './router/route.js';

// initializing app
const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by');

const port = 8080;

// HTTP GET Request
app.get("/", (req, res) => {
    res.status(201).json("Home GET Request");
})

// api routes
app.use('/api', router);

// Start Server only we have a valid connection
connect().then(() => {
    try{
        app.listen(port, () => {
            console.log(`Server connected to http://localhost:${port}`);
        })
    }catch(error){
        console.log('Cannot connect to the server');
    }
}).catch(error => {
    console.log("Invalid database connecttion...!");
});