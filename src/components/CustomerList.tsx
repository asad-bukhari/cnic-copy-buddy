import { Users, Copy, FileDown, RotateCcw, Share2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomerCard } from './CustomerCard';
import { StatsCard } from './StatsCard';
import { Customer } from '@/types/customer';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomerListProps {
  customers: Customer[];
  onRemoveCustomer: (id: number) => void;
  onGeneratePdf: () => void;
  onResetAll: () => void;
  isGenerating: boolean;
}

export const CustomerList = ({
  customers,
  onRemoveCustomer,
  onGeneratePdf,
  onResetAll,
  isGenerating,
}: CustomerListProps) => {
  const totalCopies = customers.reduce((sum, c) => sum + c.copies, 0);

  if (customers.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="space-y-4"
    >
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatsCard
          icon={Users}
          value={customers.length}
          label="Customers"
          delay={0}
        />
        <StatsCard
          icon={Copy}
          value={totalCopies}
          label="Total Copies"
          delay={0.1}
        />
      </div>

      {/* Customer List */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-primary" />
            Customer List
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <AnimatePresence mode="popLayout">
            {customers.map((customer, index) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                onRemove={onRemoveCustomer}
                index={index}
              />
            ))}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="h-12"
          onClick={onResetAll}
          disabled={isGenerating}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset All
        </Button>

        <Button
          className="h-12 gradient-primary text-primary-foreground shadow-button hover:opacity-90 transition-opacity"
          onClick={onGeneratePdf}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4 mr-2" />
              Generate & Share
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};
