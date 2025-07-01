import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useCallback } from "react";
import {
  fetchAllUsers,
  followUser,
  unfollowUser,
  fetchFollowers,
  fetchFollowing,
} from "../store/actions/user.action.jsx";

export function useFollow() {
  const dispatch = useDispatch();
  const { users, followers, following, followingIds, loading, error } =
    useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);

  const getAllUsers = useCallback(() => dispatch(fetchAllUsers()), [dispatch]);

  const follow = useCallback((id) => dispatch(followUser(id)), [dispatch]);

  const unfollow = useCallback((id) => dispatch(unfollowUser(id)), [dispatch]);

  const getFollowers = useCallback(
    (userId) => dispatch(fetchFollowers(userId)),
    [dispatch]
  );
  
  const getFollowing = useCallback(
    (userId) => dispatch(fetchFollowing(userId)),
    [dispatch]
  );

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchFollowing(user.id));
    }
  }, [dispatch, user?.id]);

  return {
    users,
    followers,
    following,
    followingIds,
    loading,
    error,
    getAllUsers,
    follow,
    unfollow,
    getFollowers,
    getFollowing,
  };
}
