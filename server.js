require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRouter = require("./routes/userRoute");
const questionRouter = require("./routes/questionRoute");

const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AI-Powered Quiz API",
      version: "1.0.0"
    },
    // tags: [
    //   {
    //     name: "Authentication",
    //     description: "Endpoints for User Authentication"
    //   }
    // ]
  },
  apis: ["./routes/*.js"] // replace with the path to your route files
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//routers
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use("/auth", authRouter);
app.use("/questions", questionRouter);

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Welcome to AI powered quiz api");
});

mongoose.connect(process.env.DATABASE_URL);

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Database connected"));

app.listen(port, () => console.log("server started on port", port));
