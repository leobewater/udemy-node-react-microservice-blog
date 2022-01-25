import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentCreate from './CommentCreate';
import CommentList from './CommentList';

const PostList = () => {
  const [posts, setPosts] = useState({});

  
  const fetchPosts = async () => {
    // get posts from Post api
    // const res = await axios.get('http://localhost:4000/posts');
    
    // get posts from Query service api
    // const res = await axios.get('http://localhost:4002/posts');
    const res = await axios.get('http://blog-kube.local/posts');

    setPosts(res.data);
  };

  // run this function run time when loading component
  useEffect(() => {
    fetchPosts();
  }, []);

  // console.log(posts);

  // extract all values from the posts object
  const renderedPosts = Object.values(posts).map((post) => {
    return (
      <div
        className="card"
        style={{ width: '30%', marginBottom: '20px' }}
        key={post.id}
      >
        <div className="card-body">
          <h3>{post.title}</h3>
          <CommentList comments={post.comments} />
          <CommentCreate postId={post.id} />
        </div>

      </div>
    );
  });

  return (<div className='d-flex flex-row flex-wrap justify-content-between'>
      {renderedPosts}
  </div>);
};

export default PostList;
