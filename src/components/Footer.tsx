import { Phone } from 'lucide-react';
import { motion } from 'framer-motion';

export const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="py-6 text-center text-sm text-muted-foreground"
    >
      <div className="flex items-center justify-center gap-2">
        <span>© Developed by Asad Bukhari</span>
        <span className="text-border">|</span>
        <a
          href="tel:+923491590380"
          className="inline-flex items-center gap-1 text-primary hover:underline"
        >
          <Phone className="h-3.5 w-3.5" />
          +92 3491590380
        </a>
      </div>
    </motion.footer>
  );
};
