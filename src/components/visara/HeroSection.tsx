import { useTheme } from "@/hooks/useTheme";
import { motion } from 'framer-motion';
import React from 'react';

const AnimatedShapes = () => {
  const shapes = Array.from({ length: 5 });
  const colors = useTheme();
  return (
    <div className="absolute inset-0 overflow-hidden">
      {shapes.map((_, i) => (
        <motion.div
          key={i}
          style={{ backgroundColor: colors.accent + '10' }}
          className="absolute rounded-full"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
          style={{
            width: Math.random() * 150 + 50,
            height: Math.random() * 150 + 50,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            backgroundColor: colors.accent + '10',
          }}
        />
      ))}
    </div>
  );
};

const HeroSection: React.FC = () => {
  const colors = useTheme();

  return (
    <section className="relative flex flex-col items-center justify-center w-full h-screen overflow-hidden">
      <div
        style={{
          background: `linear-gradient(to bottom, ${colors.background}, ${colors.surface})`,
        }}
        className="absolute inset-0"
      />
      <AnimatedShapes />
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <motion.img
          src="/visara_resorces/visara launcher - 3d/visara-icon.png"
          alt="Visara Logo"
          className="w-40 h-40 mb-8"
          initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0, 0.71, 0.2, 1.01] }}
        />
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{ color: colors.primary }}
          className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4"
        >
          Meet Visara
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          style={{ color: colors.textSecondary }}
          className="max-w-2xl mx-auto text-lg md:text-xl mb-8"
        >
          The intelligent gallery that understands your photos as well as you do. Search, organize, and relive your moments—all with absolute privacy.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <button
            style={{ backgroundColor: colors.accent, color: colors.textInverse }}
            className="px-8 py-3 font-semibold rounded-full shadow-lg hover:scale-105 transform transition-transform duration-300"
          >
            Join Early Access
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
