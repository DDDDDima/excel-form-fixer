import { Package, AlertCircle, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardsProps {
  totalProducts: number;
  lowStockCount: number;
  todayTransactions: number;
}

export function StatsCards({ totalProducts, lowStockCount, todayTransactions }: StatsCardsProps) {
  const stats = [
    {
      title: "Всього товарів",
      value: totalProducts,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Критичний запас",
      value: lowStockCount,
      icon: AlertCircle,
      color: lowStockCount > 0 ? "text-red-600" : "text-green-600",
      bgColor: lowStockCount > 0 ? "bg-red-50" : "bg-green-50",
    },
    {
      title: "Операцій сьогодні",
      value: todayTransactions,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
