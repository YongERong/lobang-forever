import { BrowserRouter, Route, Routes } from 'react-router';
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import { useState } from 'react';

function App() {
  const [user, setUser] = useState(null);

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
