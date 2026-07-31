import { Outlet } from 'react-router-dom';


const MainLayout = () => (
  <div style={{ display: 'flex' }}>
    <main style={{ flexGrow: 1, padding: '20px' }}>
      <Outlet />
    </main>
  </div>
);

export default MainLayout;