import { BrowserRouter, Route, Routes } from 'react-router';
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import { useState, useEffect } from 'react';
import type { User } from './types/index.ts';
import TextSpinner from './components/TextSpinner.tsx';

// async font loader to avoid blocking initial render
const loadFonts = () => {
  if ('requestIdleCallback' in window) {
    // @ts-ignore
    requestIdleCallback(() => {
      import('@fontsource/roboto/400.css');
      import('@fontsource/poppins/400.css');
    });
  } else {
    setTimeout(() => {
      import('@fontsource/roboto/400.css');
      import('@fontsource/poppins/400.css');
    }, 2000);
  }
};

loadFonts();

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on app initialization
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save user to localStorage whenever user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Show loading spinner while checking for saved user
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <TextSpinner text={"Loading..."} />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login user={user} setUser={setUser} />} />
        <Route path="/home" element={<Home user={user} setUser={setUser} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
