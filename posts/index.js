const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/posts', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = {
    id,
    title,
  };

  // emit post created event
  await axios.post('http://localhost:4005/events', {
    type: 'PostCreated',
    data: {
      id,
      title,
    },
  });

  res.status(201).send(posts[id]);
});

// receive event from event bus
app.post('/events', (req, res) => {
  console.log('Received Event', req.body.type);

  res.send({});
});

app.listen(4000, () => {
  console.log('v55');
  console.log('Listening on 4000');
});

/*
Terminal - build image with tag name
> docker build -t lcheung/posts . 
> docker run lcheung/posts
// to ssh to the instance
> docker run -it lcheung/posts sh
// Or using container ID
> docker exec -it a04b40b7db2e sh 
> docker ps
// get log from container ID
> docker logs a04b40b7db2e

// with Kubernate enabled
build image with version
> docker build -t lcheung/posts:0.0.1 .
*/
