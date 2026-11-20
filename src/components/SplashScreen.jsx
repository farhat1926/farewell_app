import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Orbit, Sparkles } from 'lucide-react';
export default function SplashScreen({onComplete}) {
  useEffect(() => { const id = window.setTimeout(onComplete, 2350); return () => clearTimeout(id); }, [onComplete]);
  return <motion.section className="splash-screen screen-overlay" initial={{opacity:1}} exit={{opacity:0,transition:{duration:.6}}} aria-label="Memuat undangan digital">
    <div className="splash-orbit splash-orbit-one"/><div className="splash-orbit splash-orbit-two"/>
    <motion.div className="splash-emblem" animate={{rotate:360}} transition={{duration:9,repeat:Infinity,ease:'linear'}}><Orbit size={52} strokeWidth={1}/></motion.div>
    <motion.p className="splash-kicker" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:.2}}>INITIALIZING YOUR INVITATION</motion.p>
    <motion.h1 initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} transition={{delay:.35,duration:.8}}>A NIGHT <span>TO REMEMBER</span></motion.h1>
    <div className="loading-track"><motion.span initial={{scaleX:0}} animate={{scaleX:1}} transition={{duration:1.8,ease:'easeInOut'}}/></div>
    <div className="splash-foot"><Sparkles size={13}/> FAREWELL DINNER EXPERIENCE <Sparkles size={13}/></div>
  </motion.section>;
}
