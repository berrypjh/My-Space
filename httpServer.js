const express = require('express');
const { nextBlock, getBlocks, getVersion } = require('./block');
const { addBlock } = require('./checkValidBlock');

const http_port = process.env.HTTP_PORT || 4000;

const initHttpServer = () => {
  const app = express();
  app.use(express.json());

  app.get("/blocks", (req, res) => {
    res.send(getBlocks());
  })
  
  app.post("/mineBlock", (req, res) => {
    const data = req.body.data || [];
    const block = nextBlock(data);
    addBlock(block);

    res.send(block);
  })

  app.get("/version", (req, res) => {
    res.send(getVersion());
  });

  app.post("/stop", (req, res) => {
    res.send({ "msg" : "Stop Server!" });
    process.exit();
  });

  app.listen(http_port, () => {
    console.log("Listening Http Port : " + http_port);
  });
};

initHttpServer();