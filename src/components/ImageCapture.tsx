import { Camera, ImagePlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCamera } from '@/hooks/useCamera';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageCaptureProps {
  label: string;
  image: string | null;
  onImageCapture: (image: string) => void;
  onImageRemove: () => void;
}

export const ImageCapture = ({
  label,
  image,
  onImageCapture,
  onImageRemove,
}: ImageCaptureProps) => {
  const { takePicture, pickFromGallery } = useCamera();

  const handleCamera = async () => {
    const result = await takePicture();
    if (result) {
      onImageCapture(result);
    }
  };

  const handleGallery = async () => {
    const result = await pickFromGallery();
    if (result) {
      onImageCapture(result);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">{label}</label>

      <AnimatePresence mode="wait">
        {image ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-lg overflow-hidden shadow-card"
          >
            <img
              src={image}
              alt={label}
              className="w-full h-40 object-cover"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full"
              onClick={onImageRemove}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="absolute bottom-2 left-2 bg-success text-success-foreground text-xs px-2 py-1 rounded-full font-medium">
              ✓ Captured
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="buttons"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-2 gap-3"
          >
            <Button
              type="button"
              variant="outline"
              className="h-24 flex-col gap-2 border-2 border-dashed border-primary/40 hover:border-primary hover:bg-secondary transition-all"
              onClick={handleCamera}
            >
              <Camera className="h-6 w-6 text-primary" />
              <span className="text-xs font-medium">Take Photo</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-24 flex-col gap-2 border-2 border-dashed border-primary/40 hover:border-primary hover:bg-secondary transition-all"
              onClick={handleGallery}
            >
              <ImagePlus className="h-6 w-6 text-primary" />
              <span className="text-xs font-medium">From Gallery</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
