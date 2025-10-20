import { motion } from 'framer-motion';
import React from 'react';

const EarlyAccessSection: React.FC = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold mb-4 text-visara-light-text dark:text-visara-dark-text"
        >
          Get Early Access
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl mx-auto text-lg text-visara-light-textSecondary dark:text-visara-dark-textSecondary mb-8"
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
            className="flex-grow px-4 py-3 rounded-full bg-visara-light-background dark:bg-visara-dark-background border border-visara-light-border dark:border-visara-dark-border focus:outline-none focus:ring-2 focus:ring-visara-light-accent dark:focus:ring-visara-dark-accent text-visara-light-text dark:text-visara-dark-text"
          />
          <button
            type="submit"
            className="px-8 py-3 font-semibold text-white bg-visara-light-accent dark:bg-visara-dark-accent rounded-full shadow-lg hover:scale-105 transform transition-transform duration-300"
          >
            Join Waitlist
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default EarlyAccessSection;
