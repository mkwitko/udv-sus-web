import * as React from 'react'
import { Loader2, MapPin } from 'lucide-react'
import { useGetAllRegioes } from '@/http/generated/regioes/regioes'
import { PageHeader } from '@/components/page-header'
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
  const { data, isLoading } = useGetAllRegioes()

  const rows = React.useMemo(
    () => [...(data ?? [])].sort((a, b) => a.nome.localeCompare(b.nome)),
    [data],
  )

  return (
    <div>
      <PageHeader
        title="Regiões"
        description="Provisionadas automaticamente no login via Cognito (somente leitura)."
      />

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell className="py-10 text-center">
                  <Loader2 className="mx-auto size-6 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            )}
            {!isLoading && rows.length === 0 && (
              <TableRow>
                <TableCell className="py-10 text-center text-muted-foreground">
                  <MapPin className="mx-auto mb-2 size-8 opacity-40" />
                  Nenhuma região cadastrada
                </TableCell>
              </TableRow>
            )}
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.nome}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
