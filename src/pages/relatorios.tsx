import type { ElementType } from 'react'
import {
  CalendarDays,
  Droplet,
  FlaskConical,
  Flame,
  Leaf,
  Sprout,
  TreePine,
  Users,
} from 'lucide-react'
import { useGetSessao } from '@/http/generated/sessoes/sessoes'
import { useGetAllPreparos } from '@/http/generated/preparos/preparos'
import { PageHeader } from '@/components/page-header'
import { useScopeFilter } from '@/components/scope-filter'
import { Card, CardContent } from '@/components/ui/card'
import { fmtNum, parseNum } from '@/lib/num'

function Metric({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string
  value: string
  hint?: string
  icon: ElementType
}) {
  return (
    <Card>
      <CardContent className="flex items-start gap-4 p-6">
        <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

export function RelatoriosPage() {
  const { params, element } = useScopeFilter()
  const sessoes = useGetSessao(params)
  const preparos = useGetAllPreparos(params)

  const sData = sessoes.data ?? []
  const pData = preparos.data ?? []

  const totalSessoes = sData.length
  const totalPessoas = sData.reduce((s, x) => s + parseNum(x.pessoas), 0)
  const totalVegetal = sData.reduce(
    (s, x) => s + parseNum(x.quantidadeVegetal),
    0,
  )
  const mediaPorSessao = totalVegetal / (totalSessoes || 1)
  // Litros por pessoa → ml/pessoa.
  const mlPorPessoa = Math.round((totalVegetal / (totalPessoas || 1)) * 1000)

  const totalPreparos = pData.length
  const totalProducao = pData.reduce(
    (s, x) => s + parseNum(x.producaoLitros),
    0,
  )
  const totalMariri = pData.reduce((s, x) => s + parseNum(x.mariri?.pesoKg), 0)
  const totalChacrona = pData.reduce(
    (s, x) => s + parseNum(x.chacrona?.pesoKg),
    0,
  )
  const totalLenha = pData.reduce(
    (s, x) => s + parseNum(x.lenha?.quantidadeM2),
    0,
  )

  return (
    <div>
      <PageHeader
        title="Relatórios"
        description="Consolidado de sessões e preparos do escopo selecionado."
        action={element}
      />

      <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
        Sessões
      </h2>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Metric label="Sessões" value={fmtNum(totalSessoes, 0)} icon={CalendarDays} />
        <Metric label="Pessoas" value={fmtNum(totalPessoas, 0)} icon={Users} />
        <Metric
          label="Vegetal consumido"
          value={`${fmtNum(totalVegetal)} L`}
          icon={Leaf}
        />
        <Metric
          label="Média por sessão"
          value={`${fmtNum(mediaPorSessao)} L`}
          icon={Droplet}
        />
        <Metric
          label="Média por pessoa"
          value={`${fmtNum(mlPorPessoa, 0)} ml`}
          hint="Vegetal consumido ÷ pessoas"
          icon={Droplet}
        />
      </div>

      <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
        Preparos
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Metric
          label="Preparos"
          value={fmtNum(totalPreparos, 0)}
          icon={FlaskConical}
        />
        <Metric
          label="Produção"
          value={`${fmtNum(totalProducao)} L`}
          icon={Sprout}
        />
        <Metric
          label="Mariri"
          value={`${fmtNum(totalMariri)} kg`}
          icon={TreePine}
        />
        <Metric
          label="Chacrona"
          value={`${fmtNum(totalChacrona)} kg`}
          icon={Leaf}
        />
        <Metric
          label="Lenha"
          value={`${fmtNum(totalLenha)} m²`}
          icon={Flame}
        />
      </div>
    </div>
  )
}
