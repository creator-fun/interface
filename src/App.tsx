import useRouterElements from './useRouterElements';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function App() {
    const routeElements = useRouterElements();
    return <div>{routeElements}</div>;
}

export default App;
