import { useInventory } from "@/hooks/useInventory";
import { TransactionForm } from "@/components/inventory/TransactionForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, History } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Transactions = () => {
    const {
        products,
        salesProducts,
        categories,
        isSubmitting,
        submitStatus,
        transactions,
        isLoading,
        loadError,
        addProduct,
        submitTransaction,
    } = useInventory();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Операції</h1>
                <p className="text-muted-foreground mt-1">
                    Внесення даних про прихід та продаж товарів
                </p>
            </div>

            {loadError && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{loadError}</AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="xl:col-span-1">
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

                {/* History Section */}
                <div className="xl:col-span-2">
                    <Card className="shadow-sm border-0 h-full glass overflow-hidden">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <History className="h-5 w-5" />
                                Останні операції
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="h-12 w-full bg-muted animate-pulse rounded-lg" />
                                    ))}
                                </div>
                            ) : transactions.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    Операцій поки немає
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {transactions.slice(0, 10).map((t) => (
                                        <div
                                            key={t.id}
                                            className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors shadow-sm"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "h-10 w-10 rounded-full flex items-center justify-center font-bold",
                                                    t.type === "Прихід" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                                )}>
                                                    {t.type === "Прихід" ? "+" : "-"}
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{t.productName}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(t.date).toLocaleDateString("uk-UA")} • {t.category}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={cn(
                                                    "font-bold text-lg",
                                                    t.type === "Прихід" ? "text-green-600" : "text-red-600"
                                                )}>
                                                    {t.type === "Прихід" ? "+" : "-"}{t.quantity} {t.unit}
                                                </p>
                                                {t.total && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {t.total.toFixed(2)} грн
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

// Helper for cn (copying since imports might be tricky)
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}

export default Transactions;
