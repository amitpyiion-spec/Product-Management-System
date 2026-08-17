import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./config/db.js";
import productRoutes from "./routes/product.route.js";

dotenv.config();


const app = express();

 
app.use(cors());
app.use(express.json());

 const PORT = process.env.PORT || 5000;
 
app.get("/", (req, res) => {
   res.json({
    message:"hello"
   })
})
app.use("/api/products", productRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});