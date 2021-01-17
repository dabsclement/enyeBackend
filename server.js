const express = require("express");
const cors = require("cors");

const server = express();
server.use(cors());

const getApi = require("./route/getApi");
server.use("/api", getApi);

server.get("*", (req, res) => {
    res.status(404).json({ error: "Route not available" });
});

const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));