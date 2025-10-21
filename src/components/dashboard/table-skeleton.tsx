import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface TableSkeletonProps {
    rows?: number;
    columns?: number;
}

function TableSkeleton({ rows = 5, columns = 7 }: TableSkeletonProps) {
    return (
        <div className='space-y-4'>
            <div className='flex items-center justify-between'>
                <div className='space-y-2'>
                    <Skeleton className='h-8 w-64' />
                    <Skeleton className='h-4 w-96' />
                </div>
                <Skeleton className='h-10 w-48' />
            </div>

            <div className='rounded-md border'>
                <Table>
                    <TableHeader>
                        <TableRow className='bg-primary text-primary-foreground hover:bg-primary/90'>
                            {Array.from({ length: columns }).map((_, index) => (
                                <TableHead
                                    key={index}
                                    className='text-primary-foreground border-r border-primary-foreground/20 last:border-r-0'
                                >
                                    <Skeleton className='h-4 w-20' />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: rows }).map((_, rowIndex) => (
                            <TableRow
                                key={rowIndex}
                                className='border-b hover:bg-muted/50'
                            >
                                {Array.from({ length: columns }).map((_, colIndex) => (
                                    <TableCell
                                        key={colIndex}
                                        className='border-r last:border-r-0'
                                    >
                                        <div className='space-y-2'>
                                            <Skeleton className='h-4 w-full' />
                                            {colIndex === 2 && <Skeleton className='h-3 w-24' />}
                                            {colIndex === 4 && <Skeleton className='h-3 w-32' />}
                                        </div>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default TableSkeleton;
