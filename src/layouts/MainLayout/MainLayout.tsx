import { Outlet } from 'react-router-dom';
import HeaderMainLayout from '../components/HeaderMainLayout/HeaderMainLayout';
import { useLocation } from 'react-router-dom';

const MainLayout = () => {
    const isMainLayout = useLocation().pathname === '/';
    return (
        <main>
            <div className={`${!isMainLayout ? 'pb-[68px]' : ''}`}>
                <Outlet />
            </div>
            <HeaderMainLayout />
        </main>
    );
};

export default MainLayout;
