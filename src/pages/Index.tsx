import { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageSizeSelector } from '@/components/PageSizeSelector';
import { CustomerForm } from '@/components/CustomerForm';
import { CustomerList } from '@/components/CustomerList';
import { Customer, PageSize } from '@/types/customer';
import { usePdfGenerator } from '@/hooks/usePdfGenerator';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Index = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>('A4');
  const [customerCounter, setCustomerCounter] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  
  const { generatePdf, sharePdf } = usePdfGenerator();
  const { toast } = useToast();

  const handleAddCustomer = useCallback(
    (customer: Omit<Customer, 'id'>) => {
      const newId = customerCounter + 1;
      setCustomerCounter(newId);
      setCustomers((prev) => [...prev, { ...customer, id: newId }]);
    },
    [customerCounter]
  );

  const handleRemoveCustomer = useCallback((id: number) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const handleResetAll = useCallback(() => {
    setShowResetDialog(true);
  }, []);

  const confirmReset = useCallback(() => {
    setCustomers([]);
    setCustomerCounter(0);
    setShowResetDialog(false);
    toast({
      title: 'Reset Complete',
      description: 'All customer data has been cleared',
    });
  }, [toast]);

  const handleGeneratePdf = useCallback(async () => {
    if (customers.length === 0) {
      toast({
        title: 'No Customers',
        description: 'Please add at least one customer before generating PDF',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);

    try {
      const result = await generatePdf(customers, pageSize);

      if (result.success && result.blob) {
        const shareResult = await sharePdf(result.blob);

        if (shareResult.success) {
          toast({
            title: 'PDF Generated!',
            description: 'Your PDF has been created and is ready to share',
          });
        } else {
          toast({
            title: 'Share Failed',
            description: shareResult.error || 'Could not share the PDF',
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Generation Failed',
          description: result.error || 'Could not generate PDF',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  }, [customers, pageSize, generatePdf, sharePdf, toast]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container max-w-lg mx-auto py-6 px-4 space-y-6">
        <PageSizeSelector value={pageSize} onChange={setPageSize} />
        
        <CustomerForm
          onAddCustomer={handleAddCustomer}
          customerCount={customerCounter}
        />

        <CustomerList
          customers={customers}
          onRemoveCustomer={handleRemoveCustomer}
          onGeneratePdf={handleGeneratePdf}
          onResetAll={handleResetAll}
          isGenerating={isGenerating}
        />
      </main>

      <Footer />

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset All Data?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all customers and their CNIC images. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmReset}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Reset All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
