import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { Provider } from 'react-redux';
import ChatApp from './ChatApp';
import store from './store';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/chat",
    element: <ChatApp />
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);