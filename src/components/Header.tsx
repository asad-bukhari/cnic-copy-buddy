import { CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

export const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="gradient-header text-primary-foreground py-6 px-4 shadow-elevated"
    >
      <div className="container max-w-lg mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <CreditCard className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold">CNIC Copy Generator</h1>
        </div>
        <p className="text-sm text-primary-foreground/80">
          Developed by Asad Bukhari
        </p>
      </div>
    </motion.header>
  );
};
