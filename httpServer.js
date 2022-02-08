const express = require('express');
const { getBlocks, getVersion, nextBlock, addBlock } = require('./block');

const HTTP_PORT = process.env.HTTP_PORT || 4000;

const initHttpServer = () => {
  const app = express();
  app.use(express.json());

  app.get('/blocks', (req, res) => {
    res.send(getBlocks());
  });
  
  app.get("/version", (req, res) => {
    res.send(getVersion());
  });

  app.post("/mineBlock", (req, res) => {
    const data = req.body.data || [];
    const block = nextBlock(data);
    addBlock(block);

    res.send(block);
  });

  app.post("/stop", (req, res) => {
    res.send({ "msg" : "Stop Server!" });
    process.exit();
  });

  app.listen(HTTP_PORT, () => {
    console.log(`Listening Http Port : ${HTTP_PORT}`);
  });
};

initHttpServer();