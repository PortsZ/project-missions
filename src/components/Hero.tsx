'use client';
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";


const giveVerses = [
  {
    language: "English",
    verse: (
      <div>
        <h2 className="text-balance">
          <sup>7 </sup>Each one must give as he has decided in his heart, not
          reluctantly or under compulsion, for God loves a cheerful giver.
          <sup> 8 </sup>And God is able to make all grace abound to you, so that
          having all sufficiency
        </h2>
        <p className="text-gray-700 ">2 Cocorinthians 9:7-8</p>
      </div>
    ),
  },
  {
    language: "Português",
    verse: (
      <div>
        <h2 className="text-balance">
          <sup>7 </sup>Cada um contribua segundo tiver proposto no coração, não
          com tristeza ou por necessidade, porque Deus ama quem dá com alegria.
          <sup>8 </sup>Deus pode tornar abundante em vocês toda graça, a fim de
          que, tendo sempre, em tudo, ampla suficiência, vocês sejam abundantes
          em toda boa obra,
        </h2>
        <p className="text-gray-700 ">2 Coríntios 9:7-8</p>
      </div>
    ),
  },
  {
    language: "Español",
    verse: (
      <div>
        <h2 className="text-balance">
          <sup>7 </sup>Que cada uno dé como haya propuesto en su corazón: no con
          tristeza ni por obligación, porque Dios ama a quien da con alegría.
          <sup>8 </sup>Y Dios es poderoso para hacer que abunde en vosotros toda
          gracia, a fin de que, tengáis siempre todo lo necesario, con
          abundancia para practicar toda clase de buenas obras.
        </h2>
        <p className="text-gray-700 ">2 Corintios 9:7-8</p>
      </div>
    ),
  },
  
];



const Hero = () => {
    const [index, setIndex] = useState(0);

    const { data: session } = useSession();
    
  
    useEffect(() => {
      const interval = setInterval(() => {
        setIndex((current) => (current + 1) % giveVerses.length);
      }, 20000); // Change verse every 20 seconds
  
      return () => clearInterval(interval);
    }, []);
  
    return (
      <div className="w-1/2 px-10 py-24 flex justify-center items-center ">
        <AnimatePresence mode='wait'>
          <motion.div
            key={giveVerses[index].language}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }} // Adjust the transition duration as needed
            className="text-center "
          >
            {giveVerses[index].verse}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  };
  
  export default Hero;
