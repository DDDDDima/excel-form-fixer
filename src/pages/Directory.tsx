import { useInventory } from "@/hooks/useInventory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, AlertTriangle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Directory = () => {
    const { products, isLoading } = useInventory();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Довідник</h1>
                    <p className="text-muted-foreground mt-1">
                        Перелік інгредієнтів та налаштування критичних рівнів
                    </p>
                </div>
                <Badge variant="outline" className="px-3 py-1 border-primary/30 text-primary">
                    {products.length} позицій
                </Badge>
            </div>

            <Card className="shadow-sm border-0 overflow-hidden glass">
                <CardHeader className="bg-white/5 border-b border-white/5">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        База інгредієнтів
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-12 text-center text-muted-foreground animate-pulse">
                            Завантаження довідника...
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-white/5">
                                    <TableHead className="w-[300px]">Назва товару</TableHead>
                                    <TableHead>Категорія</TableHead>
                                    <TableHead>Од. вим.</TableHead>
                                    <TableHead className="text-right">Крит. рівень</TableHead>
                                    <TableHead className="w-[100px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product.id} className="group hover:bg-white/5 transition-colors border-white/5">
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell>
                                            <div className="inline-flex items-center rounded-full border border-white/10 px-2.5 py-0.5 text-xs font-semibold bg-white/5 text-primary">
                                                {product.category}
                                            </div>
                                        </TableCell>
                                        <TableCell>{product.unit}</TableCell>
                                        <TableCell className="text-right font-mono">
                                            {product.criticalLevel}
                                        </TableCell>
                                        <TableCell>
                                            {product.currentStock <= product.criticalLevel && (
                                                <div className="flex justify-end">
                                                    <AlertTriangle className="h-4 w-4 text-destructive" />
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-primary/5 border-primary/10 shadow-none">
                    <CardContent className="pt-6 flex gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Info className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="font-semibold text-primary">Порада</p>
                            <p className="text-sm text-primary/80">
                                Критичний рівень визначає, коли товар підсвічується червоним у залишках.
                                Регулярно оновлюйте ці значення в Google Sheets (вкладка "Довідник").
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Directory;
