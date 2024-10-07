import express, { Request, Response } from "express";
import mongoose from "mongoose"; // Import mongoose
import usersRouter from "./routes/user.routes";
import categoryRouter from "./routes/category.routes";
import transactionRouter from "./routes/transaction.controller";
import cors from "cors";

const app = express();

const PORT = 8080;

// MongoDB connection string (replace <password>, <dbname>, <cluster>)
const MONGO_URI =
  "mongodb://hydramote7272:VmsYDxFSCQiobVVX@cluster0-shard-00-00.echtq.mongodb.net:27017,cluster0-shard-00-01.echtq.mongodb.net:27017,cluster0-shard-00-02.echtq.mongodb.net:27017/expense_tracker?ssl=true&replicaSet=atlas-dq7sfs-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

// Middleware to parse JSON requests
app.use(express.json());
app.use(
  cors({
    origin: "*", // This allows all domains. You can restrict it by using your front-end URL.
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allowed methods
  })
);
// MongoDB connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    // Start the server only when the database is connected
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB: ", error);
  });

// Base route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express!");
});

app.use("/api/users", usersRouter); // For user authentication
app.use("/api/categories", categoryRouter); // For category management
app.use("/api/categories", transactionRouter); // For transaction management
