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

app.post('/posts/create', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = {
    id,
    title,
  };

  // emit post created event
//  await axios.post('http://localhost:4005/events', {
  // using kubernetes cluster IP service name and port
  await axios.post('http://event-bus-srv:4005/events', {
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

