import { motion } from 'framer-motion';
import { ArrowDown, Sparkles, UtensilsCrossed } from 'lucide-react';
import { event } from '../data/event';
export default function Hero() {
  return <header className="hero section" id="top"><motion.div initial={{opacity:0,y:45}} animate={{opacity:1,y:0}} transition={{delay:.15,duration:.9}} className="hero-inner">
    <div className="eyebrow"><span className="signal-dot"/> {event.eyebrow}</div>
    <div className="hero-orbit" aria-hidden="true"><span className="orbit-round orbit-round-a"/><span className="orbit-round orbit-round-b"/><div className="hero-core"><UtensilsCrossed size={35} strokeWidth={1.2}/></div><span className="orbit-spark">✧</span></div>
    <p className="hero-small">AN EXCLUSIVE EVENING OF MEMORIES</p>
    <h1 className="hero-title">FAREWELL <em>DINNER<span className="dot">.</span></em></h1>
    <p className="hero-quote">{event.tagline}</p>
    <div className="hero-divider"><span/><Sparkles size={13}/><span/></div>
    <p className="hero-honoree">{event.honoree}</p>
    <p className="hero-copy">{event.greeting}</p>
    <div className="hero-actions"><a className="button button-primary" href="#details">EXPLORE THE EVENT <ArrowDown size={16}/></a><a className="button button-ghost" href="#rsvp">RESERVE YOUR SEAT ↗</a></div>
    <div className="scroll-indicator">SCROLL TO DISCOVER <span>↓</span></div>
  </motion.div></header>;
}
