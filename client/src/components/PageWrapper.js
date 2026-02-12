import React from "react";
import { motion } from "framer-motion";

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{ width: "100%", height: "100%", position: "absolute" }}
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;
