import { useState, useCallback, useMemo, useEffect } from "react";
import { Product, Transaction, initialProducts } from "../data/products";
import { fetchInventoryFromSheets, submitTransactionToSheets } from "../services/googleSheetsApi";

// Google Script URL is now managed in src/services/googleSheetsApi.ts

export function useInventory() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [salesProducts, setSalesProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);

  // Shared data loading logic
  const loadInventoryData = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setIsLoading(true);
    setLoadError(null);

    try {
      const data = await fetchInventoryFromSheets();
      console.log("Fetched inventory data:", data);

      if (data.directory && data.directory.length > 0) {
        const productsFromSheet = data.directory.map((dirItem, index) => {
          const stockItem = data.products.find(
            (p) => p.name.toLowerCase() === dirItem.name.toLowerCase()
          );

          return {
            id: `sheet-${index}`,
            name: dirItem.name,
            category: dirItem.category,
            unit: dirItem.unit,
            criticalLevel: dirItem.criticalLevel || 0,
            currentStock: stockItem ? stockItem.currentStock : 0,
          };
        });
        setProducts(productsFromSheet);
      } else if (data.products && data.products.length > 0) {
        // Fallback to stock sheet if directory is empty
        setProducts(data.products.map((p, i) => ({ ...p, id: p.id || `stock-${i}` })));
      }

      if (data.transactions) {
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

      if (data.salesProducts) {
        setSalesProducts(
          data.salesProducts.map((p, index) => ({
            id: `sale-${index}`,
            name: p.name,
            category: p.category,
            unit: p.unit,
            criticalLevel: 0,
            currentStock: 0,
          }))
        );
      }
    } catch (error) {
      console.error("Failed to load inventory data:", error);
      setLoadError("Не вдалося завантажити дані з Google Sheets. Перевірте підключення.");
    } finally {
      if (!isRefresh) setIsLoading(false);
    }
  }, []);

  // Fetch data from Google Sheets on mount
  useEffect(() => {
    loadInventoryData();
  }, [loadInventoryData]);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    await loadInventoryData(true);
    setIsLoading(false);
  }, [loadInventoryData]);


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
              : -transaction.quantity; // Both 'Продаж' and 'Списання' decrease stock
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
          type: transaction.type as "Прихід" | "Продаж" | "Списання",
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

  // Extract unique categories from products for filtering
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map(p => p.category)))
      .filter(c => c && c !== "Запас" && c !== "Інше");
    return ["Всі категорії", "готовий товар", ...uniqueCategories];
  }, [products]);

  return {
    products,
    salesProducts,
    transactions,
    lowStockItems,
    categories,
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
