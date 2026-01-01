import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface StatsCardProps {
  icon: LucideIcon;
  value: number;
  label: string;
  delay?: number;
}

export const StatsCard = ({ icon: Icon, value, label, delay = 0 }: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="p-4 shadow-card text-center">
        <div className="w-10 h-10 rounded-full bg-secondary mx-auto mb-2 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="text-3xl font-bold text-primary">{value}</div>
        <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
          {label}
        </div>
      </Card>
    </motion.div>
  );
};
