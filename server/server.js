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
    res.status(200).json("Home GET Request"); // Use 200 for GET requests
});

// api routes
app.use('/api', router);

// Start Server only if we have a valid connection
connect()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server connected to http://localhost:${port}`);
        });
    })
    .catch(error => {
        console.error("Invalid database connection:", error); // Log the actual error
    });
