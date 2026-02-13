import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Product } from "../../data/products";

interface LowStockAlertProps {
  items: Product[];
  onViewItems?: () => void;
}

export function LowStockAlert({ items, onViewItems }: LowStockAlertProps) {
  if (items.length === 0) return null;

  return (
    <Alert variant="destructive" className="mb-6 border-destructive/50 bg-destructive/10">
      <AlertTriangle className="h-5 w-5" />
      <AlertTitle className="text-base font-semibold">
        ⚠️ Увага: Низький запас ({items.length} {items.length === 1 ? "товар" : items.length < 5 ? "товари" : "товарів"})
      </AlertTitle>
      <AlertDescription className="mt-2">
        <div className="flex flex-wrap gap-2 mt-1">
          {items.slice(0, 5).map((item) => (
            <span
              key={item.id}
              className="inline-flex items-center px-2 py-1 rounded-md bg-destructive/20 text-sm font-medium"
            >
              {item.name}: {item.currentStock} {item.unit}
            </span>
          ))}
          {items.length > 5 && (
            <span className="text-sm opacity-80">
              та ще {items.length - 5}...
            </span>
          )}
        </div>
        {onViewItems && (
          <button
            onClick={onViewItems}
            className="mt-3 text-sm underline hover:no-underline"
          >
            Переглянути всі →
          </button>
        )}
      </AlertDescription>
    </Alert>
  );
}
