import React, { useMemo, useState } from "react";
import { useInventory } from "../hooks/useInventory";
import { AnalyticsTable } from "../components/inventory/AnalyticsTable";
import { ProductSalesTable } from "../components/inventory/ProductSalesTable";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { BarChart3, TrendingUp, TrendingDown, Package, Download, ShoppingCart, DollarSign } from "lucide-react";
import { Skeleton } from "../components/ui/skeleton";
import { exportToCSV } from "../lib/exportUtils";

const Analytics = () => {
    const { products, salesProducts, transactions, recipes, isLoading } = useInventory();
    const [period, setPeriod] = useState("7d");
    const [activeTab, setActiveTab] = useState<"ingredients" | "products">("ingredients");

    const startDate = useMemo(() => {
        const now = new Date();
        const startDates: Record<string, Date> = {
            "today": new Date(new Date().setHours(0, 0, 0, 0)),
            "7d": new Date(new Date().setDate(now.getDate() - 7)),
            "30d": new Date(new Date().setDate(now.getDate() - 30)),
            "all": new Date(0)
        };
        return startDates[period];
    }, [period]);

    // Filtered transactions by period
    const periodTransactions = useMemo(() => {
        return transactions.filter(t => new Date(t.date) >= startDate);
    }, [transactions, startDate]);

    // === INGREDIENTS TAB DATA ===
    const ingredientData = useMemo(() => {
        if (!products.length) return [];

        // Build a map: ingredient -> total consumed via sales (from recipes)
        const ingredientSalesMap: Record<string, number> = {};

        // For each sale transaction, look up the recipe and accumulate ingredient usage
        const salesTransactions = periodTransactions.filter(t => t.type === "Продаж");

        salesTransactions.forEach(sale => {
            const productRecipes = recipes.filter(
                r => r.product.toLowerCase() === sale.productName.toLowerCase()
            );
            productRecipes.forEach(recipe => {
                const ingKey = recipe.ingredient.toLowerCase();
                if (!ingredientSalesMap[ingKey]) ingredientSalesMap[ingKey] = 0;
                ingredientSalesMap[ingKey] += Math.round(recipe.amount * sale.quantity * 1000) / 1000;
            });
        });

        return products.map(product => {
            const productTransactions = periodTransactions.filter(t =>
                t.productName === product.name
            );

            const receipts = productTransactions
                .filter(t => t.type === "Прихід")
                .reduce((sum, t) => sum + t.quantity, 0);

            // Direct sales of this ingredient (if any)
            const directSales = productTransactions
                .filter(t => t.type === "Продаж")
                .reduce((sum, t) => sum + t.quantity, 0);

            // Recipe-based consumption
            const recipeSales = ingredientSalesMap[product.name.toLowerCase()] || 0;

            // Total sales = direct + recipe-based
            const totalSales = directSales + recipeSales;

            const losses = productTransactions
                .filter(t => t.type === "Списання")
                .reduce((sum, t) => sum + t.quantity, 0);

            return {
                name: product.name,
                category: product.category,
                unit: product.unit,
                receipts,
                sales: totalSales,
                losses,
                netChange: receipts - totalSales - losses,
                currentStock: product.currentStock
            };
        });
    }, [products, periodTransactions, recipes]);

    // === PRODUCTS TAB DATA ===
    const productSalesData = useMemo(() => {
        // Get unique product names from salesProducts list (column L)
        const productNames = salesProducts.map(p => p.name);
        if (!productNames.length) return [];

        // Also check transactions for product names with type "Продаж"
        const salesTransactions = periodTransactions.filter(t => t.type === "Продаж");

        // Build a set of all sold product names
        const allSoldProducts = new Set<string>();
        productNames.forEach(name => allSoldProducts.add(name));
        salesTransactions.forEach(t => allSoldProducts.add(t.productName));

        // Get last purchase prices for ingredients (for cost calculation)
        const ingredientPrices: Record<string, number> = {};
        // Go through all arrival transactions to find last price per ingredient
        transactions
            .filter(t => t.type === "Прихід")
            .forEach(t => {
                const key = t.productName.toLowerCase();
                // Since transactions are reverse-sorted (newest first), first match = last price
                if (ingredientPrices[key] === undefined && t.pricePerUnit && t.pricePerUnit > 0) {
                    ingredientPrices[key] = t.pricePerUnit;
                }
            });

        return Array.from(allSoldProducts).map(productName => {
            const productTxs = salesTransactions.filter(
                t => t.productName.toLowerCase() === productName.toLowerCase()
            );

            const quantitySold = productTxs.reduce((sum, t) => sum + t.quantity, 0);
            const revenue = productTxs.reduce((sum, t) => sum + (t.total || 0), 0);

            // Calculate cost from recipes
            const productRecipes = recipes.filter(
                r => r.product.toLowerCase() === productName.toLowerCase()
            );

            let cost = 0;
            productRecipes.forEach(recipe => {
                const ingredientPrice = ingredientPrices[recipe.ingredient.toLowerCase()] || 0;
                cost += recipe.amount * ingredientPrice * quantitySold;
            });

            cost = Math.round(cost * 100) / 100;
            const profit = Math.round((revenue - cost) * 100) / 100;

            // Find price from salesProducts
            const sp = salesProducts.find(
                p => p.name.toLowerCase() === productName.toLowerCase()
            );

            return {
                name: productName,
                price: sp?.price || 0,
                quantitySold,
                revenue: Math.round(revenue * 100) / 100,
                cost,
                profit,
                recipeItems: productRecipes.length
            };
        }).filter(p => p.quantitySold > 0 || salesProducts.some(
            sp => sp.name.toLowerCase() === p.name.toLowerCase()
        ));
    }, [salesProducts, periodTransactions, transactions, recipes]);

    // === SUMMARY STATS ===
    const stats = useMemo(() => {
        if (activeTab === "ingredients") {
            return {
                stat1Label: "Загальний прихід",
                stat1Value: ingredientData.reduce((sum, d) => sum + d.receipts, 0).toFixed(1),
                stat1Sub: "Одиниць за період",
                stat1Icon: <TrendingUp className="h-4 w-4 text-green-400" />,
                stat2Label: "Витрати (продаж + рецепти)",
                stat2Value: ingredientData.reduce((sum, d) => sum + d.sales, 0).toFixed(1),
                stat2Sub: "Витрачено інгредієнтів",
                stat2Icon: <TrendingDown className="h-4 w-4 text-red-400" />,
                stat3Label: "Списання",
                stat3Value: ingredientData.reduce((sum, d) => sum + d.losses, 0).toFixed(1),
                stat3Sub: "Пошкодження або брак",
                stat3Icon: <Package className="h-4 w-4 text-orange-400" />,
            };
        } else {
            const totalRevenue = productSalesData.reduce((sum, d) => sum + d.revenue, 0);
            const totalCost = productSalesData.reduce((sum, d) => sum + d.cost, 0);
            const totalProfit = productSalesData.reduce((sum, d) => sum + d.profit, 0);
            return {
                stat1Label: "Загальний виторг",
                stat1Value: totalRevenue.toFixed(2) + " ₴",
                stat1Sub: "Сума продажів за період",
                stat1Icon: <DollarSign className="h-4 w-4 text-green-400" />,
                stat2Label: "Собівартість",
                stat2Value: totalCost.toFixed(2) + " ₴",
                stat2Sub: "Витрати інгредієнтів",
                stat2Icon: <ShoppingCart className="h-4 w-4 text-red-400" />,
                stat3Label: "Прибуток",
                stat3Value: totalProfit.toFixed(2) + " ₴",
                stat3Sub: "Виторг − Собівартість",
                stat3Icon: <TrendingUp className="h-4 w-4 text-emerald-400" />,
            };
        }
    }, [activeTab, ingredientData, productSalesData]);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
                </div>
                <Skeleton className="h-[500px] w-full rounded-2xl" />
            </div>
        );
    }

    const exportData = activeTab === "ingredients" ? ingredientData : productSalesData;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Аналітика</h1>
                    <p className="text-muted-foreground mt-1">Відстеження обороту та руху товарів</p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <Tabs value={period} onValueChange={setPeriod} className="w-full md:w-auto">
                        <TabsList className="bg-white/5 border border-white/10">
                            <TabsTrigger value="today">Сьогодні</TabsTrigger>
                            <TabsTrigger value="7d">7 днів</TabsTrigger>
                            <TabsTrigger value="30d">30 днів</TabsTrigger>
                            <TabsTrigger value="all">Все</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 bg-white/5 border-white/10"
                        onClick={() => exportToCSV(exportData, `Analytics_${activeTab}_${period}`)}
                    >
                        <Download className="h-4 w-4" />
                        Експорт
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="glass border-white/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            {stats.stat1Icon}
                            {stats.stat1Label}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.stat1Value}</div>
                        <p className="text-xs text-muted-foreground mt-1">{stats.stat1Sub}</p>
                    </CardContent>
                </Card>

                <Card className="glass border-white/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            {stats.stat2Icon}
                            {stats.stat2Label}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.stat2Value}</div>
                        <p className="text-xs text-muted-foreground mt-1">{stats.stat2Sub}</p>
                    </CardContent>
                </Card>

                <Card className="glass border-white/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            {stats.stat3Icon}
                            {stats.stat3Label}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.stat3Value}</div>
                        <p className="text-xs text-muted-foreground mt-1">{stats.stat3Sub}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Analytics Card with Sub-Tabs */}
            <Card className="glass border-white/5 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        <h2 className="text-xl font-semibold text-white">Аналіз обороту</h2>
                    </div>
                    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "ingredients" | "products")} className="w-full md:w-auto">
                        <TabsList className="bg-white/5 border border-white/10">
                            <TabsTrigger value="ingredients" className="gap-2">
                                <Package className="h-4 w-4" />
                                Інгредієнти
                            </TabsTrigger>
                            <TabsTrigger value="products" className="gap-2">
                                <ShoppingCart className="h-4 w-4" />
                                Товари
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {activeTab === "ingredients" ? (
                    <AnalyticsTable data={ingredientData} />
                ) : (
                    <ProductSalesTable data={productSalesData} />
                )}
            </Card>
        </div>
    );
};

export default Analytics;
