'use client';

import { useMemo, useState, useEffect } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Eye, Edit, Trash2 } from 'lucide-react';
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
import Loading from '../loading/Loading';
import { useModuleStore } from '@/stores/useModulStore';
import { useFilterStore } from '@/stores/FilterStore';

export type Modul = {
  id: number;
  intitule: string;
  etat: number;
  listDroit: {
    id: number;
    module: string;
    codeDroit: string;
    intitule: string;
  }[];
  dateCreat: string;
  fkUtilisateurCreat: number;
};

const columnHelper = createColumnHelper<Modul>();

export default function DatatableModul() {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const { modules, fetchModules } = useModuleStore();
  const { search, etatFilter, setSearch, setEtatFilter } = useFilterStore();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchModules();
      setLoading(false);
    };
    load();
  }, [fetchModules]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, etatFilter]);

  const filteredData = useMemo(() => {
    if (!modules || modules.length === 0) return [];
    const lowerSearch = search.toLowerCase();

    return modules.filter(mod => {
      const intitule = String(mod.intitule ?? '').toLowerCase();
      const matchesSearch = !search || intitule.includes(lowerSearch);
      const matchesEtat =
        etatFilter === 'tous' || String(mod.etat) === etatFilter;
      return matchesSearch && matchesEtat;
    });
  }, [modules, search, etatFilter]);

  const lastPage = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: '#',
        cell: info => <span>{info.row.index + 1}</span>,
      }),
      columnHelper.accessor('intitule', {
        header: 'Module',
        cell: info => <span className='font-semibold'>{info.getValue()}</span>,
      }),
      columnHelper.accessor('etat', {
        header: 'État',
        cell: info => {
          const etat = info.getValue();
          const color =
            etat === 1
              ? 'bg-green-100 text-green-700'
              : etat === 0
                ? 'bg-red-100 text-red-700'
                : 'bg-yellow-100 text-yellow-700';
          const label =
            etat === 1 ? 'Actif' : etat === 0 ? 'Inactif' : 'En attente';
          return (
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}
            >
              {label}
            </span>
          );
        },
      }),
      columnHelper.accessor('listDroit', {
        header: 'Droits',
        cell: info => (
          <ul className='text-xs'>
            {info.getValue().map(d => (
              <li key={d.id}>
                {d.codeDroit} - {d.intitule}
              </li>
            ))}
          </ul>
        ),
      }),

      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: info => (
          <div className='flex gap-2'>
            <Button asChild size='sm' variant='outline'>
              <Link to={`/dashboard/modules/${info.row.original.id}`}>
                <Eye className='h-4 w-4' />
              </Link>
            </Button>
            <Button
              size='sm'
              variant='outline'
              className='text-blue-600 hover:bg-blue-50 bg-transparent'
            >
              <Edit className='h-4 w-4' />
            </Button>
            <Button
              size='sm'
              variant='outline'
              className='text-red-600 hover:bg-red-50 bg-transparent'
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </div>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            Liste des modules
          </h2>
          <p className='text-muted-foreground'>
            Gérez les modules et leurs droits
          </p>
        </div>
        <Button className='bg-primary text-white hover:bg-primary/90'>
          Créer un module
        </Button>
      </div>

      <div className='flex flex-col md:flex-row gap-4 mb-4 items-start md:items-center'>
        <input
          type='text'
          placeholder='Recherche...'
          value={search}
          onChange={e => setSearch(e.target.value)}
          className='w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all'
        />
        <select
          value={etatFilter}
          onChange={e => setEtatFilter(e.target.value)}
          className='w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all'
        >
          <option value='tous'>Tous</option>
          <option value='1'>Actif</option>
          <option value='0'>Inactif</option>
          <option value='2'>En attente</option>
        </select>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className='rounded-md border shadow-sm overflow-x-auto'>
          <Table>
            <TableHeader className='bg-primary text-white'>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead
                      key={header.id}
                      className='text-left px-4 py-2 text-white'
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
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map(row => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id} className='px-4 py-2 border-b'>
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
                    colSpan={columns.length}
                    className='h-24 text-center text-gray-500'
                  >
                    Aucun module trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <div className='flex justify-center mt-6 gap-2 flex-wrap'>
        <button
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className='px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50'
        >
          Précédent
        </button>
        {[...Array(lastPage)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === index + 1
                ? 'bg-blue-600 text-white shadow'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(p => Math.min(p + 1, lastPage))}
          disabled={currentPage === lastPage}
          className='px-3 py-1 bg-gray-200 rounded hover:bg-gray-300'
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
