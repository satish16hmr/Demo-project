import { useDispatch, useSelector } from "react-redux";
import { login, signup } from "../store/actions/auth.action.jsx";
import { logout } from "../store/redusers/auth.reduser.jsx";
import { useCallback } from "react";

export function useAuth() {
  const dispatch = useDispatch();
  const { user, token, loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const loginUser = useCallback(
    async (body) => {
      return await dispatch(login(body));
    },
    [dispatch]
  );

  const signupUser = useCallback(
    async (body) => {
      return await dispatch(signup(body));
    },
    [dispatch]
  );

  const logoutUser = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    loginUser,
    signupUser,
    logoutUser,
  };
}
