import express from 'express';
import errorMiddleware from './middleware/error.js';
const app = express();
app.use(express.json());



import product from "./routes/productroute.js"

app.use('/api/v1', product);
app.use(errorMiddleware);

export default app;