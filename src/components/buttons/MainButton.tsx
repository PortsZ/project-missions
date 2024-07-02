'use client';
import React from "react";
import { motion } from "framer-motion";

const MainButton = ({ onClick, children }: any) => {
  return (
    <motion.button onClick={onClick}
    className="bg-contrast text-white px-4 py-2 rounded-lg font-text text-xl font-light"
    >{children}</motion.button>
  );
};

export default MainButton;
