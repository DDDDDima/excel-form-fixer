import { useState, useCallback, useMemo, useEffect } from "react";
import { Product, Transaction, Recipe, initialProducts } from "../data/products";
import { fetchInventoryFromSheets, submitTransactionToSheets } from "../services/googleSheetsApi";

// Google Script URL is now managed in src/services/googleSheetsApi.ts

export function useInventory() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [salesProducts, setSalesProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

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
            price: p.price || 0,
          }))
        );
      }

      if (data.recipes) {
        setRecipes(data.recipes);
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

  // Calculate low stock items
  const lowStockItems = useMemo(() => {
    return products.filter((p) => p.currentStock <= p.criticalLevel);
  }, [products]);

  // Calculate stock status for a product
  const getStockStatus = useCallback((product: Product) => {
    if (product.criticalLevel === 0) return "normal";
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
              : -transaction.quantity; // Both 'Продаж' and 'Списання' decrease stock
            const newStock = p.currentStock + change;
            return {
              ...p,
              currentStock: Math.max(0, parseFloat(newStock.toFixed(3))),
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
          date: transaction.date.toISOString(),
          unit: transaction.unit,
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
    recipes,
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
