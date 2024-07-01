require("dotenv").config();

const express = require("express");
const app = express();
const PORT = 3000;

// app.get("/", (req, res) => {
//   res.send("Hello World");
// });

app.use("/", require("./routes/router_index"));

app.listen(PORT, () => console.log(`server is running on port: ${PORT}`));
