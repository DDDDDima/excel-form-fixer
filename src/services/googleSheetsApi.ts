// Google Sheets API Web App URL
// IMPORTANT: Paste your deployed URL here after "Deploy > New Deployment > Web App"
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxhorDqVKJXhymTIIZ5w6pC-Evkx4Xd_53AbCmNCr9cebR9orh67W0LO_6wSlXogs4P/exec";

export interface SheetProduct {
  id: string;
  name: string;
  category: string;
  unit: string;
  criticalLevel: number;
  currentStock: number;
}

export interface SheetTransaction {
  id: string;
  date: Date;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  type: "Прихід" | "Продаж" | "Списання";
  pricePerUnit?: number;
  total?: number;
}

export interface InventoryData {
  products: SheetProduct[];
  transactions: SheetTransaction[];
}

/**
 * Fetches inventory data from Google Sheets
 * Returns products with current stock levels calculated from transactions
 */
export async function fetchInventoryFromSheets(): Promise<InventoryData> {
  try {
    const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getInventory`, {
      method: "GET",
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Parse and transform the data from Google Sheets
    const products: SheetProduct[] = (data.products || []).map((row: any, index: number) => ({
      id: row.id || `sheet-${index}`,
      name: row.name || "",
      category: row.category || "Інше",
      unit: row.unit || "шт",
      criticalLevel: parseFloat(row.criticalLevel) || 1,
      currentStock: parseFloat(row.currentStock) || 0,
    }));

    const transactions: SheetTransaction[] = (data.transactions || []).map((row: any, index: number) => ({
      id: row.id || `tx-${index}`,
      date: new Date(row.date),
      productName: row.item || row.productName || "",
      category: row.category || "",
      quantity: parseFloat(row.quantity) || 0,
      unit: row.unit || "шт",
      type: row.type || "Прихід",
      pricePerUnit: parseFloat(row.pricePerUnit) || undefined,
      total: parseFloat(row.total) || undefined,
    }));

    return { products, transactions };
  } catch (error) {
    console.error("Error fetching inventory from Google Sheets:", error);
    throw error;
  }
}

/**
 * Submits a transaction to Google Sheets
 */
export async function submitTransactionToSheets(transaction: {
  item: string;
  quantity: number;
  type: "Прихід" | "Продаж" | "Списання";
  category: string;
  pricePerUnit?: number;
  total?: number;
  date: string;
}): Promise<boolean> {
  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      cache: "no-cache",
      body: JSON.stringify(transaction),
    });
    return true;
  } catch (error) {
    console.error("Error submitting transaction to Google Sheets:", error);
    throw error;
  }
}
