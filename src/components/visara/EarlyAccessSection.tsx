import { useTheme } from "@/hooks/useTheme";
import { motion } from 'framer-motion';
import React from 'react';

const EarlyAccessSection: React.FC = () => {
  const colors = useTheme();

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.8 }}
          style={{ color: colors.primary }}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          Get Early Access
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ color: colors.textSecondary }}
          className="max-w-2xl mx-auto text-lg mb-8"
        >
          Be the first to experience Visara. Join our mailing list for exclusive updates and a chance to be an early tester.
        </motion.p>
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row max-w-md mx-auto gap-4"
        >
          <input
            type="email"
            placeholder="Enter your email"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.text,
            }}
            className="flex-grow px-4 py-3 rounded-full border focus:outline-none focus:ring-2"
          />
          <button
            type="submit"
            style={{ backgroundColor: colors.accent, color: colors.textInverse }}
            className="px-8 py-3 font-semibold rounded-full shadow-lg hover:scale-105 transform transition-transform duration-300"
          >
            Join Waitlist
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default EarlyAccessSection;
