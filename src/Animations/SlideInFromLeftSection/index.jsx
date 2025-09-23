import { motion } from 'framer-motion';

const SlideInFromLeftSection = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      whileInView={{ opacity: 1, x: 0 }}
      whileExit={{ opacity: 0, x: -100 }}  
      transition={{
        x: { duration: 0.5, ease: "easeOut" },
        opacity: { duration: 1.2, ease: "easeInOut" }
      }}
      viewport={{ once: false }} 
    >
      {children}
    </motion.div>
  );
};

export default SlideInFromLeftSection;