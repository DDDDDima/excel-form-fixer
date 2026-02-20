// Product catalog aligned with the directory (Довідник)
export interface Product {
  id: string;
  name: string;
  category: string;
  unit: string;
  criticalLevel: number;
  currentStock: number;
  price?: number;
}

export type Category = string;

// Initial product catalog (to be synced with 'Довідник' tab)
export const initialProducts: Product[] = [];


export interface Transaction {
  id: string;
  date: Date;
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  type: "Прихід" | "Продаж" | "Списання";
  pricePerUnit?: number;
  total?: number;
}
