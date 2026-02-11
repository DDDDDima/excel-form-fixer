// Product catalog aligned with the directory (Довідник)
export interface Product {
  id: string;
  name: string;
  category: string;
  unit: string;
  criticalLevel: number;
  currentStock: number;
}

export const categories = [
  "Всі категорії",
  "Ягоди та Фрукти",
  "Шоколад",
  "Дубайський Десерт",
  "Сиропи",
  "Бар",
  "Витратні матеріали",
] as const;

export type Category = (typeof categories)[number];

// Initial product catalog (to be synced with 'Довідник' tab)
export const initialProducts: Product[] = [
  // Ягоди та Фрукти
  { id: "1", name: "Полуниця", category: "Ягоди та Фрукти", unit: "кг", criticalLevel: 5, currentStock: 0 },
  { id: "2", name: "Банан", category: "Ягоди та Фрукти", unit: "кг", criticalLevel: 3, currentStock: 0 },
  { id: "3", name: "М'ята", category: "Ягоди та Фрукти", unit: "кг", criticalLevel: 0.5, currentStock: 0 },

  // Шоколад
  { id: "4", name: "Шоколад Білий", category: "Шоколад", unit: "кг", criticalLevel: 2, currentStock: 0 },
  { id: "5", name: "Шоколад Молочний", category: "Шоколад", unit: "кг", criticalLevel: 2, currentStock: 0 },
  { id: "6", name: "Шоколад Чорний", category: "Шоколад", unit: "кг", criticalLevel: 2, currentStock: 0 },

  // Дубайський Десерт
  { id: "7", name: "Тісто Катаїфі", category: "Дубайський Десерт", unit: "кг", criticalLevel: 1, currentStock: 0 },
  { id: "8", name: "Фісташкова паста", category: "Дубайський Десерт", unit: "кг", criticalLevel: 0.5, currentStock: 0 },
  { id: "9", name: "Паста Тахіні", category: "Дубайський Десерт", unit: "кг", criticalLevel: 0.3, currentStock: 0 },

  // Бар
  { id: "18", name: "Лимонний сік", category: "Бар", unit: "л", criticalLevel: 1, currentStock: 0 },
  { id: "19", name: "Цукровий сироп", category: "Бар", unit: "л", criticalLevel: 1, currentStock: 0 },
  { id: "20", name: "Вода очищена", category: "Бар", unit: "л", criticalLevel: 10, currentStock: 0 },

  // Витратні матеріали
  { id: "21", name: "Стаканчики (Полуниця)", category: "Витратні матеріали", unit: "шт", criticalLevel: 100, currentStock: 0 },
  { id: "22", name: "Стаканчики (Лимонад)", category: "Витратні матеріали", unit: "шт", criticalLevel: 100, currentStock: 0 },
  { id: "23", name: "Пляшечки (Лимонад)", category: "Витратні матеріали", unit: "шт", criticalLevel: 50, currentStock: 0 },
  { id: "24", name: "Кришечки", category: "Витратні матеріали", unit: "шт", criticalLevel: 100, currentStock: 0 },
  { id: "25", name: "Трубочки", category: "Витратні матеріали", unit: "шт", criticalLevel: 100, currentStock: 0 },
  { id: "26", name: "Серветки", category: "Витратні матеріали", unit: "шт", criticalLevel: 3, currentStock: 0 },
  { id: "27", name: "Наклейки", category: "Витратні матеріали", unit: "шт", criticalLevel: 100, currentStock: 0 },
];

export interface Transaction {
  id: string;
  date: Date;
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  type: "Прихід" | "Продаж" | "Списання";
  pricePerUnit?: number;
  total?: number;
}
