import { useState } from 'preact/hooks';
import { Routes, Route } from 'react-router-dom';

import Header from './layout/header';
import Menu from './layout/menu';
import Sites from './pages/sites/sites';
import BackupTool from './pages/backup/backupTool';
import '../../assets/styles/main.scss';
import Plugins from './pages/ext/plugins/plugins';

export function App() {
  const [isSidenavShown, setSidenavShown] = useState(false);

  const handleToggleSidebar = () => {
    setSidenavShown(!isSidenavShown);
  };

  return (
    <>
      <Header toggleSidebar={handleToggleSidebar} />
      <Menu showMenu={isSidenavShown} />
      <main className="main">
        <Routes>
          <Route path="/" element={<Sites />} />
          <Route path="/plugins" element={<Plugins />} />
          <Route path="/backup" element={<BackupTool />} />
        </Routes>
      </main>
    </>
  );
}
