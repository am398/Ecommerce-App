import { listen } from './app';
import dotenv from 'dotenv';


dotenv.config({path:"backend/config/config.env"});

listen(process.env.PORT||3000,()=>{
    console.log(`Server running on port ${process.env.PORT||3000}`);
}
);
