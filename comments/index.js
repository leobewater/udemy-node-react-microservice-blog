const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

// get post's comments
app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

// post new comment
app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;

  // get comments by Post id
  const comments = commentsByPostId[req.params.id] || [];
  comments.push({
    id: commentId,
    content,
    status: 'pending'
  });

  commentsByPostId[req.params.id] = comments;

  // dispatch event to event bus
  // await axios.post('http://localhost:4005/events/', {
  // using kubernetes cluster IP service name and port
  await axios.post('http://event-bus-srv:4005/events', {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      status: 'pending'
    },
  });

  res.status(201).send(comments);
});

// receive event from event bus
app.post('/events', async(req, res) => {
  console.log('Received Event', req.body.type);

  const {type, data} = req.body;
  if(type === 'CommentModerated') {
    const {postId, id, status, content} = data;

    const comments = commentsByPostId[postId];
    
    // find the comment from the list that get moderated
    const comment = comments.find(comment => {
      return comment.id === id;
    });

    // update comment status
    comment.status = status;

    // dipatch CommentUpdated event to the event bus
    // await axios.post('http://localhost:4005/events', {
    // using kubernetes cluster IP service name and port
    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentUpdated',
      data: {
        id,
        status,
        postId,
        content,
      }
    })
  }

  res.send({});
});

app.listen(4001, () => {
  console.log('Listening on 4001');
});
