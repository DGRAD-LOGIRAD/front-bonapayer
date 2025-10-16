'use client'

import { useMemo, useState, useEffect } from 'react'
import axios from 'axios'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Eye, Edit, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import UserModal from '../modal/UserModal'
import { getBaseUrl } from '../api/api'
import Loading from '../loading/Loading'

export type Utilisateur = {
  id: number
  nom: string
  prenom: string
  email: string
  etat: number
  creation: string
}

export default function DataTableUser() {
  const [data, setData] = useState<Utilisateur[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)

  const openModal = () => setIsModalVisible(true)
  const closeModal = () => setIsModalVisible(false)

  // 🔹 Récupération des utilisateurs
  useEffect(() => {
    setLoading(true)
    axios
      .get(`${getBaseUrl()}/api-utilisateur/v1/getAllUtilisateur`, {
        headers: { Authorization: 'Bearer 123' },
      })
    .then((res) => {
  const utilisateurs = res.data.content.map((u: Utilisateur) => ({
    id: u.id,
    nom: u.nom,
    prenom: u.prenom,
    email: u.email,
    etat: u.etat,
    creation: new Date().toISOString(),
  }))
  setData(utilisateurs)
})

      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  // 🔹 Pagination logique
  const lastPage = Math.ceil(data.length / itemsPerPage)
  const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const columnHelper = createColumnHelper<Utilisateur>()
  const columns = useMemo(
    () => [
      columnHelper.accessor('nom', {
        header: 'Nom',
        cell: (info) => <span className="font-semibold">{info.getValue()}</span>,
      }),
      columnHelper.accessor('prenom', {
        header: 'Prénom',
        cell: (info) => <span>{info.getValue()}</span>,
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: (info) => (
          <span className="text-blue-600 dark:text-blue-400">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor('etat', {
        header: 'État',
        cell: (info) => {
          const etat = info.getValue()
          let color = ''
          let label = ''
          if (etat === 1) {
            color = 'bg-green-100 text-green-700'
            label = 'Actif'
          } else if (etat === 0) {
            color = 'bg-red-100 text-red-700'
            label = 'Inactif'
          } else {
            color = 'bg-yellow-100 text-yellow-700'
            label = 'En attente de validation'
          }

          return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>
              {label}
            </span>
          )
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => (
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline">
              <Link to={`/dashboard/utilisateurs/${info.row.original.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="sm" variant="outline" className="text-blue-600 hover:bg-blue-50">
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      }),
    ],
    []
  )

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Liste des utilisateurs</h2>
          <p className="text-muted-foreground">
            Gérez les comptes utilisateurs du système
          </p>
        </div>
        <Button onClick={openModal} className="bg-primary text-white hover:bg-primary/90">
          Créer un utilisateur
        </Button>
      </div>

      {/* Table */}
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="rounded-md border shadow-sm">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="text-primary-foreground border-r border-primary-foreground/20 last:border-r-0"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      className="border-b hover:bg-muted/50"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="border-r last:border-r-0">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                      Aucun utilisateur trouvé.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6 gap-2 flex-wrap">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
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
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, lastPage))}
              disabled={currentPage === lastPage}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </>
      )}

      {/* Modal création utilisateur */}
      <UserModal visible={isModalVisible} onClose={closeModal} />
    </div>
  )
}
