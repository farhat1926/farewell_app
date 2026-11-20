import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SplashScreen from './components/SplashScreen';
import EnvelopeIntro from './components/EnvelopeIntro';
import Decorations from './components/Decorations';
import Hero from './components/Hero';
import EventDetails from './components/EventDetails';
import Countdown from './components/Countdown';
import RSVP from './components/RSVP';
import Footer from './components/Footer';
import DashboardNav from './components/DashboardNav';
import UfoFollower from './components/UfoFollower';

export default function App() {
  const [stage, setStage] = useState('splash');
  const enter = useCallback(() => setStage('envelope'), []);
  const finish = useCallback(() => setStage('dashboard'), []);
  return <div className="experience premium-experience">
    <AnimatePresence mode="wait">
      {stage === 'splash' && <SplashScreen key="splash" onComplete={enter}/>}

      {stage === 'envelope' && <EnvelopeIntro key="envelope" onComplete={finish}/>}
      {stage === 'dashboard' && <motion.div key="dashboard" className="dashboard-shell" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.45}}>
        <Decorations variant="dashboard"/>
        <UfoFollower/><div className="app"><DashboardNav/><main><Hero/><EventDetails/><Countdown/><RSVP/></main><Footer/></div>
      </motion.div>}
    </AnimatePresence>
  </div>;
}
