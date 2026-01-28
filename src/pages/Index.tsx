import { useInventory } from "@/hooks/useInventory";
import { LowStockAlert } from "@/components/inventory/LowStockAlert";
import { StatsCards } from "@/components/inventory/StatsCards";
import { TransactionForm } from "@/components/inventory/TransactionForm";
import { StockTable } from "@/components/inventory/StockTable";

const Index = () => {
  const {
    products,
    lowStockItems,
    isSubmitting,
    submitStatus,
    todayTransactionsCount,
    getStockStatus,
    addProduct,
    submitTransaction,
  } = useInventory();

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">
            🍓 Система Обліку Запасів
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Управління товарами та інвентаризацією
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Low Stock Alert */}
        <LowStockAlert items={lowStockItems} />

        {/* Stats Cards */}
        <StatsCards
          totalProducts={products.length}
          lowStockCount={lowStockItems.length}
          todayTransactions={todayTransactionsCount}
        />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transaction Form */}
          <div>
            <TransactionForm
              products={products}
              isSubmitting={isSubmitting}
              submitStatus={submitStatus}
              onSubmit={submitTransaction}
              onAddProduct={addProduct}
            />
          </div>

          {/* Stock Table */}
          <div className="lg:col-span-1">
            <StockTable products={products} getStockStatus={getStockStatus} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-muted-foreground border-t bg-card mt-8">
        Система Обліку Запасів © {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default Index;
