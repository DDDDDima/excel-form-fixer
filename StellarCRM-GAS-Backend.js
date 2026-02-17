/**
 * STELLAR CRM - MASTER SCRIPT (V2 - FIXED MAPPING & RECIPES)
 * 
 * Включає всю логіку проекту:
 * 1. Отримання даних (Склад + Довідник)
 * 2. Процесинг транзакцій (Прихід + Продаж)
 * 3. Автоматичне оновлення залишків
 * 4. СПИСАННЯ ЗА РЕЦЕПТАМИ (Калькуляція)
 * 5. ТЕЛЕГРАМ СПОВІЩЕННЯ ПРО НИЗЬКИЙ ЗАПАС
 */

const SS = SpreadsheetApp.getActiveSpreadsheet();
const TABS = {
    STOCK: 'Склад',
    DIRECTORY: 'Довідник',
    SALES: 'Продажі',
    PURCHASES: 'Закупівлі',
    ARRIVALS: 'Прихід_форми',
    RECIPES: 'Калькуляція',
    CONFIG: 'Налаштування'
};

const TELEGRAM_CONFIG = {
    TOKEN: '8515588018:AAHAxJc2azgIqXrouKV-x5pkLY0wEt0pI_Q',
    CHAT_ID: '646188273'
};

function doGet(e) {
    const action = e.parameter.action || 'getInventory';
    try {
        if (action === 'getInventory') {
            return contentResponse(fetchInventoryData());
        }
    } catch (err) {
        return contentResponse({ error: err.toString() });
    }
}

function doPost(e) {
    try {
        const data = JSON.parse(e.postData.contents);
        const result = processTransaction(data);
        return contentResponse(result);
    } catch (err) {
        return contentResponse({ error: err.toString() });
    }
}

