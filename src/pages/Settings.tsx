import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Settings as SettingsIcon, Database, ExternalLink, ShieldCheck, Info, Send } from "lucide-react";
import { Button } from "../components/ui/button";

const SettingsPage = () => {
    // Current script URL - extracted from the service for display
    const scriptUrl = "https://script.google.com/macros/s/AKfycbxFia3oZXz58Y6cZeKK0HrskasRuB1cwIGGmymndLTBrn_5NWSp0wBTuLvO6vQNdpGL/exec";

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
                                <span className="font-mono text-white">2.1.0 (Fixed Routing)</span>
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
