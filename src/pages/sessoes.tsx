import * as React from 'react'
import { CalendarDays, Leaf, Loader2 } from 'lucide-react'
import { useGetSessao } from '@/http/generated/sessoes/sessoes'
import type { GetSessao200Item } from '@/http/generated/api.schemas'
import { PageHeader } from '@/components/page-header'
import { useScopeFilter } from '@/components/scope-filter'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { fmtNum, parseNum } from '@/lib/num'

// O client gerado ainda não tipa os vegetais consumidos na sessão.
interface VegetalConsumo {
  id?: string
  vegetalId?: string
  quantidade: string
  filtrado?: string
  local: string
  vegetal?: { nome?: string } | null
}
type SessaoRow = GetSessao200Item & { vegetais?: VegetalConsumo[] }

function formatData(value: string) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('pt-BR')
}

const LOCAL_LABEL: Record<string, string> = {
  estoque: 'Estoque',
  geladeira: 'Geladeira',
}

export function SessoesPage() {
  const { params, element } = useScopeFilter()
  const { data, isLoading } = useGetSessao(params)
  const [selected, setSelected] = React.useState<SessaoRow | null>(null)

  const rows = (data ?? []) as SessaoRow[]

  return (
    <div>
      <PageHeader
        title="Sessões"
        description="Sessões registradas no app (clique para ver detalhes)."
        action={element}
      />

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Sessão</TableHead>
                <TableHead>Núcleo</TableHead>
                <TableHead>Região</TableHead>
                <TableHead className="text-right">Pessoas</TableHead>
                <TableHead className="text-right">Vegetal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center">
                    <Loader2 className="mx-auto size-6 animate-spin text-muted-foreground" />
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && rows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-10 text-center text-muted-foreground"
                  >
                    <CalendarDays className="mx-auto mb-2 size-8 opacity-40" />
                    Nenhuma sessão encontrada
                  </TableCell>
                </TableRow>
              )}
              {rows.map((s) => (
                <TableRow
                  key={s.id}
                  onClick={() => setSelected(s)}
                  className="cursor-pointer"
                >
                  <TableCell className="whitespace-nowrap font-medium">
                    {formatData(s.data)}
                  </TableCell>
                  <TableCell>{s.sessao}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {s.Nucleos?.nome ?? '—'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {s.Nucleos?.regioes?.nome ?? '—'}
                  </TableCell>
                  <TableCell className="text-right">{s.pessoas}</TableCell>
                  <TableCell className="text-right">
                    {s.quantidadeVegetal}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.sessao}</DialogTitle>
            <DialogDescription>
              {selected && formatData(selected.data)} ·{' '}
              {selected?.Nucleos?.nome ?? '—'} · {selected?.pessoas} pessoas
            </DialogDescription>
          </DialogHeader>

          {selected?.descricao && (
            <p className="text-sm text-muted-foreground">
              {selected.descricao}
            </p>
          )}

          <div className="rounded-lg border">
            <div className="flex items-center justify-between border-b px-4 py-2">
              <span className="text-sm font-medium">Vegetal consumido</span>
              <span className="text-sm text-muted-foreground">
                Total: {selected?.quantidadeVegetal ?? '0'} L
              </span>
            </div>
            {selected?.vegetais && selected.vegetais.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vegetal</TableHead>
                    <TableHead>Origem</TableHead>
                    <TableHead className="text-right">Filtrado (L)</TableHead>
                    <TableHead className="text-right">Consumido (L)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selected.vegetais.map((v, i) => (
                    <TableRow key={v.id ?? i}>
                      <TableCell>{v.vegetal?.nome ?? '—'}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {LOCAL_LABEL[v.local] ?? v.local}
                      </TableCell>
                      <TableCell className="text-right">
                        {fmtNum(
                          parseNum(
                            (v as { filtrado?: string }).filtrado ||
                              v.quantidade,
                          ),
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {fmtNum(parseNum(v.quantidade))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center gap-1 px-4 py-8 text-center text-sm text-muted-foreground">
                <Leaf className="size-6 opacity-40" />
                Sem detalhe por vegetal (quantidade total informada).
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
