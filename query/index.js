const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  // add new post to the posts object
  if (type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  // add new comments to the posts object
  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  // update both comment status and content in the posts object
  if (type === 'CommentUpdated') {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    const comment = post.comments.find((comment) => {
      return comment.id === id;
    });

    comment.status = status;
    comment.content = content;
  }
};

// get posts and comments together
app.get('/posts', (req, res) => {
  res.send(posts);
});

// receive event from event bus
app.post('/events', (req, res) => {
  const { type, data } = req.body;

  handleEvent(type, data);

  // console.log(posts);

  res.send({});
});

app.listen(4002, async () => {
  console.log('Listening on 4002');

  try {
    // get all the pending/dropped events
    // const res = await axios.get('http://localhost:4005/events');
    // using kubernetes cluster IP service name and port
    const res = await axios.get('http://event-bus-srv:4005/events');

    // re-run the pending events
    for (let event of res.data) {
      console.log('Processing event:', event.type);

      handleEvent(event.type, event.data);
    }
  } catch (error) {
    console.log(error.message);
  }
});
