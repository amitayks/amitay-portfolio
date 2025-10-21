import { useTheme } from "@/hooks/useTheme";
import { motion } from 'framer-motion';
import React from 'react';
import PhoneMockup from './PhoneMockup';

const features = [
  {
    title: "AI-Powered Search",
    description: "Search for anything in your photos. Visara understands objects, text, and scenes. Find that photo of the 'sunset over the mountains' instantly.",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=2574&auto=format&fit=crop",
  },
  {
    title: "Automatic Organization",
    description: "Visara automatically groups your photos by date, creating a beautiful, scrollable timeline of your life's moments.",
    image: "https://images.unsplash.com/photo-1548681528-6a5c45b66b42?q=80&w=2574&auto=format&fit=crop",
  },
  {
    title: "Document & Text Recognition",
    description: "Find receipts, notes, or any document just by searching for the text within them. Visara's OCR makes everything searchable.",
    image: "https://images.unsplash.com/photo-1583207138328-ac00a9eea2a7?q=80&w=2574&auto=format&fit=crop",
  },
  {
    title: "Intelligent Albums",
    description: "Visara automatically creates albums for you based on content, like 'Receipts & Bills', 'Screenshots', and 'Handwritten Notes'.",
    image: "https://images.unsplash.com/photo-1504454217853-4a350913a533?q=80&w=2574&auto=format&fit=crop",
  },
];

const FeaturesSection: React.FC = () => {
  const colors = useTheme();

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {features.map((feature, index) => (
          <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24 last:mb-0">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8 }}
              className={`lg:order-${index % 2 === 0 ? 1 : 2}`}>
              <h3 style={{ color: colors.primary }} className="text-3xl font-bold mb-4">{feature.title}</h3>
              <p style={{ color: colors.textSecondary }} className="text-lg">{feature.description}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8 }}
              className={`lg:order-${index % 2 === 0 ? 2 : 1}`}>
              <PhoneMockup image={feature.image} />
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
