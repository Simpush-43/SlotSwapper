import React, { createContext, useReducer, useEffect } from "react";

const initialState = {
  token: localStorage.getItem("token") || null,
  user: JSON.parse(localStorage.getItem("user")) || null,
};

export const AuthContext = createContext(initialState);

function reducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return { token: action.token, user: action.user };
    case "LOGOUT":
      return { token: null, user: null };
    default:
      return state;
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Sync with LocalStorage
  useEffect(() => {
    if (state.token) localStorage.setItem("token", state.token);
    else localStorage.removeItem("token");

    if (state.user) localStorage.setItem("user", JSON.stringify(state.user));
    else localStorage.removeItem("user");
  }, [state.token, state.user]);

  const logout = () => dispatch({ type: "LOGOUT" });

  return (
    <AuthContext.Provider value={{ state, dispatch, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
