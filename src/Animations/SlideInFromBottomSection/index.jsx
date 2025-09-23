import { motion } from 'framer-motion';

const SlideInFromBottomSection = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}       
      whileInView={{ opacity: 1, y: 0 }}   
      exit={{ opacity: 0, y: 100 }}         
      transition={{
        y: { duration: 0.5, ease: "easeOut" },
        opacity: { duration: 1.2, ease: "easeInOut" }
      }}
      viewport={{ once: false }}
    >
      {children}
    </motion.div>
  );
};

export default SlideInFromBottomSection;