import { useState, useMemo } from "react";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { CalendarIcon, Plus, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Calendar } from "../ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "../../lib/utils";
import { Product, Category, Transaction } from "../../data/products";

interface TransactionFormProps {
  products: Product[];
  salesProducts: Product[];
  categories: Category[];
  isSubmitting: boolean;
  submitStatus: string | null;
  onSubmit: (transaction: Omit<Transaction, "id">) => void;
  onAddProduct: (product: Omit<Product, "id" | "currentStock">) => Product;
}

export function TransactionForm({
  products,
  salesProducts,
  categories,
  isSubmitting,
  submitStatus,
  onSubmit,
  onAddProduct,
}: TransactionFormProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>("Всі категорії");
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [isCustomProduct, setIsCustomProduct] = useState(false);
  const [customProductName, setCustomProductName] = useState("");
  const [customProductUnit, setCustomProductUnit] = useState("кг");
  const [quantity, setQuantity] = useState<string>("");
  const [pricePerUnit, setPricePerUnit] = useState<string>("");
  const [transactionType, setTransactionType] = useState<"Прихід" | "Продаж" | "Списання">("Продаж");
  const [date, setDate] = useState<Date>(new Date());

  // Filter products by category
  const filteredProducts = useMemo(() => {
    // Specialized logic for "готовий товар" (sourced from L1:L11 via salesProducts)
    if (selectedCategory === "готовий товар") {
      return salesProducts;
    }

    // Default filtering for other categories
    if (selectedCategory === "Всі категорії" || !selectedCategory) {
      // If sale, show everything if category is not specified, but usually it's better to stay in specific list
      return transactionType === "Продаж" ? salesProducts : products;
    }

    return products.filter((p) => p.category === selectedCategory);
  }, [products, salesProducts, selectedCategory, transactionType]);

  // Selected product details
  const selectedProduct = useMemo(() => {
    const allAvailable = [...products, ...salesProducts];
    return allAvailable.find((p) => p.id === selectedProductId);
  }, [products, salesProducts, selectedProductId]);

  // Auto-calculate total
  const total = useMemo(() => {
    const qty = parseFloat(quantity) || 0;
    const price = parseFloat(pricePerUnit) || 0;
    return qty * price;
  }, [quantity, pricePerUnit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let product = selectedProduct;

    // If custom product, add it first
    if (isCustomProduct && customProductName) {
      product = onAddProduct({
        name: customProductName,
        category: selectedCategory === "Всі категорії" ? "Інше" : selectedCategory,
        unit: customProductUnit,
        criticalLevel: 1,
      });
    }

    if (!product || !quantity) return;

    onSubmit({
      date,
      productId: product.id,
      productName: product.name,
      category: product.category,
      quantity: parseFloat(quantity),
      unit: product.unit,
      type: transactionType as "Прихід" | "Продаж" | "Списання",
      pricePerUnit: parseFloat(pricePerUnit) || undefined,
      total: total || undefined,
    });

    // Reset form
    setQuantity("");
    setPricePerUnit("");
    setSelectedProductId("");
    setCustomProductName("");
    setIsCustomProduct(false);
  };

  return (
    <Card className="shadow-sm border-0 glass mb-6 overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Внесення даних
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date Picker */}
          <div className="space-y-2">
            <Label>Дата</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: uk }) : "Оберіть дату"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-popover" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Category Filter - only show if not sales */}
          {transactionType !== "Продаж" && (
            <div className="space-y-2">
              <Label>Категорія</Label>
              <Select
                value={selectedCategory}
                onValueChange={(val) => {
                  setSelectedCategory(val as Category);
                  setSelectedProductId("");
                  if (val === "готовий товар") {
                    setTransactionType("Продаж");
                  }
                }}
              >
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue placeholder="Оберіть категорію" />
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
          )}

          {/* Product Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Товар</Label>
              <button
                type="button"
                onClick={() => setIsCustomProduct(!isCustomProduct)}
                className="text-xs text-primary hover:underline"
              >
                {isCustomProduct ? "Вибрати з каталогу" : "+ Додати новий товар"}
              </button>
            </div>

            {isCustomProduct ? (
              <div className="space-y-2">
                <Input
                  placeholder="Назва нового товару"
                  value={customProductName}
                  onChange={(e) => setCustomProductName(e.target.value)}
                />
                <Select value={customProductUnit} onValueChange={setCustomProductUnit}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="кг">кг</SelectItem>
                    <SelectItem value="л">л</SelectItem>
                    <SelectItem value="шт">шт</SelectItem>
                    <SelectItem value="пляш">пляш</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <Select
                value={selectedProductId}
                onValueChange={setSelectedProductId}
              >
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue placeholder="Оберіть товар" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50 max-h-[300px]">
                  {filteredProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} ({product.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Transaction Type */}
          <div className="space-y-2">
            <Label>Тип операції</Label>
            <Select
              value={transactionType}
              onValueChange={(val) => setTransactionType(val as "Прихід" | "Продаж" | "Списання")}
            >
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="Продаж">
                  <span className="text-blue-600 font-medium italic">🛍️ Продаж (Ingredient Write-off)</span>
                </SelectItem>
                <SelectItem value="Прихід">
                  <span className="text-green-600 font-medium">📥 Прихід (Stock Arrival)</span>
                </SelectItem>
                <SelectItem value="Списання">
                  <span className="text-red-400 font-medium">🗑️ Списання (Waste/Loss)</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quantity and Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Кількість</Label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="pr-12"
                />
                {(selectedProduct || isCustomProduct) && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    {isCustomProduct ? customProductUnit : selectedProduct?.unit}
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Ціна за од. (грн)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(e.target.value)}
              />
            </div>
          </div>

          {/* Total */}
          {total > 0 && (
            <div className="p-3 bg-white/10 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Сума:</span>
                <span className="text-xl font-bold">{total.toFixed(2)} грн</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || (!selectedProductId && !customProductName) || !quantity}
          >
            <Send className="mr-2 h-4 w-4" />
            {isSubmitting ? "Надсилання..." : "Відправити в таблицю"}
          </Button>

          {/* Status */}
          {submitStatus && (
            <p className={cn(
              "text-sm text-center",
              submitStatus.includes("успішно") ? "text-green-600" : "text-destructive"
            )}>
              {submitStatus}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
