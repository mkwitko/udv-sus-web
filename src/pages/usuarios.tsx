import * as React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Loader2, Pencil, Plus, Trash2, Users } from 'lucide-react'
import { toast } from 'sonner'
import { useDeleteUser, useFindAllUsers } from '@/http/generated/user/user'
import type { FindAllUsers201Item } from '@/http/generated/api.schemas'
import { getApiErrorMessage } from '@/lib/api'
import { PERMISSIONS } from '@/lib/permissions'
import { useAuth } from '@/hooks/use-auth'
import { PageHeader } from '@/components/page-header'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function UsuariosPage() {
  const qc = useQueryClient()
  const navigate = useNavigate()
  const { hasPermission } = useAuth()
  const canManage = hasPermission(PERMISSIONS.CRIAR_USUARIOS)
  const { data, isLoading } = useFindAllUsers()
  const remove = useDeleteUser()
  const [deleting, setDeleting] = React.useState<FindAllUsers201Item | null>(
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
      toast.success('Usuário excluído')
      setDeleting(null)
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    }
  }

  return (
    <div>
      <PageHeader
        title="Usuários"
        description="Gerencie usuários, núcleos e permissões"
        action={
          canManage && (
            <Button onClick={() => navigate('/usuarios/novo')}>
              <Plus className="size-4" />
              Novo usuário
            </Button>
          )
        }
      />

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Núcleo</TableHead>
              <TableHead className="w-24 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center">
                  <Loader2 className="mx-auto size-6 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            )}
            {!isLoading && rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-10 text-center text-muted-foreground"
                >
                  <Users className="mx-auto mb-2 size-8 opacity-40" />
                  Nenhum usuário cadastrado
                </TableCell>
              </TableRow>
            )}
            {rows.map((u) => (
              <TableRow
                key={u.id}
                className={canManage ? 'cursor-pointer' : undefined}
                onClick={
                  canManage ? () => navigate(`/usuarios/${u.id}`) : undefined
                }
              >
                <TableCell className="font-medium">{u.nome}</TableCell>
                <TableCell className="text-muted-foreground">
                  {u.email ?? '—'}
                </TableCell>
                <TableCell>
                  {u.nucleo ? (
                    <Badge variant="secondary">{u.nucleo.nome}</Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {canManage && (
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/usuarios/${u.id}`)
                        }}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          setDeleting(u)
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
        title="Excluir usuário"
        description={`Tem certeza que deseja excluir "${deleting?.nome}"?`}
        loading={remove.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
