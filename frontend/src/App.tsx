import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Todo from './pages/Todo';
import RequestPasswordReset from './pages/RequestPasswordReset';
import ResetPassword from './pages/ResetPassword';

const App = () => (
  <>
    {/* Configura ToastContainer */}
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/todos" element={<Todo />} />
      <Route path="/request-password-reset" element={<RequestPasswordReset />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  </>
);

export default App;