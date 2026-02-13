import React, { useMemo, useState } from "react";
import { useInventory } from "@/hooks/useInventory";
import { AnalyticsTable } from "@/components/inventory/AnalyticsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, TrendingDown, Package } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Analytics = () => {
    const { products, transactions, isLoading } = useInventory();
    const [period, setPeriod] = useState("7d");

    const turnoverData = useMemo(() => {
        if (!products.length) return [];

        const now = new Date();
        const startDates: Record<string, Date> = {
            "today": new Date(now.setHours(0, 0, 0, 0)),
            "7d": new Date(new Date().setDate(now.getDate() - 7)),
            "30d": new Date(new Date().setDate(now.getDate() - 30)),
            "all": new Date(0)
        };

        const startDate = startDates[period];

        return products.map(product => {
            const productTransactions = transactions.filter(t =>
                t.productName === product.name &&
                new Date(t.date) >= startDate
            );

            const receipts = productTransactions
                .filter(t => t.type === "Прихід" || t.type === "arrival")
                .reduce((sum, t) => sum + t.quantity, 0);

            const sales = productTransactions
                .filter(t => t.type === "Продаж")
                .reduce((sum, t) => sum + t.quantity, 0);

            const losses = productTransactions
                .filter(t => t.type === "Списання")
                .reduce((sum, t) => sum + t.quantity, 0);

            return {
                name: product.name,
                category: product.category,
                unit: product.unit,
                receipts,
                sales,
                losses,
                netChange: receipts - sales - losses,
                currentStock: product.currentStock
            };
        });
    }, [products, transactions, period]);

    const stats = useMemo(() => {
        return {
            totalEntries: turnoverData.reduce((sum, d) => sum + d.receipts, 0),
            totalSales: turnoverData.reduce((sum, d) => sum + d.sales, 0),
            totalLosses: turnoverData.reduce((sum, d) => sum + d.losses, 0),
        };
    }, [turnoverData]);

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

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Аналітика</h1>
                    <p className="text-muted-foreground mt-1">Відстеження обороту та руху товарів</p>
                </div>

                <Tabs value={period} onValueChange={setPeriod} className="w-full md:w-auto">
                    <TabsList className="bg-white/5 border border-white/10">
                        <TabsTrigger value="today">Сьогодні</TabsTrigger>
                        <TabsTrigger value="7d">7 днів</TabsTrigger>
                        <TabsTrigger value="30d">30 днів</TabsTrigger>
                        <TabsTrigger value="all">Все</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="glass border-white/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-400" />
                            Загальний прихід
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalEntries.toFixed(1)}</div>
                        <p className="text-xs text-muted-foreground mt-1">Одиниць товару за період</p>
                    </CardContent>
                </Card>

                <Card className="glass border-white/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <TrendingDown className="h-4 w-4 text-red-400" />
                            Загальний продаж
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalSales.toFixed(1)}</div>
                        <p className="text-xs text-muted-foreground mt-1">Списано за період</p>
                    </CardContent>
                </Card>

                <Card className="glass border-white/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Package className="h-4 w-4 text-orange-400" />
                            Втрати / Списання
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalLosses.toFixed(1)}</div>
                        <p className="text-xs text-muted-foreground mt-1">Пошкодження або брак</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="glass border-white/5 p-6">
                <div className="flex items-center gap-2 mb-6">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold text-white">Аналіз обороту за позиціями</h2>
                </div>
                <AnalyticsTable data={turnoverData} />
            </Card>
        </div>
    );
};

export default Analytics;
