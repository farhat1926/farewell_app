import { Orbit, ArrowUpRight } from 'lucide-react';
export default function DashboardNav(){
 return <nav className="premium-nav" aria-label="Navigasi undangan"><a href="#top" className="premium-brand"><Orbit size={24} strokeWidth={1.5}/><span>FAREWELL<small>THE EXPERIENCE</small></span></a><div className="premium-nav-links"><a href="#details">The evening</a><a href="#guestbook">Guest list</a><a className="premium-nav-rsvp" href="#rsvp">RSVP <ArrowUpRight size={14}/></a></div></nav>;
}
