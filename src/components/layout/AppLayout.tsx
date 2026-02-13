import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    Box,
    Repeat,
    BookOpen,
    BarChart3,
    Menu,
    X,
    Settings,
    ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BackgroundBlobs } from "./BackgroundBlobs";

interface NavItemProps {
    to: string;
    icon: React.ElementType;
    label: string;
    active: boolean;
    onClick?: () => void;
}

const NavItem = ({ to, icon: Icon, label, active, onClick }: NavItemProps) => (
    <Link
        to={to}
        onClick={onClick}
        className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
            active
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-primary/80"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
    >
        <Icon className={cn("h-5 w-5 transition-transform duration-200 group-hover:scale-110", active ? "text-primary-foreground" : "text-muted-foreground")} />
        <span className="font-medium">{label}</span>
        {active && <ChevronRight className="ml-auto h-4 w-4" />}
    </Link>
);

const SidebarContent = ({ activePath, onItemClick }: { activePath: string; onItemClick?: () => void }) => (
    <div className="flex flex-col h-full glass border-r-0 lg:border-r">
        <div className="p-6">
            <div className="flex items-center gap-3 mb-10">
                <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/40">
                    <span className="text-2xl">🍓</span>
                </div>
                <div>
                    <h2 className="font-black text-foreground tracking-tighter text-xl italic uppercase">Stellar</h2>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold opacity-70">Inventory</p>
                </div>
            </div>

            <nav className="space-y-2">
                <NavItem
                    to="/"
                    icon={Box}
                    label="Склад"
                    active={activePath === "/"}
                    onClick={onItemClick}
                />
                <NavItem
                    to="/transactions"
                    icon={Repeat}
                    label="Операції"
                    active={activePath === "/transactions"}
                    onClick={onItemClick}
                />
                <NavItem
                    to="/directory"
                    icon={BookOpen}
                    label="Довідник"
                    active={activePath === "/directory"}
                    onClick={onItemClick}
                />
                <NavItem
                    to="/analytics"
                    icon={BarChart3}
                    label="Аналітика"
                    active={activePath === "/analytics"}
                    onClick={onItemClick}
                />
            </nav>
        </div>

        <div className="mt-auto p-6 border-t bg-muted/20">
            <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground" asChild>
                <Link to="/settings">
                    <Settings className="h-5 w-5" />
                    <span>Налаштування</span>
                </Link>
            </Button>
        </div>
    </div>
);

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    const [open, setOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#0a0a0b] text-slate-200 font-sans antialiased selection:bg-primary/30">
            <BackgroundBlobs />
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-72 sticky top-0 h-screen">
                <SidebarContent activePath={location.pathname} />
            </aside>

            {/* Mobile Header & Sidebar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xl">🍓</span>
                    <span className="font-bold">Stellar</span>
                </div>
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-72">
                        <SidebarContent
                            activePath={location.pathname}
                            onItemClick={() => setOpen(false)}
                        />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main Content */}
            <main className="flex-1 w-full lg:max-w-[calc(100vw-18rem)] pt-16 lg:pt-0">
                <div className="p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
};
