
# 🍓 Система Управління Запасами (Inventory Management System)

## Огляд / Overview
A modern, clean web application for managing your food/beverage business inventory, connected to your existing Google Sheets. All in Ukrainian language.

---

## Головні Функції / Main Features

### 1. 📦 Розширена Форма Введення / Enhanced Data Entry Form
- **Product dropdown** with all items from your catalog (Полуниця, Банан, Шоколад, Сиропи, etc.)
- **Category filter** to quickly find products (Ягода/Фрукти, Шоколад, Дубайський, Сиропи, Бар, Розхідники)
- **Option to add new products** if not in catalog
- **Transaction type**: Прихід (incoming) or Списання (outgoing)
- **Price per unit** field for purchase logging
- **Auto-calculated total** (Quantity × Price)
- **Date picker** for recording when transaction occurred

### 2. 📊 Огляд Залишків / Stock Overview Dashboard
- **Current stock levels** for all products in a clean table view
- **Visual indicators**: 
  - 🟢 Green = normal stock
  - 🟡 Yellow = approaching critical level but with margin
  - orange = approaching critical level
  - 🔴 Red = below critical threshold
- **Filter by category** to focus on specific product groups
- **Search** to quickly find specific items

### 3. ⚠️ Сповіщення про Низький Запас / Low Stock Alerts
- **Alert banner** at the top showing items below critical level
- **Count indicator** showing how many items need attention
- **Quick action** to jump to reorder those items

### 4. 📱 Адаптивний Дизайн / Responsive Design
- Works on phones, tablets, and desktop
- Clean white cards with subtle shadows
- Easy-to-tap buttons for mobile use in the field

---

## Структура Сторінки / Page Structure

| Section | Description |
|---------|-------------|
| **Header** | App title + Low Stock Alert indicator |
| **Quick Stats** | Cards showing: Total items, Items below critical, Today's transactions |
| **Data Entry Form** | Main form with all fields in a card |
| **Stock Table** | Searchable/filterable table of current inventory |

---

## Технічні Деталі / Technical Details
- Keeps your **existing Google Sheets + Apps Script** connection
- Product catalog **embedded in app** (from your Excel data)
- All labels and UI in **Ukrainian**
- **No login required** (open access as requested)
- Mobile-friendly responsive layout

---

## Майбутні Можливості (Later) / Future Options
- User authentication via Google Scripts
- Transaction history view
- Export reports
- Charts/analytics
