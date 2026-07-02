import * as React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Loader2, MapPin, Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  useDeleteRegiao,
  useGetAllRegioes,
} from '@/http/generated/regioes/regioes'
import type { GetAllRegioes200Item } from '@/http/generated/api.schemas'
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

export function RegioesPage() {
  const qc = useQueryClient()
  const navigate = useNavigate()
  const { hasPermission } = useAuth()
  const canManage = hasPermission(PERMISSIONS.CRIAR_REGIOES)
  const { data, isLoading } = useGetAllRegioes()
  const remove = useDeleteRegiao()
  const [deleting, setDeleting] = React.useState<GetAllRegioes200Item | null>(
    null,
  )

  const rows = React.useMemo(
    () => [...(data ?? [])].sort((a, b) => a.nome.localeCompare(b.nome)),
    [data],
  )

  async function confirmDelete() {
    if (!deleting) return
    try {
      await remove.mutateAsync({ data: { id: deleting.id, soft: true } })
      await qc.invalidateQueries()
      toast.success('Região excluída')
      setDeleting(null)
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    }
  }

  return (
    <div>
      <PageHeader
        title="Regiões"
        description="Gerencie as regiões do sistema"
        action={
          canManage && (
            <Button onClick={() => navigate('/regioes/novo')}>
              <Plus className="size-4" />
              Nova região
            </Button>
          )
        }
      />

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="w-24 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={2} className="py-10 text-center">
                  <Loader2 className="mx-auto size-6 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            )}
            {!isLoading && rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="py-10 text-center text-muted-foreground"
                >
                  <MapPin className="mx-auto mb-2 size-8 opacity-40" />
                  Nenhuma região cadastrada
                </TableCell>
              </TableRow>
            )}
            {rows.map((r) => (
              <TableRow
                key={r.id}
                className={canManage ? 'cursor-pointer' : undefined}
                onClick={
                  canManage ? () => navigate(`/regioes/${r.id}`) : undefined
                }
              >
                <TableCell className="font-medium">{r.nome}</TableCell>
                <TableCell className="text-right">
                  {canManage && (
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/regioes/${r.id}`)
                        }}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          setDeleting(r)
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
        title="Excluir região"
        description={`Tem certeza que deseja excluir "${deleting?.nome}"?`}
        loading={remove.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
