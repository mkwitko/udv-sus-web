import * as React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Layers, Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  useDeleteNucleo,
  useGetAllNucleos,
} from '@/http/generated/nucleos/nucleos'
import type { GetAllNucleos200Item } from '@/http/generated/api.schemas'
import { getApiErrorMessage } from '@/lib/api'
import { PERMISSIONS } from '@/lib/permissions'
import { useAuth } from '@/hooks/use-auth'
import { PageHeader } from '@/components/page-header'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function NucleosPage() {
  const qc = useQueryClient()
  const navigate = useNavigate()
  const { hasPermission } = useAuth()
  const canManage = hasPermission(PERMISSIONS.CRIAR_NUCLEOS)
  const { data, isLoading } = useGetAllNucleos()
  const remove = useDeleteNucleo()
  const [deleting, setDeleting] = React.useState<GetAllNucleos200Item | null>(
    null,
  )

  const rows = React.useMemo(
    () => [...(data ?? [])].sort((a, b) => a.nome.localeCompare(b.nome)),
    [data],
  )

  async function confirmDelete() {
    if (!deleting) return
    try {
      await remove.mutateAsync({ id: deleting.id, params: { soft: true } })
      await qc.invalidateQueries()
      toast.success('Núcleo excluído')
      setDeleting(null)
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    }
  }

  return (
    <div>
      <PageHeader
        title="Núcleos"
        description="Gerencie os núcleos e suas regiões"
        action={
          canManage && (
            <Button onClick={() => navigate('/nucleos/novo')}>
              <Plus className="size-4" />
              Novo núcleo
            </Button>
          )
        }
      />

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Região</TableHead>
              <TableHead className="w-24 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={3} className="py-10 text-center">
                  <Loader2 className="mx-auto size-6 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            )}
            {!isLoading && rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="py-10 text-center text-muted-foreground"
                >
                  <Layers className="mx-auto mb-2 size-8 opacity-40" />
                  Nenhum núcleo cadastrado
                </TableCell>
              </TableRow>
            )}
            {rows.map((n) => (
              <TableRow
                key={n.id}
                className={canManage ? 'cursor-pointer' : undefined}
                onClick={
                  canManage ? () => navigate(`/nucleos/${n.id}`) : undefined
                }
              >
                <TableCell className="font-medium">{n.nome}</TableCell>
                <TableCell className="text-muted-foreground">
                  {n.regioes?.nome ?? '—'}
                </TableCell>
                <TableCell className="text-right">
                  {canManage && (
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/nucleos/${n.id}`)
                        }}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          setDeleting(n)
                        }}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Excluir núcleo"
        description={`Tem certeza que deseja excluir "${deleting?.nome}"?`}
        loading={remove.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
