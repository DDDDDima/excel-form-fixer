import React from "react";
import { GOOGLE_SCRIPT_URL } from "../services/googleSheetsApi";

const POS = () => {
    const posUrl = `${GOOGLE_SCRIPT_URL}?page=pos`;

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] lg:h-[calc(100vh-64px)] w-full">
            <div className="mb-6">
                <h1 className="text-3xl font-black text-foreground tracking-tighter italic uppercase">
                    POS Термінал
                </h1>
                <p className="text-muted-foreground">Інтерфейс швидких продажів</p>
            </div>

            <div className="flex-1 w-full bg-card rounded-3xl overflow-hidden border shadow-2xl relative">
                <iframe
                    src={posUrl}
                    className="absolute inset-0 w-full h-full border-none"
                    title="Stellar POS"
                    allow="cross-origin-isolated"
                />
            </div>
        </div>
    );
};

export default POS;
