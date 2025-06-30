import { useDispatch, useSelector } from 'react-redux';
import {
  createPost, getAllPosts, updatePost, deletePost,
  toggleLike, commentOnPost, getPostComments,
  getUserFeed
} from '../store/actions/post.action';

export const usePost = () => {
  const dispatch = useDispatch();
  const { posts, comments, loading, error } = useSelector(state => state.post);

  return {
    posts,
    comments,
    loading,
    error,
    createPost: data => dispatch(createPost(data)),
    updatePost: data => dispatch(updatePost(data)),
    deletePost: id => dispatch(deletePost(id)),
    likePost: id => dispatch(toggleLike(id)),
    commentOnPost: data => dispatch(commentOnPost(data)),
    fetchFeed: () => dispatch(getUserFeed()),
    fetchComments: id => dispatch(getPostComments(id)),
  };
};
