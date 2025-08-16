"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { useDataTableInstance } from "@/src/hooks/use-data-table-instance";
import { DataTable as DataTableNew } from "@/src/components/data-table/data-table";
import { DataTablePagination } from "@/src/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/src/components/data-table/data-table-view-options";
import { getMovies, updateMovie } from "@/src/services/movieService";
import { Movie } from "@/types/movie";
import { FaSave } from "react-icons/fa";
import { getStockColumns } from "./columns";

type ChangedProducts = {
    [productId: string]: {
        price?: number;
        quantity?: number;
    };
};

export function StockDataTable({ initialData }: { initialData: any }) {
    const t = useTranslations("Admin.stock");
    const tCommon = useTranslations("Admin.common");

    const [data, setData] = React.useState<Movie[]>(() => initialData?.data?.products || []);
    const [pageCount, setPageCount] = React.useState<number>(initialData?.total_pages || 1);
    const initialRender = React.useRef(true);

    const [changedProducts, setChangedProducts] = React.useState<ChangedProducts>({});

    const handleCellUpdate = (productId: string, field: 'price' | 'quantity', value: string) => {
        const numericValue = parseFloat(value);
        if (isNaN(numericValue)) return;

        setData(currentData =>
            currentData.map(product =>
                product._id === productId ? { ...product, [field]: numericValue } : product
            )
        );

        setChangedProducts(prev => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                [field]: numericValue,
            },
        }));
    };

    const handleBulkUpdate = async () => {
        const promises = Object.entries(changedProducts).map(([productId, changes]) => {
            const formData = new FormData();
            if (changes.price !== undefined) formData.append('price', String(changes.price));
            if (changes.quantity !== undefined) formData.append('quantity', String(changes.quantity));
            return updateMovie(productId, formData);
        });

        try {
            await Promise.all(promises);
            toast.success(`${promises.length} product(s) updated successfully!`);
            setChangedProducts({});
        } catch (error) {
            toast.error("Failed to update some products.");
        }
    };

    const columns = React.useMemo(() => getStockColumns({ handleCellUpdate, changedProducts }), [changedProducts, data]);

    const table = useDataTableInstance({
        data,
        columns,
        getRowId: (row) => row._id,
        pageCount,
    });

    const { pageIndex, pageSize } = table.getState().pagination;

    React.useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }

        const fetchNewData = async () => {
            try {
                const response = await getMovies(null, { page: pageIndex + 1, limit: pageSize });
                const fetchedProducts = response.data.products;

                const mergedData = fetchedProducts.map((product: Movie) => {
                    if (changedProducts[product._id]) {
                        return { ...product, ...changedProducts[product._id] };
                    }
                    return product;
                });

                setData(mergedData);
                setPageCount(response.total_pages);
            } catch (error) {
                toast.error("Failed to fetch products.");
            }
        };

        fetchNewData();
    }, [pageIndex, pageSize]);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button
                        onClick={handleBulkUpdate}
                        disabled={Object.keys(changedProducts).length === 0}
                    >
                        <FaSave className="mr-2 h-4 w-4" />
                        Update Products ({Object.keys(changedProducts).length})
                    </Button>
                </div>
                <DataTableViewOptions table={table} />
            </div>
            <div className="overflow-hidden rounded-lg border">
                <DataTableNew table={table} columns={columns} />
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}