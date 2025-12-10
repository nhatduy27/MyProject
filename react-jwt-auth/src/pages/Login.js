import React from 'react';
import LoginForm from '../components/LoginForm';

const Login = () => {

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Login</h1>
        <p>Please sign in to continue</p>
        
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;