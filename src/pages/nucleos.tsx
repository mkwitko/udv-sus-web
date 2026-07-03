import * as React from 'react'
import { Layers, Loader2 } from 'lucide-react'
import { useGetAllNucleos } from '@/http/generated/nucleos/nucleos'
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

export function NucleosPage() {
  const { data, isLoading } = useGetAllNucleos()

  const rows = React.useMemo(
    () => [...(data ?? [])].sort((a, b) => a.nome.localeCompare(b.nome)),
    [data],
  )

  return (
    <div>
      <PageHeader
        title="Núcleos"
        description="Provisionados automaticamente no login via Cognito (somente leitura)."
      />

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Região</TableHead>
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
                  <Layers className="mx-auto mb-2 size-8 opacity-40" />
                  Nenhum núcleo cadastrado
                </TableCell>
              </TableRow>
            )}
            {rows.map((n) => (
              <TableRow key={n.id}>
                <TableCell className="font-medium">{n.nome}</TableCell>
                <TableCell className="text-muted-foreground">
                  {n.regioes?.nome ?? '—'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
