import { useInventory } from "../hooks/useInventory";
import { LowStockAlert } from "../components/inventory/LowStockAlert";
import { StatsCards } from "../components/inventory/StatsCards";
import { StockTable } from "../components/inventory/StockTable";
import { Button } from "../components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Skeleton } from "../components/ui/skeleton";

const Stock = () => {
    const {
        products,
        lowStockItems,
        todayTransactionsCount,
        isLoading,
        loadError,
        getStockStatus,
        refreshData,
        categories,
    } = useInventory();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Склад</h1>
                    <p className="text-muted-foreground mt-1">
                        Моніторинг залишків та критичних рівнів
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={refreshData}
                    disabled={isLoading}
                    className="bg-card hover:bg-muted"
                >
                    <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    Оновити дані
                </Button>
            </div>

            {loadError && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{loadError}</AlertDescription>
                </Alert>
            )}

            {isLoading ? (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
                        ))}
                    </div>
                    <Skeleton className="h-[400px] w-full rounded-2xl" />
                </div>
            ) : (
                <>
                    <LowStockAlert items={lowStockItems} />

                    <StatsCards
                        totalProducts={products.length}
                        lowStockCount={lowStockItems.length}
                        todayTransactions={todayTransactionsCount}
                    />

                    <div className="glass rounded-2xl shadow-sm border border-white/5 p-6">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-primary" />
                            Поточні залишки
                        </h2>
                        <StockTable products={products} getStockStatus={getStockStatus} categories={categories} />
                    </div>
                </>
            )}
        </div>
    );
};

export default Stock;
