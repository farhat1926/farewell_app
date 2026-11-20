import { CalendarDays, Clock3, MapPin, Shirt, ExternalLink, ArrowUpRight } from 'lucide-react';
import { event } from '../data/event';
import Reveal from './Reveal';
const details = [
  {Icon: CalendarDays, index:'01', label:'DATE', content: event.dateLabel},
  {Icon: Clock3, index:'02', label:'TIME', content: event.timeLabel},
  {Icon: MapPin, index:'03', label:'LOCATION', content: event.place, caption:event.address},
  {Icon: Shirt, index:'04', label:'DRESS CODE', content: event.dressCode},
];
export default function EventDetails() {return <section className="section details" id="details"><Reveal><p className="eyebrow">// THE EVENT DETAILS</p><h2 className="section-title">THE <em>RENDEZVOUS.</em></h2><p className="section-lead">Satu meja, banyak cerita, dan kenangan yang akan selalu dibawa pulang.</p></Reveal><div className="detail-grid">{details.map(({Icon,index,label,content,caption})=><Reveal key={label} className="detail-card"><div className="detail-header"><span>{index} / INFORMATION</span><ArrowUpRight size={17}/></div><div className="detail-icon"><Icon size={29} strokeWidth={1.4}/></div><p className="detail-label">{label}</p><h3>{content}</h3>{caption && <p className="detail-caption">{caption}</p>}</Reveal>)}</div>{event.mapUrl?<a className="button button-ghost maps-button" href={event.mapUrl} target="_blank" rel="noopener noreferrer"><MapPin size={17}/> OPEN GOOGLE MAPS <ExternalLink size={15}/></a>:<p className="configure-hint">Link lokasi dapat diatur di <code>src/data/event.js</code></p>}</section>}
