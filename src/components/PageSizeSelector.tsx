import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageSize } from '@/types/customer';
import { motion } from 'framer-motion';

interface PageSizeSelectorProps {
  value: PageSize;
  onChange: (value: PageSize) => void;
}

export const PageSizeSelector = ({ value, onChange }: PageSizeSelectorProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-primary" />
            Page Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={value} onValueChange={(v) => onChange(v as PageSize)}>
            <SelectTrigger>
              <SelectValue placeholder="Select page size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A4">A4 (210mm × 297mm)</SelectItem>
              <SelectItem value="A5">A5 (148mm × 210mm)</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </motion.div>
  );
};
