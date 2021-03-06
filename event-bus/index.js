const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// store all incoming events
const events = [];


app.post('/events', (req, res) => {
  const event = req.body;
  
  // save event
  events.push(event);

  // dispatch events to all microservices
  
  // post
  //axios.post('http://localhost:4000/events', event).catch((err) => {
  // using kubernetes cluster IP service name and port
  axios.post('http://posts-clusterip-srv:4000/events', event).catch((err) => {
    console.log(err.message);
  });

  // comment
  axios.post('http://comments-srv:4001/events', event).catch((err) => {
    console.log(err.message);
  });

  // query service
  axios.post('http://query-srv:4002/events', event).catch((err) => {
    console.log(err.message);
  });

  // comment moderation
  axios.post("http://moderation-srv:4003/events", event).catch((err) => {
    console.log(err.message);
  });  

  res.send({ status: 'OK' });
});


// get all stored incoming events
app.get('/events', (req, res) => {
  res.send(events);
})


app.listen(4005, () => {
  console.log('Listening on 4005');
});
