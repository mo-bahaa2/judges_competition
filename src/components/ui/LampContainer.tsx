import React from "react";
import { motion } from "framer-motion";

export const LampContainer = ({
  children,
  className
}: { children: React.ReactNode; className?: string }) => {
  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden w-full z-0 pt-24 pb-12 ${className || ''}`}
    >
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0">
        <motion.div
          initial={{ opacity: 0.5, width: "10rem" }}
          animate={{ opacity: 1, width: "20rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{
            backgroundImage: `conic-gradient(from 70deg at center top, var(--color-brand) 0deg, transparent 60deg, transparent 360deg)`,
          }}
          className="absolute inset-auto right-1/2 h-56 overflow-visible w-[20rem] opacity-40"
        >
          <div className="absolute w-[100%] left-0 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" style={{ backgroundColor: 'var(--color-bg-base)' }} />
          <div className="absolute w-40 h-[100%] left-0 bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" style={{ backgroundColor: 'var(--color-bg-base)' }} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0.5, width: "10rem" }}
          animate={{ opacity: 1, width: "20rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{
            backgroundImage: `conic-gradient(from 290deg at center top, transparent 0deg, transparent 300deg, var(--color-brand) 360deg)`,
          }}
          className="absolute inset-auto left-1/2 h-56 w-[20rem] opacity-40"
        >
          <div className="absolute w-40 h-[100%] right-0 bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" style={{ backgroundColor: 'var(--color-bg-base)' }} />
          <div className="absolute w-[100%] right-0 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" style={{ backgroundColor: 'var(--color-bg-base)' }} />
        </motion.div>
        
        <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 blur-2xl" style={{ backgroundColor: 'var(--color-bg-base)' }}></div>
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md"></div>
        <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: 'var(--color-brand)' }}></div>
        
        <motion.div
          initial={{ width: "8rem" }}
          animate={{ width: "16rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full opacity-30 blur-2xl"
          style={{ backgroundColor: 'var(--color-brand)' }}
        ></motion.div>
        
        <motion.div
          initial={{ width: "15rem" }}
          animate={{ width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-50 h-0.5 -translate-y-[7rem] opacity-60"
          style={{ backgroundColor: 'var(--color-brand)' }}
        ></motion.div>

        <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem]" style={{ backgroundColor: 'var(--color-bg-base)' }}></div>
      </div>
      
      <div className="relative z-50 flex -translate-y-24 flex-col items-center px-5 w-full">
        {children}
      </div>
    </div>
  );
};
