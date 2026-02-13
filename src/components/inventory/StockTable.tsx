import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Product, categories, Category } from "@/data/products";

interface StockTableProps {
  products: Product[];
  getStockStatus: (product: Product) => "normal" | "warning" | "warning-high" | "critical";
}

export function StockTable({ products, getStockStatus }: StockTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<Category>("Всі категорії");

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        filterCategory === "Всі категорії" || product.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, filterCategory]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "critical":
        return (
          <Badge variant="destructive" className="bg-red-500">
            🔴 Критичний
          </Badge>
        );
      case "warning-high":
        return (
          <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
            🟠 Низький
          </Badge>
        );
      case "warning":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
            🟡 Увага
          </Badge>
        );
      default:
        return (
          <Badge className="bg-green-500 hover:bg-green-600 text-white">
            🟢 Норма
          </Badge>
        );
    }
  };

  return (
    <Card className="shadow-sm border-0 glass overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">📊 Огляд залишків</CardTitle>
        <div className="flex flex-col sm:flex-row gap-3 mt-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Пошук товару..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={filterCategory}
            onValueChange={(val) => setFilterCategory(val as Category)}
          >
            <SelectTrigger className="w-full sm:w-[200px] bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-white/5 border-white/5 hover:bg-white/10 transition-colors">
                <TableHead className="font-semibold">Товар</TableHead>
                <TableHead className="font-semibold hidden sm:table-cell">Категорія</TableHead>
                <TableHead className="font-semibold text-center">Залишок</TableHead>
                <TableHead className="font-semibold hidden sm:table-cell text-center">Критичний</TableHead>
                <TableHead className="font-semibold text-center">Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Товарів не знайдено
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => {
                  const status = getStockStatus(product);
                  return (
                    <TableRow
                      key={product.id}
                      className={cn(
                        "hover:bg-white/5 transition-colors border-white/5",
                        status === "critical" && "bg-red-500/10",
                        status === "warning-high" && "bg-orange-500/10",
                        status === "warning" && "bg-yellow-500/10"
                      )}
                    >
                      <TableCell className="font-medium">
                        {product.name}
                        <span className="sm:hidden text-xs text-muted-foreground block">
                          {product.category}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        {product.category}
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        {product.currentStock} {product.unit}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-center text-muted-foreground">
                        {product.criticalLevel} {product.unit}
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(status)}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
        <p className="text-xs text-muted-foreground mt-3 text-center">
          Показано {filteredProducts.length} з {products.length} товарів
        </p>
      </CardContent>
    </Card>
  );
}
