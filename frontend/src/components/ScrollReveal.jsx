import { motion, useReducedMotion } from 'framer-motion';

const offsets = {
  up: { y: 35 }, down: { y: -35 },
  left: { x: -35 }, right: { x: 35 },
  zoom: { scale: 0.96 }, fade: {}
};

export default function ScrollReveal({
  children, className = '', delay = 0, direction = 'up', duration = 0.85, once = false
}) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div className={className}
      initial={{ opacity: 0, ...(offsets[direction] || offsets.up) }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once, amount: 0.1 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}