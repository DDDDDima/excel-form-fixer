import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { Badge } from "../ui/badge";

interface TurnoverData {
    name: string;
    category: string;
    receipts: number;
    sales: number;
    losses: number;
    netChange: number;
    currentStock: number;
    unit: string;
}

interface AnalyticsTableProps {
    data: TurnoverData[];
}

export const AnalyticsTable = ({ data }: AnalyticsTableProps) => {
    const [searchTerm, setSearchTerm] = React.useState("");

    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                    placeholder="Пошук товару або категорії..."
                    className="pl-10 bg-white/5 border-white/10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="rounded-xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-white/5">
                            <TableRow className="border-white/5 hover:bg-transparent">
                                <TableHead className="text-white font-bold whitespace-nowrap">Товар</TableHead>
                                <TableHead className="text-white font-bold whitespace-nowrap">Категорія</TableHead>
                                <TableHead className="text-right text-white font-bold whitespace-nowrap">Прихід (+)</TableHead>
                                <TableHead className="text-right text-white font-bold whitespace-nowrap">Продаж (-)</TableHead>
                                <TableHead className="text-right text-white font-bold whitespace-nowrap">Списання (-)</TableHead>
                                <TableHead className="text-right text-white font-bold whitespace-nowrap">Нетто</TableHead>
                                <TableHead className="text-right text-white font-bold whitespace-nowrap">Залишок</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        Даних не знайдено
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredData.map((item, index) => (
                                    <TableRow key={index} className="border-white/5 hover:bg-white/5 transition-colors">
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-primary/5 text-primary-foreground border-primary/20">
                                                {item.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right text-green-400">
                                            {item.receipts > 0 ? `+${item.receipts.toFixed(1)}` : "0"} {item.unit}
                                        </TableCell>
                                        <TableCell className="text-right text-red-400">
                                            {item.sales > 0 ? `-${item.sales.toFixed(1)}` : "0"} {item.unit}
                                        </TableCell>
                                        <TableCell className="text-right text-orange-400">
                                            {item.losses > 0 ? `-${item.losses.toFixed(1)}` : "0"} {item.unit}
                                        </TableCell>
                                        <TableCell className={`text-right font-bold ${item.netChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {item.netChange > 0 ? `+${item.netChange.toFixed(1)}` : item.netChange.toFixed(1)}
                                        </TableCell>
                                        <TableCell className="text-right font-mono">{item.currentStock.toFixed(1)} {item.unit}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};
