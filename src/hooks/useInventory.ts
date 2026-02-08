import { useState, useCallback, useMemo, useEffect } from "react";
import { Product, Transaction, initialProducts } from "@/data/products";
import { fetchInventoryFromSheets, submitTransactionToSheets } from "@/services/googleSheetsApi";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxhorDqVKJXhymTIIZ5w6pC-Evkx4Xd_53AbCmNCr9cebR9orh67W0LO_6wSlXogs4P/exec";

export function useInventory() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);
  
  // Loading states for initial data fetch
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Fetch data from Google Sheets on mount
  useEffect(() => {
    async function loadInventoryData() {
      setIsLoading(true);
      setLoadError(null);
      
      try {
        const data = await fetchInventoryFromSheets();
        
        if (data.products.length > 0) {
          // Merge sheet data with initial products (sheet data takes priority)
          const mergedProducts = initialProducts.map((initialProduct) => {
            const sheetProduct = data.products.find(
              (p) => p.name.toLowerCase() === initialProduct.name.toLowerCase()
            );
            if (sheetProduct) {
              return {
                ...initialProduct,
                currentStock: sheetProduct.currentStock,
                criticalLevel: sheetProduct.criticalLevel || initialProduct.criticalLevel,
              };
            }
            return initialProduct;
          });

          // Add any new products from sheets that aren't in initialProducts
          const newProducts = data.products.filter(
            (sheetProduct) =>
              !initialProducts.some(
                (p) => p.name.toLowerCase() === sheetProduct.name.toLowerCase()
              )
          );

          setProducts([...mergedProducts, ...newProducts]);
        }

        if (data.transactions.length > 0) {
          setTransactions(
            data.transactions.map((t) => ({
              id: t.id,
              date: t.date,
              productId: "",
              productName: t.productName,
              category: t.category,
              quantity: t.quantity,
              unit: t.unit,
              type: t.type,
              pricePerUnit: t.pricePerUnit,
              total: t.total,
            }))
          );
        }
      } catch (error) {
        console.error("Failed to load inventory data:", error);
        setLoadError("Не вдалося завантажити дані з Google Sheets. Використовуються локальні дані.");
      } finally {
        setIsLoading(false);
      }
    }

    loadInventoryData();
  }, []);

  // Calculate low stock items
  const lowStockItems = useMemo(() => {
    return products.filter((p) => p.currentStock <= p.criticalLevel);
  }, [products]);

  // Calculate stock status for a product
  const getStockStatus = useCallback((product: Product) => {
    const ratio = product.currentStock / product.criticalLevel;
    if (ratio <= 1) return "critical"; // At or below critical
    if (ratio <= 1.5) return "warning-high"; // Within 50% of critical (orange)
    if (ratio <= 2) return "warning"; // Within 100% of critical (yellow)
    return "normal"; // More than 2x critical level
  }, []);

  // Add a new product to catalog
  const addProduct = useCallback((product: Omit<Product, "id" | "currentStock">) => {
    const newProduct: Product = {
      ...product,
      id: `custom-${Date.now()}`,
      currentStock: 0,
    };
    setProducts((prev) => [...prev, newProduct]);
    return newProduct;
  }, []);

  // Refresh data from Google Sheets
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    
    try {
      const data = await fetchInventoryFromSheets();
      
      if (data.products.length > 0) {
        const mergedProducts = initialProducts.map((initialProduct) => {
          const sheetProduct = data.products.find(
            (p) => p.name.toLowerCase() === initialProduct.name.toLowerCase()
          );
          if (sheetProduct) {
            return {
              ...initialProduct,
              currentStock: sheetProduct.currentStock,
              criticalLevel: sheetProduct.criticalLevel || initialProduct.criticalLevel,
            };
          }
          return initialProduct;
        });

        const newProducts = data.products.filter(
          (sheetProduct) =>
            !initialProducts.some(
              (p) => p.name.toLowerCase() === sheetProduct.name.toLowerCase()
            )
        );

        setProducts([...mergedProducts, ...newProducts]);
      }
    } catch (error) {
      console.error("Failed to refresh inventory data:", error);
      setLoadError("Не вдалося оновити дані з Google Sheets.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Submit transaction
  const submitTransaction = useCallback(
    async (transaction: Omit<Transaction, "id">) => {
      setIsSubmitting(true);
      setSubmitStatus("Надсилання...");

      const newTransaction: Transaction = {
        ...transaction,
        id: `tx-${Date.now()}`,
      };

      // Update local stock
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === transaction.productId) {
            const change = transaction.type === "Прихід" 
              ? transaction.quantity 
              : -transaction.quantity;
            return {
              ...p,
              currentStock: Math.max(0, p.currentStock + change),
            };
          }
          return p;
        })
      );

      setTransactions((prev) => [newTransaction, ...prev]);

      // Send to Google Sheets
      try {
        await submitTransactionToSheets({
          item: transaction.productName,
          quantity: transaction.quantity,
          type: transaction.type,
          category: transaction.category,
          pricePerUnit: transaction.pricePerUnit || 0,
          total: transaction.total || 0,
          date: transaction.date.toISOString().split("T")[0],
        });

        setSubmitStatus("Дані успішно відправлено!");
      } catch (error) {
        setSubmitStatus(`Помилка: ${error}`);
      } finally {
        setIsSubmitting(false);
        setTimeout(() => setSubmitStatus(null), 3000);
      }
    },
    []
  );

  // Today's transactions count
  const todayTransactionsCount = useMemo(() => {
    const today = new Date().toDateString();
    return transactions.filter(
      (t) => new Date(t.date).toDateString() === today
    ).length;
  }, [transactions]);

  return {
    products,
    transactions,
    lowStockItems,
    isSubmitting,
    submitStatus,
    todayTransactionsCount,
    isLoading,
    loadError,
    getStockStatus,
    addProduct,
    submitTransaction,
    refreshData,
  };
}
