import { useTheme } from "@/hooks/useTheme";
import { motion } from 'framer-motion';
import React from 'react';

interface PhoneMockupProps {
  image: string;
}

const PhoneMockup: React.FC<PhoneMockupProps> = ({ image }) => {
  const colors = useTheme();

  return (
    <div
      style={{ backgroundColor: colors.surface, borderColor: colors.tertiary }}
      className="mx-auto w-[300px] h-[600px] rounded-[40px] shadow-2xl border-4 overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-full p-4">
        <div
          style={{ backgroundColor: colors.background }}
          className="w-full h-full rounded-[30px] overflow-hidden"
        >
          <motion.img
            src={image}
            alt="feature image"
            className="w-full h-full object-cover"
            initial={{ scale: 1.2 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>
    </div>
  );
};

export default PhoneMockup;
