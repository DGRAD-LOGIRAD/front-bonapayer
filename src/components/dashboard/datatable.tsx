'use client';

import { useMemo, useState, useEffect } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePrefetchBonAPayer } from '@/hooks/useBonAPayer';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export type BonAPayerSummary = {
  id: number;
  etat: number;
  numero: string;
  motif: string;
  montant: number;
  devise: string;
  createdAt: string;
  assujetti: {
    nom_ou_raison_sociale: string;
    NIF: string;
  };
  centre: {
    nom: string;
    ville: {
      nom: string;
      province: {
        nom: string;
      };
    };
  };
};

interface DatatableProps {
  data?: BonAPayerSummary[];
  globalFilter?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

const columnHelper = createColumnHelper<BonAPayerSummary>();

function Datatable({
  data = [],
  globalFilter = '',
  title = '',
  description = '',
  ctaLabel = 'Fractionner un bon à payer',
  ctaHref = '/dashboard/bon-a-payers/creer',
}: DatatableProps) {
  const prefetchBonAPayer = usePrefetchBonAPayer();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [pageInput, setPageInput] = useState('');

  const globalFilterFn = useMemo(
    () => (row: { original: BonAPayerSummary }, _columnId: string, filterValue: string) => {
      if (!filterValue || !filterValue.trim()) return true;

      const searchLower = filterValue.toLowerCase().trim();
      const item = row.original;

      const searchableFields = [
        item.numero,
        item.assujetti?.NIF,
        item.assujetti?.nom_ou_raison_sociale,
        item.motif,
        item.centre?.nom,
        item.centre?.ville?.nom,
        item.centre?.ville?.province?.nom,
      ];

      return searchableFields.some(field =>
        field?.toLowerCase().includes(searchLower)
      );
    },
    []
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor('numero', {
        header: 'Numéro',
        cell: info => <div className='font-medium'>{info.getValue()}</div>,
      }),
      columnHelper.accessor('motif', {
        header: 'Motif',
        cell: info => (
          <div className='max-w-[200px] text-wrap'>{info.getValue()}</div>
        ),
      }),
      columnHelper.accessor('assujetti', {
        header: 'Assujetti',
        cell: info => {
          const assujetti = info.getValue();
          return (
            <div className='space-y-1'>
              <div className='font-medium text-wrap'>
                {assujetti.nom_ou_raison_sociale}
              </div>
              <div className='text-sm text-muted-foreground text-wrap'>
                NIF: {assujetti.NIF}
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor('montant', {
        header: 'Montant',
        cell: info => {
          const row = info.row.original;
          return (
            <div className='text-right'>
              <div className='font-medium'>
                {row.montant.toLocaleString('fr-FR')} {row.devise}
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor('centre', {
        header: 'Site',
        cell: info => {
          const centre = info.row.original.centre;
          return (
            <div className='space-y-1'>
              <div className='font-medium text-wrap text-sm'>
                {' '}
                <span className='font-normal'>{centre?.nom}</span>
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor('createdAt', {
        header: 'Date de création',
        cell: info => <div className='text-wrap'>{info.getValue()}</div>,
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Action',
        cell: info => (
          <Button
            asChild
            variant='outline'
            size='sm'
            className='text-wrap whitespace-nowrap'
          >
            <Link
              to={`/dashboard/bon-a-payers/${info.row.original.id}`}
              onMouseEnter={() => prefetchBonAPayer(info.row.original.id)}
            >
              <Eye className='h-4 w-4 mr-2' />
              Voir plus
            </Link>
          </Button>
        ),
      }),
    ],
    [prefetchBonAPayer]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: globalFilterFn,
    enableGlobalFilter: true,
    onPaginationChange: setPagination,
    manualPagination: false,
    pageCount: undefined,
    state: {
      pagination,
      globalFilter,
    },
  });

  useEffect(() => {
    if (globalFilter !== undefined) {
      table.setPageIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalFilter]);

  const handlePageInputChange = (value: string) => {
    setPageInput(value);
  };

  const handlePageInputSubmit = () => {
    const page = parseInt(pageInput);
    if (page >= 1 && page <= table.getPageCount()) {
      table.setPageIndex(page - 1);
      setPageInput('');
    }
  };

  const handlePageSizeChange = (value: string) => {
    const newPageSize = Number(value);
    table.setPageSize(newPageSize);
    table.setPageIndex(0);
  };

  return (
    <div className='space-y-4'>
      {(title || ctaLabel) && (
        <div className='flex items-center justify-between'>
          {title && (
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>{title}</h2>
              {description && (
                <p className='text-muted-foreground'>{description}</p>
              )}
            </div>
          )}
          {ctaLabel && (
            <Button asChild>
              <Link to={ctaHref}>{ctaLabel}</Link>
            </Button>
          )}
        </div>
      )}

      <div className='rounded-md border-2 border-primary/60 shadow-xl backdrop-blur-xl bg-white/70 relative overflow-hidden'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow
                key={headerGroup.id}
                className='bg-primary/90 backdrop-blur-sm text-primary-foreground hover:bg-primary'
              >
                {headerGroup.headers.map(header => (
                  <TableHead
                    key={header.id}
                    className='text-primary-foreground border-r border-primary-foreground/20 last:border-r-0 py-3 px-4'
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getPaginationRowModel().rows?.length ? (
              table.getPaginationRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className='border-b border-primary/20 hover:bg-primary/5 transition-colors'
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell
                      key={cell.id}
                      className='border-r border-primary/10 last:border-r-0 py-2.5 px-4'
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns?.length}
                  className='h-24 text-center'
                >
                  Aucun bon à payer trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2 py-4'>
        <div className='flex items-center gap-2'>
          <span className='text-sm text-muted-foreground'>Afficher</span>
          <Select
            value={String(pagination.pageSize)}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='5'>5</SelectItem>
              <SelectItem value='10'>10</SelectItem>
              <SelectItem value='25'>25</SelectItem>
              <SelectItem value='50'>50</SelectItem>
              <SelectItem value='100'>100</SelectItem>
            </SelectContent>
          </Select>
          <span className='text-sm text-muted-foreground'>par page</span>
          <span className='text-sm text-muted-foreground ml-4'>
            {table.getFilteredRowModel().rows.length} résultat(s)
          </span>
        </div>

        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            title='Première page'
          >
            <ChevronsLeft className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            title='Page précédente'
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>

          <div className='flex items-center gap-2'>
            <span className='text-sm text-muted-foreground'>Page</span>
            <Input
              type='number'
              min={1}
              max={table.getPageCount()}
              value={pageInput}
              onChange={e => handlePageInputChange(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handlePageInputSubmit();
                }
              }}
              placeholder={String(table.getState().pagination.pageIndex + 1)}
              className='h-8 w-16 text-center'
            />
            <span className='text-sm text-muted-foreground'>
              sur {table.getPageCount() || 1}
            </span>
          </div>

          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            title='Page suivante'
          >
            <ChevronRight className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            title='Dernière page'
          >
            <ChevronsRight className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Datatable;
