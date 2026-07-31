import { Outlet } from 'react-router-dom';
import '@/index.css';
// import Sidebar from './Sidebar';


const DashboardLayout = () => {

  return (
   
  
    <div style={{ display: 'flex' }}>
      {/* <Sidebar />  */}
      <main style={{ flexGrow: 1, padding: '20px' }}>
        <Outlet />
      </main>

    </div>
  )
    

} 

export default DashboardLayout;