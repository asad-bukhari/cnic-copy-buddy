import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageCapture } from './ImageCapture';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface CustomerFormProps {
  onAddCustomer: (customer: {
    name: string;
    copies: number;
    frontImage: string;
    backImage: string;
  }) => void;
  customerCount: number;
}

export const CustomerForm = ({ onAddCustomer, customerCount }: CustomerFormProps) => {
  const [name, setName] = useState('');
  const [copies, setCopies] = useState(1);
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!frontImage || !backImage) {
      toast({
        title: 'Missing Images',
        description: 'Please capture both front and back CNIC images',
        variant: 'destructive',
      });
      return;
    }

    const customerName = name.trim() || `Customer ${customerCount + 1}`;

    onAddCustomer({
      name: customerName,
      copies,
      frontImage,
      backImage,
    });

    // Reset form
    setName('');
    setCopies(1);
    setFrontImage(null);
    setBackImage(null);

    toast({
      title: 'Customer Added',
      description: `${customerName} added successfully!`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserPlus className="h-5 w-5 text-primary" />
            Add Customer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Customer Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Customer Name (Optional)</Label>
              <Input
                id="name"
                placeholder="Enter customer name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Number of Copies */}
            <div className="space-y-2">
              <Label htmlFor="copies">Number of Copies</Label>
              <Input
                id="copies"
                type="number"
                min={1}
                max={10}
                value={copies}
                onChange={(e) => setCopies(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
              />
            </div>

            {/* CNIC Front Image */}
            <ImageCapture
              label="CNIC Front Image"
              image={frontImage}
              onImageCapture={setFrontImage}
              onImageRemove={() => setFrontImage(null)}
            />

            {/* CNIC Back Image */}
            <ImageCapture
              label="CNIC Back Image"
              image={backImage}
              onImageCapture={setBackImage}
              onImageRemove={() => setBackImage(null)}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full gradient-primary text-primary-foreground shadow-button hover:opacity-90 transition-opacity"
              size="lg"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Add Customer
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
