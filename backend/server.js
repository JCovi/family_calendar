const express = require("express");

const app = express();

app.use(express.json());

const PORT = 5000;

app.get("/", (req, res) => {
    res.send("Family Calendar API is running!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});