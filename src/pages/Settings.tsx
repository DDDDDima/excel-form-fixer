import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Settings as SettingsIcon, Database, ExternalLink, ShieldCheck, Info, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { testTelegramConnection } from "../services/googleSheetsApi";
import { toast } from "../hooks/use-toast";
import { cn } from "../lib/utils";

const SettingsPage = () => {
    const [isTesting, setIsTesting] = useState(false);

    // Current script URL - extracted from the service for display
    const scriptUrl = "https://script.google.com/macros/s/AKfycbwk5G9VxjhDTRx-RnQV07kG-njVujHK1KPteR1u0BcHr1Wfunbl0uXHB3qFKTnlEQHM/exec";

    const handleTestConnection = async () => {
        setIsTesting(true);
        try {
            const result = await testTelegramConnection();
            if (result.success) {
                toast({
                    title: "З'єднання успішне!",
                    description: "Тестове повідомлення надіслано в Telegram.",
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Помилка з'єднання",
                    description: result.error || "Не вдалося надіслати повідомлення.",
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Помилка запиту",
                description: "Не вдалося з'єднатися з Google Apps Script.",
            });
        } finally {
            setIsTesting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Налаштування</h1>
                <p className="text-muted-foreground mt-1">Конфігурація системи та технічна інформація</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Connection Settings */}
                <Card className="glass border-white/5">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Database className="h-5 w-5 text-primary" />
                            Підключення до Google Sheets
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-bold">API URL</p>
                            <code className="text-xs break-all text-primary/80">{scriptUrl}</code>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground italic">
                            <ShieldCheck className="h-4 w-4 text-green-400" />
                            З'єднання з базою даних активне
                        </div>
                        <Button variant="outline" className="w-full gap-2" asChild>
                            <a href="https://script.google.com/home" target="_blank" rel="noreferrer">
                                <ExternalLink className="h-4 w-4" />
                                Відкрити Apps Script
                            </a>
                        </Button>
                    </CardContent>
                </Card>

                {/* Telegram Settings */}
                <Card className="glass border-white/5">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Send className="h-5 w-5 text-blue-400" />
                            Параметри Telegram
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Бот Токен</p>
                                <p className="text-xs font-mono truncate text-blue-300">8515588018:AAHAx***I_Q</p>
                            </div>
                            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Chat ID</p>
                                <p className="text-xs font-mono text-blue-300">646188273</p>
                            </div>
                        </div>
                        <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 flex gap-3 text-xs text-blue-200">
                            <Info className="h-4 w-4 shrink-0" />
                            <span>Сповіщення про критичні залишки будуть приходити автоматично. Ці налаштування можна змінити у файлі `StellarCRM-GAS-Backend.js` або на листі "Налаштування" в таблиці.</span>
                        </div>
                        <Button
                            onClick={handleTestConnection}
                            disabled={isTesting}
                            variant="secondary"
                            className="w-full gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border-blue-500/30"
                        >
                            {isTesting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                            {isTesting ? "Перевірка..." : "Перевірити з'єднання"}
                        </Button>
                    </CardContent>
                </Card>

                {/* Project Info */}
                <Card className="glass border-white/5">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Info className="h-5 w-5 text-blue-400" />
                            Про Проект
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-slate-300">
                        <p>
                            <strong className="text-white">Stellar CRM</strong> — це сучасна система управління інвентарем,
                            розроблена для оптимізації роботи з складськими запасами та точками продажу.
                        </p>
                        <div className="space-y-2 pt-2">
                            <div className="flex justify-between py-2 border-b border-white/5">
                                <span className="text-muted-foreground">Версія</span>
                                <span className="font-mono text-white">2.2.0 (Custom backgrounds)</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-white/5">
                                <span className="text-muted-foreground">Статус бази даних</span>
                                <span className="text-green-400">Синхронізовано</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-muted-foreground">Останнє оновлення</span>
                                <span className="text-white">{new Date().toLocaleDateString("uk-UA")}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Background Settings */}
                <Card className="glass border-white/5 lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <SettingsIcon className="h-6 w-6 text-primary" />
                            Налаштування зовнішнього вигляду
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-medium text-white mb-4">Виберіть фонове зображення</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {/* Default Blobs Option */}
                                    <button
                                        onClick={() => {
                                            localStorage.removeItem("app-background");
                                            window.location.reload();
                                        }}
                                        className={cn(
                                            "relative aspect-video rounded-xl overflow-hidden border-2 transition-all group hover:scale-105",
                                            !localStorage.getItem("app-background") ? "border-primary shadow-lg shadow-primary/20" : "border-white/10"
                                        )}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                                            <span className="text-[10px] font-bold uppercase tracking-tight text-white/60">Стандартний</span>
                                        </div>
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold text-xs">
                                            Вибрати
                                        </div>
                                    </button>

                                    {/* Images from public/backgrounds */}
                                    {[1, 2, 3, 4, 5].map((i) => {
                                        const bgName = `bg${i}.jpg`;
                                        const bgPath = `backgrounds/${bgName}`;
                                        const currentSelection = localStorage.getItem("app-background");
                                        const isSelected = currentSelection?.replace(/^\//, '') === bgPath;

                                        return (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    localStorage.setItem("app-background", bgPath);
                                                    window.location.reload();
                                                }}
                                                className={cn(
                                                    "relative aspect-video rounded-xl overflow-hidden border-2 transition-all group hover:scale-105",
                                                    isSelected ? "border-primary shadow-lg shadow-primary/20" : "border-white/10"
                                                )}
                                            >
                                                <img
                                                    src={bgPath}
                                                    alt={`Background ${i}`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop';
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold text-xs">
                                                    Вибрати {i}
                                                </div>
                                                {isSelected && (
                                                    <div className="absolute top-2 right-2 bg-primary rounded-full p-1 shadow-lg">
                                                        <CheckCircle2 className="h-3 w-3 text-white" />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/20 flex gap-3 text-xs text-slate-300">
                                    <Info className="h-4 w-4 shrink-0 text-primary" />
                                    <span>
                                        Щоб додати свої фото, завантажте їх у папку <code>public/backgrounds</code> з назвами <code>bg1.jpg</code>, <code>bg2.jpg</code> і т.д.
                                        Система автоматично підтримує паралакс-ефект та оптимізацію під розмір сторінки.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="glass border-white/5 p-8 text-center">
                <SettingsIcon className="h-12 w-12 text-primary/20 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Додаткові функції скоро...</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                    Ми постійно розвиваємося. У майбутніх оновленнях тут з'являться налаштування
                    сповіщень у Telegram, управління доступом та експорт звітів.
                </p>
            </Card>
        </div>
    );
};

export default SettingsPage;
