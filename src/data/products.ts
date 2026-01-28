// Product catalog from Excel data
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
  "Ягода/Фрукти",
  "Шоколад",
  "Дубайський",
  "Сиропи",
  "Бар",
  "Розхідники",
] as const;

export type Category = (typeof categories)[number];

// Initial product catalog from Excel
export const initialProducts: Product[] = [
  // Ягода/Фрукти
  { id: "1", name: "Полуниця", category: "Ягода/Фрукти", unit: "кг", criticalLevel: 5, currentStock: 0 },
  { id: "2", name: "Банан", category: "Ягода/Фрукти", unit: "кг", criticalLevel: 3, currentStock: 0 },
  { id: "3", name: "М'ята", category: "Ягода/Фрукти", unit: "кг", criticalLevel: 0.5, currentStock: 0 },
  
  // Шоколад
  { id: "4", name: "Шоколад Білий", category: "Шоколад", unit: "кг", criticalLevel: 2, currentStock: 0 },
  { id: "5", name: "Шоколад Молочний", category: "Шоколад", unit: "кг", criticalLevel: 2, currentStock: 0 },
  { id: "6", name: "Шоколад Чорний", category: "Шоколад", unit: "кг", criticalLevel: 2, currentStock: 0 },
  
  // Дубайський
  { id: "7", name: "Тісто Катаїфі", category: "Дубайський", unit: "кг", criticalLevel: 1, currentStock: 0 },
  { id: "8", name: "Фісташкова паста", category: "Дубайський", unit: "кг", criticalLevel: 0.5, currentStock: 0 },
  { id: "9", name: "Паста Тахіні", category: "Дубайський", unit: "кг", criticalLevel: 0.3, currentStock: 0 },
  
  // Сиропи
  { id: "10", name: "Сироп Смак 1", category: "Сиропи", unit: "пляш", criticalLevel: 0.5, currentStock: 0 },
  { id: "11", name: "Сироп Смак 2", category: "Сиропи", unit: "пляш", criticalLevel: 0.5, currentStock: 0 },
  { id: "12", name: "Сироп Смак 3", category: "Сиропи", unit: "пляш", criticalLevel: 0.5, currentStock: 0 },
  { id: "13", name: "Сироп Смак 4", category: "Сиропи", unit: "пляш", criticalLevel: 0.5, currentStock: 0 },
  { id: "14", name: "Сироп Смак 5", category: "Сиропи", unit: "пляш", criticalLevel: 0.5, currentStock: 0 },
  { id: "15", name: "Сироп Смак 6", category: "Сиропи", unit: "пляш", criticalLevel: 0.5, currentStock: 0 },
  { id: "16", name: "Сироп Смак 7", category: "Сиропи", unit: "пляш", criticalLevel: 0.5, currentStock: 0 },
  { id: "17", name: "Сироп Смак 8", category: "Сиропи", unit: "пляш", criticalLevel: 0.5, currentStock: 0 },
  
  // Бар
  { id: "18", name: "Лимонний сік", category: "Бар", unit: "л", criticalLevel: 1, currentStock: 0 },
  { id: "19", name: "Цукровий сироп", category: "Бар", unit: "л", criticalLevel: 1, currentStock: 0 },
  { id: "20", name: "Вода", category: "Бар", unit: "л", criticalLevel: 10, currentStock: 0 },
  
  // Розхідники
  { id: "21", name: "Стаканчики Полуниця", category: "Розхідники", unit: "шт", criticalLevel: 100, currentStock: 0 },
  { id: "22", name: "Стаканчики Лимонад", category: "Розхідники", unit: "шт", criticalLevel: 100, currentStock: 0 },
  { id: "23", name: "Пляшечки Лимонад", category: "Розхідники", unit: "шт", criticalLevel: 50, currentStock: 0 },
  { id: "24", name: "Кришечки", category: "Розхідники", unit: "шт", criticalLevel: 100, currentStock: 0 },
  { id: "25", name: "Трубочки", category: "Розхідники", unit: "шт", criticalLevel: 100, currentStock: 0 },
  { id: "26", name: "Серветки", category: "Розхідники", unit: "шт", criticalLevel: 3, currentStock: 0 },
  { id: "27", name: "Наклейки", category: "Розхідники", unit: "шт", criticalLevel: 100, currentStock: 0 },
];

export interface Transaction {
  id: string;
  date: Date;
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  type: "Прихід" | "Списання";
  pricePerUnit?: number;
  total?: number;
}
