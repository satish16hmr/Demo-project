import React, { createContext, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login, logout, signup } from "../store/actions/auth.action.jsx";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const { user, token, loading, error } = useSelector((state) => state.auth);

  const loginUser = (body) => dispatch(login(body));
  const signupUser = (body) => dispatch(signup(body));
  const logoutUser = () => dispatch(logout());

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        loginUser,
        signupUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}

