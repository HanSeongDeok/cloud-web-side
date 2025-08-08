import { Route, Routes } from 'react-router-dom';
import Home from '@components/Home';
import ProtoMain from '@components/NavigateMenu';
import { SSOLoginPage } from '@components/pages/SSOLoginPage';
import ProtectedRoute from './components/ProtestedRoute';
import PermissionPage from './components/pages/PermissionPage';
import { SSOLoginVerifyPage } from './components/pages/SSOLoginVerifyPage';

const App = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<SSOLoginPage />} />
    <Route path="/permission" element={<PermissionPage />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/storage" element={<ProtoMain />} />
    </Route>
    <Route path="/login-verify" element={<SSOLoginVerifyPage />} />
  </Routes>
);

export default App;