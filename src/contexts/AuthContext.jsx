import { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const initialState = {
  isAuthenticated: false,
  user: null,
  admin: null,
  isAdmin: false,
  loading: true,
  token: localStorage.getItem('token')
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user || null,
        admin: action.payload.admin || null,
        isAdmin: !!action.payload.admin, 
        token: action.payload.token,
        loading: false
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        admin: null,
        isAdmin: false,
        token: null,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [state.token]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const adminData = localStorage.getItem('admin');

    if (token && (userData || adminData)) {
      try {
        const user = userData ? JSON.parse(userData) : null;
        const admin = adminData ? JSON.parse(adminData) : null;
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { token, user, admin }
        });
      } catch (error) {
        logout();
      }
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login = (token, user = null, admin = null) => {
    localStorage.setItem('token', token);
    
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    if (admin) {
      localStorage.setItem('admin', JSON.stringify(admin));
    }

    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: { token, user, admin }
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
    
    dispatch({ type: 'LOGOUT' });
  };

  const value = {
    ...state,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};