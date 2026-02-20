// Google Sheets API Web App URL
// IMPORTANT: Paste your deployed URL here after "Deploy > New Deployment > Web App"
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz5PAWxUwy7id23mBtK-drhFtvciN99uDTTstO3Aj3Aj8f9MF2GQLDrMC-yi3iSk6II/exec";

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

export interface SheetDirectoryItem {
  category: string;
  name: string;
  unit: string;
  criticalLevel: number;
}

export interface InventoryData {
  products: SheetProduct[];
  transactions: SheetTransaction[];
  directory: SheetDirectoryItem[];
  salesProducts: { name: string; category: string; unit: string; price: number }[];
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
      const text = await response.text();
      console.error(`HTTP error! status: ${response.status}, body: ${text}`);
      throw new Error(`Помилка сервера Google: ${response.status}`);
    }

    let data;
    try {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse JSON response. Raw text:", text);
        throw new Error("Отримано некоректну відповідь від сервера (очікувався JSON).");
      }
    } catch (error) {
      console.error("Error reading response text:", error);
      throw error;
    }

    if (data.error) {
      console.error("Apps Script returned an error:", data.error);
      throw new Error(`Помилка скрипта: ${data.error}`);
    }

    // Parse and transform the data from Google Sheets
    const products: SheetProduct[] = (data.products || []).map((row: any, index: number) => ({
      id: row.id || `stock-${index}`,
      name: row.name || "",
      category: row.category || "",
      unit: row.unit || "",
      criticalLevel: parseFloat(row.criticalLevel) || 0,
      currentStock: parseFloat(row.currentStock) || 0,
    }));

    const directory: SheetDirectoryItem[] = (data.directory || []).map((row: any) => ({
      category: row.category || "",
      name: row.name || "",
      unit: row.unit || "",
      criticalLevel: parseFloat(row.criticalLevel) || 0,
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

    const salesProducts = (data.salesProducts || []).map((row: any) => ({
      name: row.name || "",
      category: row.category || "Готова продукція",
      unit: row.unit || "шт",
      price: parseFloat(row.price) || 0
    }));

    return { products, transactions, directory, salesProducts };
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
  unit: string;
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

/**
 * Tests Telegram Connection
 */
export async function testTelegramConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=testTelegram`, {
      method: "GET",
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error testing Telegram connection:", error);
    return { success: false, error: String(error) };
  }
}
