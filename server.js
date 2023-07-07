const express=require("express");
const mongoose = require('mongoose');
const router = require("./routes/User")
const quizRoutes= require("./routes/quizRoutes");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();
const app=express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Set up default mongoose connection
const url="mongodb+srv://akkipaul9:zg68vaHPWQXWlY4Y@cluster0.pbeinat.mongodb.net/";
const mongoDB = url; 
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Bind connection to open event (to get notification of successful connection)
db.once('open', function() {
  console.log('MongoDB connection successful!');
});

app.use("/user", router);
app.use("/quiz", quizRoutes);
const port=3000;

app.listen(port,()=>{
  console.log(`server running on port ${port}`)
})
// zg68vaHPWQXWlY4Y