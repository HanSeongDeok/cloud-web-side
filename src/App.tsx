import { Route, Routes } from 'react-router-dom';
import Home from '@components/Home';
import ProtoMain from '@components/NavigateMenu';

const App = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/prototype" element={<ProtoMain />} />
  </Routes>
);

export default App;