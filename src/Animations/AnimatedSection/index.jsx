import { motion } from 'framer-motion';

const AnimatedSection = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{
        scale: { duration: 0.3, ease: 'easeOut' },
        opacity: { duration: 0.8, ease: 'easeInOut' },
      }}
      viewport={{ once: false, amount: 0.2 }} 
      className="transition-transform"
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;