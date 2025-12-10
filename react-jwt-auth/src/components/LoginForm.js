import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useAuth';

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      username: "Nguyễn Nhật Duy"
  }
});
  const navigate = useNavigate();
  const { mutate: login, isLoading, error, isSuccess, data } = useLogin();


  // Redirect khi login thành công
  useEffect(() => {
    if (isSuccess && data) {
      navigate('/dashboard'); //chuyển hướng quay về trang dashboard nếu đăng nhập thành công
    }
  }, [isSuccess, data, navigate]);

  const onSubmit = (formData) => {
    console.log('Form submitted:', formData);
    login(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="login-form">
      
      <div className="form-group">
        <label>Username</label>
        <input type="text"
        placeholder='Nhập vào tên người dùng'
        {...register("username", {
            required: "Username is required",
          })}
        />
        {errors.username && <span className="error">{errors.username.message}</span>}
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          placeholder='Nhập vào email'
          defaultValue="test@example.com" 
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
        />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          placeholder='Nhập vào mật khẩu'
          defaultValue="password123" // Thêm default value để test
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters'
            }
          })}
        />
        {errors.password && (
          <span className="error">{errors.password.message}</span>
        )}
      </div>

      {error && (
        <div className="error-message">
          {error.response?.data?.message || 'Login failed'}
        </div>
      )}

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>

      <div className="test-credentials">
        <p>Test Credentials:</p>
        <p>Email: test@example.com</p>
        <p>Password: password123</p>
      </div>
    </form>
  );
};

export default LoginForm;