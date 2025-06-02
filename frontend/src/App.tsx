import './App.css'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import LoginPage from './pages/loginpage';
import RegisterPage from './pages/registerpage';
import ChatsListPage from './pages/chatlistpage';
import ChatPageWrapper from './pages/chatpagewrapper';

const BASE = import.meta.env.VITE_BASE_PATH;

const router = createBrowserRouter(
  [
    {
      path: '/',
      children:
      [
        {
          index: true,
          element: <Navigate to={BASE} replace/>,
        },
        {
          path: BASE,
          children:
          [
            {
              index: true,
              element: <Navigate to={`${BASE}/home`} replace/>,
            },
            {
              path: 'home',
              element: <Navigate to={`${BASE}/login`} replace/>
            },
            {
              path: 'login',
              element: <LoginPage />
            },
            {
              path: 'register',
              element: <RegisterPage />
            },
            {
              path: 'chats',
              children: [
                {
                  index: true,
                  element: <ChatsListPage />
                },
                {
                  path: ':chatId',
                  element: <ChatPageWrapper />
                }
              ]
            },
          ]
        }
      ]
    }
  ]
)

const App = () => <RouterProvider router={router}/>;

export default App;