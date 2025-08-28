import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import path from './constants/path';
import Create from './pages/Create/Create';
import MainLayout from './layouts/MainLayout/MainLayout';
import LivestreamHome from './pages/LivestreamHome/LivestreamHome';
import HostLive from './pages/HostLive/HostLive';
import WatchLive from './pages/WatchLive/WatchLive';
import Profile from './pages/Profile/Profile';

const Home = lazy(() => import('./pages/Home/Home'));

function ProtectedRoute() {
    // const profile = useSetProfile((state) => state.profile);
    return true ? <Outlet /> : <Navigate to={'/login'} />;
}
// function RejectedRoute() {
//     // const profile = useSetProfile((state) => state.profile);

//     return !true ? <Outlet /> : <Navigate to={'/'} />;
// }

const useRouterElements = () => {
    const routeElements = useRoutes([
        {
            path: '',
            element: <ProtectedRoute />,
            children: [
                {
                    path: '',
                    element: <MainLayout />,
                    children: [
                        {
                            path: path.home,
                            element: <Home />,
                        },
                        {
                            path: path.create,
                            element: (
                                <Suspense>
                                    <Create />
                                </Suspense>
                            ),
                        },
                        {
                            path: path.profile,
                            element: (
                                <Suspense>
                                    <Profile />
                                </Suspense>
                            ),
                        },
                    ],
                },
                {
                    path: path.livestreamHome,
                    element: (
                        <Suspense>
                            <LivestreamHome />
                        </Suspense>
                    ),
                }, {
                    path: path.hostLive,
                    element: (
                        <Suspense>
                            <HostLive />
                        </Suspense>
                    ),
                }, {
                    path: path.watchLive,
                    element: (
                        <Suspense>
                            <WatchLive />
                        </Suspense>
                    ),
                },
            ],
        },

        // {
        //     path: '',
        //     element: <RejectedRoute />,
        //     children: [
        //         {
        //             path: path.signUp,
        //             element: (
        //                 <Suspense>
        //                     <Signup />
        //                 </Suspense>
        //             ),
        //         },
        //         {
        //             path: path.login,
        //             element: (
        //                 <Suspense>
        //                     <Login />
        //                 </Suspense>
        //             ),
        //         },
        //     ],
        // },
        // {
        //     path: '*',
        //     element: (
        //         <Suspense>
        //             <NotFoundPage />
        //         </Suspense>
        //     ),
        // },
    ]);

    return routeElements;
};

export default useRouterElements;
