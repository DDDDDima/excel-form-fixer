import { useState, useCallback, useMemo } from "react";
import { Product, Transaction, initialProducts } from "@/data/products";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxhorDqVKJXhymTIIZ5w6pC-Evkx4Xd_53AbCmNCr9cebR9orh67W0LO_6wSlXogs4P/exec";

export function useInventory() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);

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
        const data = {
          item: transaction.productName,
          quantity: transaction.quantity,
          type: transaction.type,
          category: transaction.category,
          pricePerUnit: transaction.pricePerUnit || 0,
          total: transaction.total || 0,
          date: transaction.date.toISOString().split("T")[0],
        };

        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          cache: "no-cache",
          body: JSON.stringify(data),
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
    getStockStatus,
    addProduct,
    submitTransaction,
  };
}