function contentResponse(data) {
    return ContentService.createTextOutput(JSON.stringify(data))
        .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 1. ОТРИМАННЯ ДАНИХ
 */
function fetchInventoryData() {
    const stockSheet = SS.getSheetByName(TABS.STOCK);
    const dirSheet = SS.getSheetByName(TABS.DIRECTORY);
    const arrivalSheet = SS.getSheetByName(TABS.ARRIVALS);

    if (!stockSheet) throw new Error("Аркуш '" + TABS.STOCK + "' не знайдено!");
    if (!arrivalSheet) throw new Error("Аркуш '" + TABS.ARRIVALS + "' не знайдено!");

    const stockData = stockSheet.getDataRange().getValues();
    const products = mapStockData(stockData);

    let directory = [];
    if (dirSheet) {
        directory = mapDirData(dirSheet.getDataRange().getValues());
    }

    // Додаємо список товарів для продажу з Прихід_форми!L2:L100
    const lRangeData = arrivalSheet.getRange("L2:L100").getValues();
    const salesProducts = lRangeData.flat()
        .filter(name => name && name.toString().trim() !== "")
        .map(name => ({
            name: name.toString().trim(),
            category: "готовий товар",
            unit: "шт"
        }));

    // Отримуємо історію операцій з Прихід_форми
    const arrivalData = arrivalSheet.getDataRange().getValues();
    const transactions = mapTransactionsFromArrivals(arrivalData);

    return {
        products: products,
        directory: directory,
        transactions: transactions,
        salesProducts: salesProducts
    };
}

/**
 * 2. ОБРОБКА ТРАНЗАКЦІЙ (ЦЕНТРАЛІЗОВАНО)
 */
function processTransaction(transaction) {
    const sheet = SS.getSheetByName(TABS.ARRIVALS);
    if (!sheet) return { success: false, message: 'Аркуш Прихід_форми не знайдено' };

    let { type, item, category, quantity, pricePerUnit, total, date } = transaction;

    // Спеціальна логіка для Продажу
    if (type === 'Продаж') {
        category = "готовий товар";
        // Списання інгредієнтів за рецептом (Калькуляція)
        writeOffIngredients(item, quantity);
    } else {
        // Для Приходу або Списання інгредієнтів оновлюємо склад прямо
        const change = (type === 'Прихід' || type === 'arrival') ? quantity : -quantity;
        updateStock(item, change);
    }

    // Визначаємо наступний вільний рядок на основі Колонки А (Дата)
    // Це запобігає стрибкам, якщо заповнені Колонки L
    const lastRow = getLastRowByColumn(sheet, 1);
    const nextRow = lastRow + 1;
    const dateObj = new Date(date);

    // Записуємо операцію в єдиний журнал (Прихід_форми)
    // Структура: Дата(1), Товар(2), Категорія(3), Кількість(4), Ціна(5), Сума(6), ТИП(7)
    sheet.getRange(nextRow, 1, 1, 7).setValues([[
        dateObj,
        item,
        category,
        quantity,
        pricePerUnit || 0,
        total || 0,
        type || "Прихід"
    ]]);

    // ДОДАТКОВА ЛОГІКА: Відправка в спеціалізовані листи
    if (type === 'Прихід') {
        const purchaseSheet = SS.getSheetByName(TABS.PURCHASES);
        if (purchaseSheet) {
            // Закупівлі: Дата, Категорія, Товар, Кількість, Од. виміру, Ціна за од., Сума
            purchaseSheet.appendRow([
                dateObj,
                category,
                item,
                quantity,
                transaction.unit || "",
                pricePerUnit || 0,
                total || 0
            ]);
        }
    } else if (type === 'Продаж') {
        const salesSheet = SS.getSheetByName(TABS.SALES);
        if (salesSheet) {
            // Форматування часу: HH:mm:ss
            const timeStr = Utilities.formatDate(dateObj, Session.getScriptTimeZone(), "HH:mm:ss");
            // Продажі: Дата, Час, Товар, Кількість порцій, Ціна за порцію, Загальний виторг
            salesSheet.appendRow([
                dateObj,
                timeStr,
                item,
                quantity,
                pricePerUnit || 0,
                total || 0
            ]);
        }
    }

    return { success: true };
}

/**
 * 3. ЛОГІКА СПИСАННЯ ТА ОНОВЛЕННЯ ЗАЛИШКІВ
 */
function updateStock(itemName, change) {
    if (!itemName) return;
    const sheet = SS.getSheetByName(TABS.STOCK);
    const data = sheet.getDataRange().getValues();

    const searchName = itemName.toString().trim().toLowerCase();

    for (let i = 1; i < data.length; i++) {
        const sheetName = data[i][0] ? data[i][0].toString().trim().toLowerCase() : "";
        if (sheetName === searchName) {
            const current = parseFloat(data[i][4]) || 0;
            const critical = getCriticalLevel(itemName);
            const newStock = current + change;

            sheet.getRange(i + 1, 5).setValue(newStock);

            // Перевірка на критичний рівень та відправка в Telegram
            if (newStock <= critical && current > critical) {
                const config = getTelegramConfig();
                if (config.token && config.chatId) {
                    const message = "⚠️ *Увага! Низький запас*\n\n" +
                        "Товар: *" + itemName + "*\n" +
                        "Залишок: `" + newStock + "`\n" +
                        "Критичний рівень: `" + critical + "`";
                    sendTelegramMessage(message, config);
                }
            }
            return true;
        }
    }
    console.warn("Товар не знайдено на складі: " + itemName);
    return false;
}

function getCriticalLevel(itemName) {
    const dirSheet = SS.getSheetByName(TABS.DIRECTORY);
    if (!dirSheet) return 0;
    const data = dirSheet.getDataRange().getValues();
    const searchName = itemName.toString().trim().toLowerCase();

    // Довідник: Категорія(0), Назва(1), Од.вим(2), Крит.рівень(3)
    for (let i = 1; i < data.length; i++) {
        const name = data[i][1] ? data[i][1].toString().trim().toLowerCase() : "";
        if (name === searchName) {
            return parseFloat(data[i][3]) || 0;
        }
    }
    return 0;
}

function getTelegramConfig() {
    const sheet = SS.getSheetByName(TABS.CONFIG);
    if (sheet) {
        const data = sheet.getDataRange().getValues();
        let token = TELEGRAM_CONFIG.TOKEN;
        let chatId = TELEGRAM_CONFIG.CHAT_ID;

        for (let i = 0; i < data.length; i++) {
            if (data[i][0] === 'Telegram Token') token = data[i][1];
            if (data[i][0] === 'Telegram Chat ID') chatId = data[i][1];
        }
        return { token, chatId };
    }
    return { token: TELEGRAM_CONFIG.TOKEN, chatId: TELEGRAM_CONFIG.CHAT_ID };
}

function sendTelegramMessage(text, config) {
    const url = "https://api.telegram.org/bot" + config.token + "/sendMessage";
    const payload = {
        "chat_id": config.chatId,
        "text": text,
        "parse_mode": "Markdown"
    };

    const options = {
        "method": "post",
        "contentType": "application/json",
        "payload": JSON.stringify(payload),
        "muteHttpExceptions": true
    };

    try {
        UrlFetchApp.fetch(url, options);
    } catch (e) {
        console.error("Помилка відправки в Telegram: " + e.toString());
    }
}

function writeOffIngredients(productName, quantitySold) {
    const recipeSheet = SS.getSheetByName(TABS.RECIPES);
    if (!recipeSheet) {
        console.error("Аркуш Калькуляція не знайдено");
        return;
    }

    const data = recipeSheet.getDataRange().getValues();
    const searchProduct = productName.toString().trim().toLowerCase();
    let recipeFound = false;

    // Калькуляція: Готовий продукт(0), Інгредієнт(1), Кількість(2), Од.вим(3)
    for (let i = 1; i < data.length; i++) {
        const dishName = data[i][0] ? data[i][0].toString().trim().toLowerCase() : "";
        if (dishName === searchProduct) {
            recipeFound = true;
            const ingredientName = data[i][1];
            const amountPerUnit = parseFloat(data[i][2]);

            if (ingredientName && !isNaN(amountPerUnit)) {
                const totalChange = -(amountPerUnit * quantitySold);
                updateStock(ingredientName, totalChange);
                console.log("Списано інгредієнт: " + ingredientName + " (" + totalChange + ")");
            }
        }
    }

    if (!recipeFound) {
        console.warn("Рецепт для '" + productName + "' не знайдено в Калькуляції");
    }
}

/**
 * 4. МАПІНГ ДАНИХ
 */
function mapStockData(data) {
    // Склад: Назва(0), Одиниця(1), Закуплено(2), Витрачено(3), Поточний(4)
    return data.slice(1).map(row => {
        const name = row[0] ? row[0].toString().trim() : "";
        return {
            name: name,
            category: "Запас",
            unit: row[1] ? row[1].toString().trim() : "",
            criticalLevel: getCriticalLevel(name),
            currentStock: parseFloat(row[4]) || 0
        };
    }).filter(p => p.name && p.name !== "");
}

function mapDirData(data) {
    // Довідник: Категорія(0), Назва(1), Од.вим(2), Крит.рівень(3)
    return data.slice(1).map(row => ({
        category: row[0] ? row[0].toString().trim() : "Інше",
        name: row[1] ? row[1].toString().trim() : "",
        unit: row[2] ? row[2].toString().trim() : "",
        criticalLevel: parseFloat(row[3]) || 0
    })).filter(d => d.name && d.name !== "");
}

function mapTransactionsFromArrivals(data) {
    // Прихід_форми: Дата(0), Товар(1), Категорія(2), Кількість(3), Ціна(4), Сума(5), ТИП(6)
    return data.slice(1).map((row, index) => ({
        id: "tx-" + index,
        date: row[0],
        item: row[1] ? row[1].toString().trim() : "",
        productName: row[1] ? row[1].toString().trim() : "",
        category: row[2] ? row[2].toString().trim() : "",
        quantity: parseFloat(row[3]) || 0,
        unit: "од",
        type: row[6] || "Прихід",
        pricePerUnit: parseFloat(row[4]) || 0,
        total: parseFloat(row[5]) || 0
    })).filter(t => t.date && t.item !== "").reverse();
}

/**
 * Допоміжна функція пошуку останнього рядка по конкретній колонці
 */
function getLastRowByColumn(sheet, columnNumber) {
    const data = sheet.getRange(1, columnNumber, sheet.getLastRow(), 1).getValues();
    for (let i = data.length - 1; i >= 0; i--) {
        if (data[i][0] !== "" && data[i][0] !== null) {
            return i + 1;
        }
    }
    return 0;
}
