'use client';

import { useMemo } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
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
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

const columnHelper = createColumnHelper<BonAPayerSummary>();

function Datatable({
  data = [],
  title = 'Derniers bons à payer',
  description = 'Les 10 derniers bons à payer enregistrés dans le système',
  ctaLabel = 'Fractionner un bon à payer',
  ctaHref = '/dashboard/bon-a-payers/creer',
}: DatatableProps) {
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
              <div className='font-medium text-wrap text-sm'> <span className='font-normal'>{centre?.nom}</span></div>

            </div>
          );
        },
      }),
      columnHelper.accessor('createdAt', {
        header: 'Date de création',
        cell: info => (
          <div className='text-wrap'>{(info.getValue())}</div>
        ),
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
            <Link to={`/dashboard/bon-a-payers/${info.row.original.id}`}>
              <Eye className='h-4 w-4 mr-2' />
              Voir plus
            </Link>
          </Button>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>{title}</h2>
          <p className='text-muted-foreground'>{description}</p>
        </div>
        <Button asChild>
          <Link to={ctaHref}>{ctaLabel}</Link>
        </Button>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow
                key={headerGroup.id}
                className='bg-primary text-primary-foreground hover:bg-primary/90'
              >
                {headerGroup.headers.map(header => (
                  <TableHead
                    key={header.id}
                    className='text-primary-foreground border-r border-primary-foreground/20 last:border-r-0'
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className='border-b hover:bg-muted/50'
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell
                      key={cell.id}
                      className='border-r last:border-r-0'
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
    </div>
  );
}

export default Datatable;
