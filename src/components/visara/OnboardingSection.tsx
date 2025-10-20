import { motion } from 'framer-motion';
import React from 'react';

const onboardingSteps = [
  {
    title: "Welcome to Visara",
    description: "Intelligent photo organization powered by AI.",
  },
  {
    title: "Privacy First",
    description: "All processing happens locally on your device. No cloud uploads.",
  },
  {
    title: "Local Processing",
    description: "AI models work directly on your device for speed and privacy.",
  },
  {
    title: "Grant Permission",
    description: "We need access to your storage to organize your photos.",
  },
];

const OnboardingSection: React.FC = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-visara-light-text dark:text-visara-dark-text">A Seamless Start</h2>
        <div className="flex overflow-x-auto space-x-8 pb-8">
          {onboardingSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="flex-shrink-0 w-72 bg-visara-light-background dark:bg-visara-dark-background p-8 rounded-lg shadow-lg"
            >
              <div className="text-2xl font-bold mb-4 text-visara-light-accent dark:text-visara-dark-accent">{`0${index + 1}`}</div>
              <h3 className="text-xl font-bold mb-2 text-visara-light-text dark:text-visara-dark-text">{step.title}</h3>
              <p className="text-visara-light-textSecondary dark:text-visara-dark-textSecondary">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OnboardingSection;
