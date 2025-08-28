import { BrowserRouter, Route, Routes } from 'react-router';
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import { useState } from 'react';
import type { User } from './types/index.ts';

function App() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login setUser={setUser}/>}/>
        <Route path="/home" element={<Home user={user}/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
