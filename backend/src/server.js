import cors from "cors";
import dotenv from "dotenv";
import express from "express"

import notesRoutes from "./routes/notesRoutes.js"
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// middleware
app.use(cors());
app.use(express.json());
app.use(rateLimiter);

app.use((req,res,next) => {
    console.log(`Req method is ${req.method} \n& Req URL is ${req.url}`, req[0]);
    next();
});

app.use("/api/notes", notesRoutes);

connectDB().then( () => {
    app.listen(PORT, () => {
        console.log("Server started on PORT:", PORT)
    });
});