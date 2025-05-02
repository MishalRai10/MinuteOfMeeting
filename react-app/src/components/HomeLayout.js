import { Outlet } from 'react-router-dom';
import Dashboard from './Dashboard';
import Features from './Features';
import CustomerReviews from './CustomerReviews';

const HomeLayout = () => {
  return (
    <div className="relative">
      <Dashboard />
      <Features/>
      <CustomerReviews/>
      <Outlet />
    </div>
  );
};

export default HomeLayout;