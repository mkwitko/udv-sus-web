import * as React from 'react'
import { Loader2, Users } from 'lucide-react'
import { useFindAllUsers } from '@/http/generated/user/user'
import { PageHeader } from '@/components/page-header'
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
  const { data, isLoading } = useFindAllUsers()

  const rows = React.useMemo(
    () => [...(data ?? [])].sort((a, b) => a.nome.localeCompare(b.nome)),
    [data],
  )

  return (
    <div>
      <PageHeader
        title="Usuários"
        description="Provisionados automaticamente no login via Cognito (somente leitura)."
      />

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Núcleo</TableHead>
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
                  <Users className="mx-auto mb-2 size-8 opacity-40" />
                  Nenhum usuário cadastrado
                </TableCell>
              </TableRow>
            )}
            {rows.map((u) => (
              <TableRow key={u.id}>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
