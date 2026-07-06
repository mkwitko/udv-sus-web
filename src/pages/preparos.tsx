import { FlaskConical, Loader2 } from 'lucide-react'
import { useGetAllPreparos } from '@/http/generated/preparos/preparos'
import { PageHeader } from '@/components/page-header'
import { useScopeFilter } from '@/components/scope-filter'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

function formatData(value: string) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('pt-BR')
}

export function PreparosPage() {
  const { params, element } = useScopeFilter()
  const { data, isLoading } = useGetAllPreparos(params)

  const rows = data ?? []

  return (
    <div>
      <PageHeader
        title="Preparos"
        description="Preparos registrados no app (somente leitura)."
        action={element}
      />

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Início</TableHead>
                <TableHead>Fim</TableHead>
                <TableHead>Núcleo</TableHead>
                <TableHead>Região</TableHead>
                <TableHead className="text-right">Produção (L)</TableHead>
                <TableHead className="text-right">Mariri (kg)</TableHead>
                <TableHead className="text-right">Chacrona (kg)</TableHead>
                <TableHead className="text-right">Lenha (m²)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center">
                    <Loader2 className="mx-auto size-6 animate-spin text-muted-foreground" />
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && rows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-10 text-center text-muted-foreground"
                  >
                    <FlaskConical className="mx-auto mb-2 size-8 opacity-40" />
                    Nenhum preparo encontrado
                  </TableCell>
                </TableRow>
              )}
              {rows.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="whitespace-nowrap font-medium">
                    {formatData(p.inicio)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatData(p.fim)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {p.Nucleos?.nome ?? '—'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {p.Nucleos?.regioes?.nome ?? '—'}
                  </TableCell>
                  <TableCell className="text-right">{p.producaoLitros}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {p.mariri?.pesoKg ?? '—'}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {p.chacrona?.pesoKg ?? '—'}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {p.lenha?.quantidadeM2 ?? '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
