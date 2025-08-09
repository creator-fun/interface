import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import path from './constants/path';
import Test from './pages/Test/Test';

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
                    path: path.home,
                    element: (
                        <Suspense>
                            <Home />
                        </Suspense>
                    ),
                },
            ],
        },
        {
            path: '/test',
            element: (
                <Suspense>
                    <Test />
                </Suspense>
            ),
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
