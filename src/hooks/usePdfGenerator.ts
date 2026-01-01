import { jsPDF } from 'jspdf';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { Customer, PageSize, PAGE_SIZES, CNIC_SIZE } from '@/types/customer';

const LAYOUT = {
  MARGIN: 10,
  SPACING: 10,
  COLUMNS: 2,
};

export const usePdfGenerator = () => {
  const calculateLayout = (pageConfig: typeof PAGE_SIZES.A4) => {
    const cnicSize = CNIC_SIZE.SIZE;
    const { COLUMNS, MARGIN, SPACING } = LAYOUT;

    const totalWidth = cnicSize.width * COLUMNS + SPACING * (COLUMNS - 1);
    const xMargin = (pageConfig.width - totalWidth) / 2;
    const availableHeight = pageConfig.height - 2 * MARGIN;
    const rows = Math.floor((availableHeight + SPACING) / (cnicSize.height + SPACING));
    const perPage = COLUMNS * rows;

    return { xMargin, perPage, cnicSize };
  };

  const calculatePosition = (
    index: number,
    layout: ReturnType<typeof calculateLayout>,
    xMargin: number
  ) => {
    const { COLUMNS, MARGIN, SPACING } = LAYOUT;
    const { cnicSize } = layout;

    const row = Math.floor(index / COLUMNS);
    const col = index % COLUMNS;

    return {
      x: xMargin + col * (cnicSize.width + SPACING),
      y: MARGIN + row * (cnicSize.height + SPACING),
    };
  };

  const generatePdf = async (
    customers: Customer[],
    pageSize: PageSize
  ): Promise<{ success: boolean; blob?: Blob; error?: string }> => {
    if (customers.length === 0) {
      return { success: false, error: 'No customers added' };
    }

    try {
      const pageConfig = PAGE_SIZES[pageSize];
      const pdf = new jsPDF({
        orientation: pageConfig.orientation,
        unit: 'pt',
        format:
          pageConfig.orientation === 'landscape'
            ? [pageConfig.height, pageConfig.width]
            : [pageConfig.width, pageConfig.height],
      });

      const layout = calculateLayout(pageConfig);
      let positionIndex = 0;

      for (const customer of customers) {
        for (let copyNum = 0; copyNum < customer.copies; copyNum++) {
          // Add front image
          if (positionIndex >= layout.perPage) {
            pdf.addPage();
            positionIndex = 0;
          }
          const frontPos = calculatePosition(positionIndex, layout, layout.xMargin);
          pdf.addImage(
            customer.frontImage,
            'JPEG',
            frontPos.x,
            frontPos.y,
            layout.cnicSize.width,
            layout.cnicSize.height
          );
          positionIndex++;

          // Add back image
          if (positionIndex >= layout.perPage) {
            pdf.addPage();
            positionIndex = 0;
          }
          const backPos = calculatePosition(positionIndex, layout, layout.xMargin);
          pdf.addImage(
            customer.backImage,
            'JPEG',
            backPos.x,
            backPos.y,
            layout.cnicSize.width,
            layout.cnicSize.height
          );
          positionIndex++;
        }
      }

      // Duplicate all pages
      const totalPages = pdf.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        const pageData = pdf.internal.pages[i];
        pdf.addPage();
        pdf.internal.pages[pdf.internal.pages.length - 1] = pageData;
      }

      const blob = pdf.output('blob');
      return { success: true, blob };
    } catch (error) {
      console.error('PDF Generation Error:', error);
      return { success: false, error: (error as Error).message };
    }
  };

  const sharePdf = async (blob: Blob, filename: string = 'CNIC_Copies.pdf') => {
    try {
      if (Capacitor.isNativePlatform()) {
        // Convert blob to base64 for native sharing
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve) => {
          reader.onloadend = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
          };
          reader.readAsDataURL(blob);
        });

        // Save to filesystem first
        const savedFile = await Filesystem.writeFile({
          path: filename,
          data: base64,
          directory: Directory.Cache,
        });

        // Share the file
        await Share.share({
          title: 'CNIC Copies PDF',
          text: 'Generated CNIC copies',
          url: savedFile.uri,
          dialogTitle: 'Share PDF',
        });

        return { success: true };
      } else {
        // Web fallback - download the file
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        return { success: true };
      }
    } catch (error) {
      console.error('Share error:', error);
      return { success: false, error: (error as Error).message };
    }
  };

  return { generatePdf, sharePdf };
};
