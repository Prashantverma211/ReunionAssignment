import express, { NextFunction, Response, Request } from "express";
import { connectDB, gracefulShutdown } from "./connect";
import authRouter from "./routes/auth";
import taskRouter from "./routes/user";
import bodyParser from "body-parser";
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(bodyParser.json({ limit: "50mb" }));

//-------------------------------- CORS Middleware --------------------------------
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS,PATCH"
    );
  }

  next();
});

app.use("/", (req, res, next) => {
  console.log("Starting..");
  next();
});

//-------------------------------- Auth Route --------------------------------
app.use("/api/auth", authRouter);

//-------------------------------- Auth Route --------------------------------
app.use("/api/task", taskRouter);

//-------------------------------- Incorrect URL Requests --------------------------------
app.use(() => {
  throw new Error("not a correct URL");
});

//-------------------------------- Error Handling --------------------------------
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const code = error.code || 500;
  const message = error.message || "An error occurred";
  const data = error.data || [];

  console.log(error);

  res.status(code).json({ message, error: data });
});

//-------------------------------- Starting Server --------------------------------
const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

//-------------------------------- Handle Server Shutdown --------------------------------
process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

startServer();
