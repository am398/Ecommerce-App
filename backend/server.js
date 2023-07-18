import dotenv from 'dotenv';
dotenv.config({ path: "./.env" });

process.on('uncaughtException', err => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to Uncaught Exception");
    process.exit(1);
}
);


import app from './app.js';
import connectDB from './config/database.js';



connectDB();


const server = app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
}
);

process.on('unhandledRejection', err => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to Unhandled Promise rejection");
    server.close(() => {
        process.exit(1);
    })
}
);
