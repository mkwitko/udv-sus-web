import type { ElementType } from 'react'
import { Leaf, Loader2, Refrigerator, Sprout } from 'lucide-react'
import { useGetVegetal } from '@/http/vegetal'
import { PageHeader } from '@/components/page-header'
import { useScopeFilter } from '@/components/scope-filter'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { fmtNum, parseNum } from '@/lib/num'

function formatData(value: string) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('pt-BR')
}

const TIPO_LABEL: Record<string, string> = {
  caupuri: 'Caupuri',
  tucunaca: 'Tucunacá',
  caupuri_tucunaca: 'Caupuri e Tucunacá',
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: ElementType
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-6" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export function EstoquePage() {
  const { params, element } = useScopeFilter()
  const { data, isLoading } = useGetVegetal(params)

  const rows = data ?? []
  const totalEstoque = rows.reduce((s, v) => s + parseNum(v.litrosEstoque), 0)
  const totalGeladeira = rows.reduce(
    (s, v) => s + parseNum(v.litrosGeladeira),
    0,
  )

  return (
    <div>
      <PageHeader
        title="Estoque de Vegetal"
        description="Saldos de vegetal por núcleo (somente leitura)."
        action={element}
      />

      {rows.length > 0 && (
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Estoque"
            value={`${fmtNum(totalEstoque)} L`}
            icon={Leaf}
          />
          <StatCard
            label="Geladeira"
            value={`${fmtNum(totalGeladeira)} L`}
            icon={Refrigerator}
          />
          <StatCard
            label="Total"
            value={`${fmtNum(totalEstoque + totalGeladeira)} L`}
            icon={Sprout}
          />
        </div>
      )}

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vegetal</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Núcleo</TableHead>
                <TableHead>Preparo</TableHead>
                <TableHead>Mestre</TableHead>
                <TableHead className="text-right">Estoque (L)</TableHead>
                <TableHead className="text-right">Geladeira (L)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center">
                    <Loader2 className="mx-auto size-6 animate-spin text-muted-foreground" />
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && rows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-10 text-center text-muted-foreground"
                  >
                    <Leaf className="mx-auto mb-2 size-8 opacity-40" />
                    Nenhum vegetal encontrado
                  </TableCell>
                </TableRow>
              )}
              {rows.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-medium">{v.nome}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {TIPO_LABEL[v.tipo] ?? v.tipo}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {v.Nucleos?.nome ?? '—'}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {formatData(v.dataPreparo)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {v.mestrePreparo || '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    {fmtNum(parseNum(v.litrosEstoque))}
                  </TableCell>
                  <TableCell className="text-right">
                    {fmtNum(parseNum(v.litrosGeladeira))}
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
