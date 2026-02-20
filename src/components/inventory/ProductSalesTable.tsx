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

interface ProductSalesData {
    name: string;
    price: number;
    quantitySold: number;
    revenue: number;
    cost: number;
    profit: number;
    recipeItems: number;
}

interface ProductSalesTableProps {
    data: ProductSalesData[];
}

export const ProductSalesTable = ({ data }: ProductSalesTableProps) => {
    const [searchTerm, setSearchTerm] = React.useState("");

    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                    placeholder="Пошук товару..."
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
                                <TableHead className="text-right text-white font-bold whitespace-nowrap">Ціна, ₴</TableHead>
                                <TableHead className="text-right text-white font-bold whitespace-nowrap">Продано, шт</TableHead>
                                <TableHead className="text-right text-white font-bold whitespace-nowrap">Виторг, ₴</TableHead>
                                <TableHead className="text-right text-white font-bold whitespace-nowrap">Собівартість, ₴</TableHead>
                                <TableHead className="text-right text-white font-bold whitespace-nowrap">Прибуток, ₴</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        {data.length === 0
                                            ? "Немає даних про продажі товарів за обраний період"
                                            : "Нічого не знайдено"
                                        }
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredData.map((item, index) => (
                                    <TableRow key={index} className="border-white/5 hover:bg-white/5 transition-colors">
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell className="text-right text-muted-foreground">
                                            {item.price > 0 ? item.price.toFixed(2) : "—"}
                                        </TableCell>
                                        <TableCell className="text-right text-blue-400 font-medium">
                                            {item.quantitySold > 0 ? item.quantitySold : "0"}
                                        </TableCell>
                                        <TableCell className="text-right text-green-400 font-medium">
                                            {item.revenue > 0 ? item.revenue.toFixed(2) : "0.00"}
                                        </TableCell>
                                        <TableCell className="text-right text-red-400">
                                            {item.cost > 0 ? item.cost.toFixed(2) : "0.00"}
                                        </TableCell>
                                        <TableCell className={`text-right font-bold ${item.profit >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                                            {item.profit > 0 ? `+${item.profit.toFixed(2)}` : item.profit.toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                            {filteredData.length > 0 && (
                                <TableRow className="border-white/10 bg-white/5 font-bold">
                                    <TableCell className="font-bold text-white">Разом</TableCell>
                                    <TableCell />
                                    <TableCell className="text-right text-blue-300">
                                        {filteredData.reduce((s, d) => s + d.quantitySold, 0)}
                                    </TableCell>
                                    <TableCell className="text-right text-green-300">
                                        {filteredData.reduce((s, d) => s + d.revenue, 0).toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-right text-red-300">
                                        {filteredData.reduce((s, d) => s + d.cost, 0).toFixed(2)}
                                    </TableCell>
                                    <TableCell className={`text-right font-bold ${filteredData.reduce((s, d) => s + d.profit, 0) >= 0 ? 'text-emerald-300' : 'text-red-400'
                                        }`}>
                                        {filteredData.reduce((s, d) => s + d.profit, 0).toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};
