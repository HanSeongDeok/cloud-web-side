import './App.css'
import { Route, Routes } from 'react-router-dom';
import Home from '@components/Home';
import Proto from './components/Proto';
import Layout from '@/layout';

const App = () => (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/prototype" element={<Proto />} />
    </Routes>
);

export default App;