import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentCreate from './CommentCreate';

const PostList = () => {
  const [posts, setPosts] = useState({});

  // get posts from api
  const fetchPosts = async () => {
    const res = await axios.get('http://localhost:4000/posts');

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
          <CommentCreate postId={post.id} />
        </div>

      </div>
    );
  });

  return <div className='d-flex flex-row flex-wrap justify-content-between'>
      {renderedPosts}
  </div>;
};

export default PostList;
