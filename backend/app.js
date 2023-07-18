import express from 'express';
const app=express();
app.use(express.json());


import product from "./routes/productroute.js"

app.use('/api/v1',product);

// Path: backend/app.js


export default app;