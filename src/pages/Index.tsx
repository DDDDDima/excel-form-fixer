import { useInventory } from "../hooks/useInventory";
import { LowStockAlert } from "../components/inventory/LowStockAlert";
import { StatsCards } from "../components/inventory/StatsCards";
import { TransactionForm } from "../components/inventory/TransactionForm";
import { StockTable } from "../components/inventory/StockTable";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import { RefreshCw, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../components/ui/alert";

const Index = () => {
  const {
    products,
    salesProducts,
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
    categories,
  } = useInventory();

  return (
    <div className="bg-transparent">
      {/* Header */}
      <header className="glass shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                🍓 Система Обліку Запасів
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Управління товарами та інвентаризацією
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Оновити
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Error Alert */}
        {loadError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{loadError}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-6">
            {/* Stats Skeleton */}
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-lg p-4 shadow-sm">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-8 w-12" />
                </div>
              ))}
            </div>

            {/* Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
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
                  salesProducts={salesProducts}
                  categories={categories}
                  isSubmitting={isSubmitting}
                  submitStatus={submitStatus}
                  onSubmit={submitTransaction}
                  onAddProduct={addProduct}
                />
              </div>

              {/* Stock Table */}
              <div className="lg:col-span-1">
                <StockTable products={products} getStockStatus={getStockStatus} categories={categories} />
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-muted-foreground border-t glass mt-8">
        Система Обліку Запасів © {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default Index;
