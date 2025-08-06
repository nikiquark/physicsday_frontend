import { motion } from "framer-motion";


export const FlyingCats = () => {
  return (
    <div className="hidden lg:block absolute inset-0 pointer-events-none z-10 overflow-hidden">
      <motion.div
        className="absolute w-32 h-32"
        initial={{ x: -200, y: 0 }}
        animate={{ x: 50 }}
        transition={{ duration: 2, delay: 1, ease: "easeOut" }}
        style={{ left: 0, top: '20%', transform: 'translateY(-50%)' }}
      >
        <motion.img
          src="/cat.png"
          alt="Cat"
          className="w-full h-full object-contain"
          animate={{ 
            y: [0, -10, 0],
            rotate: [-5, 5, -5]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
      
      <motion.div
        className="absolute w-32 h-32"
        initial={{ x: 200, y: 0 }}
        animate={{ x: -50 }}
        transition={{ duration: 2, delay: 2, ease: "easeOut" }}
        style={{ right: 0, top: '80%', transform: 'translateY(-50%)' }}
      >
        <motion.img
          src="/cat2.png"
          alt="Cat 2"
          className="w-full h-full object-contain"
          animate={{ 
            y: [0, -15, 0],
            rotate: [5, -5, 5]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </div>
  );
};