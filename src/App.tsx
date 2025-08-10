import useRouterElements from './useRouterElements';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Toaster } from '@/components/ui/sonner';
gsap.registerPlugin(ScrollTrigger);

function App() {
    const routeElements = useRouterElements();
    return (
        <div>
            {routeElements}
            <Toaster position="top-right" />
        </div>
    );
}

export default App;
