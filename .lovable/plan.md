
# План: Покращення форми введення даних

## Зміни

### 1. Поле кількості з підказкою одиниці виміру
Додати відображення одиниці виміру (кг, л, шт, пляш) біля поля "Кількість", яка динамічно змінюється залежно від обраного товару.

**Файл:** `src/components/inventory/TransactionForm.tsx`

**Зміни:**
- Замінити просте поле Input на поле з суфіксом одиниці виміру
- Одиниця береться з обраного товару (`selectedProduct?.unit`) або з кастомного товару (`customProductUnit`)
- Використати відносне позиціонування для показу одиниці праворуч у полі

**Приклад вигляду:**
```text
┌─────────────────────────────────────┐
│ Кількість                           │
├─────────────────────────────────────┤
│ [5.5                          ] кг  │
└─────────────────────────────────────┘
```

---

## Технічна реалізація

### TransactionForm.tsx - зміни в секції Quantity (рядки 238-249)

**Було:**
```tsx
<div className="space-y-2">
  <Label>Кількість</Label>
  <Input
    type="number"
    step="0.01"
    placeholder="0"
    value={quantity}
    onChange={(e) => setQuantity(e.target.value)}
  />
</div>
```

**Стане:**
```tsx
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
```

---

## Результат
- Коли користувач обере товар (наприклад, "Полуниця"), біля поля кількості буде видно "кг"
- Коли обере "Стаканчики", буде видно "шт"
- Для кастомного товару показується обрана одиниця виміру
- Підказка з'являється тільки після вибору товару
