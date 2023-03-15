import { useState } from 'preact/hooks';

import Header from './layout/header';
import Menu from './layout/menu';
import Sites from './pages/sites/sites';
import '../../assets/styles/main.scss';

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
        <Sites />
      </main>
    </>
  );
}
