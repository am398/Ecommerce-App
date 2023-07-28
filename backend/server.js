import dotenv from 'dotenv';
dotenv.config({ path: "../.env" });
import app from './app.js';
import connectDB from './config/database.js';

process.on('uncaughtException', err => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to Uncaught Exception");
    process.exit(1);
}
);

process.on('unhandledRejection', err => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to Unhandled Promise rejection");
    server.close(() => {
        process.exit(1);
    })
});

console.log(process.env.MONGO_URI);
connectDB();


const server = app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
}
);



