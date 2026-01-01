export interface Customer {
  id: number;
  name: string;
  copies: number;
  frontImage: string;
  backImage: string;
}

export type PageSize = 'A4' | 'A5';

export interface PageConfig {
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
}

export const PAGE_SIZES: Record<PageSize, PageConfig> = {
  A4: { width: 595, height: 842, orientation: 'portrait' },
  A5: { width: 595, height: 420, orientation: 'landscape' },
};

export const CNIC_SIZE = {
  MM: { width: 99.5, height: 68 },
  get SIZE() {
    return {
      width: this.MM.width * 2.83465,
      height: this.MM.height * 2.83465,
    };
  },
};
