import { Trash2, Copy, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Customer } from '@/types/customer';
import { motion } from 'framer-motion';

interface CustomerCardProps {
  customer: Customer;
  onRemove: (id: number) => void;
  index: number;
}

export const CustomerCard = ({ customer, onRemove, index }: CustomerCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="p-4 shadow-card hover:shadow-elevated transition-shadow">
        <div className="flex items-center gap-4">
          {/* Customer Avatar */}
          <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
            <User className="h-6 w-6 text-primary-foreground" />
          </div>

          {/* Customer Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {customer.name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Copy className="h-3.5 w-3.5" />
              <span>
                {customer.copies} {customer.copies === 1 ? 'copy' : 'copies'}
              </span>
            </div>
          </div>

          {/* Preview Thumbnails */}
          <div className="flex gap-1.5 flex-shrink-0">
            <img
              src={customer.frontImage}
              alt="Front"
              className="w-10 h-7 object-cover rounded border border-border"
            />
            <img
              src={customer.backImage}
              alt="Back"
              className="w-10 h-7 object-cover rounded border border-border"
            />
          </div>

          {/* Remove Button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
            onClick={() => onRemove(customer.id)}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
