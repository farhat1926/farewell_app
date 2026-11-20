import { motion } from 'framer-motion';
export default function Reveal({children,className=''}){return <motion.div className={className} initial={{opacity:0,y:36}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.12}} transition={{duration:.7,ease:[.21,1,.21,1]}}>{children}</motion.div>}
