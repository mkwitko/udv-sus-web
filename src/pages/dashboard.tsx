import type { ElementType } from 'react'
import { Layers, MapPin, Users } from 'lucide-react'
import { useFindAllUsers } from '@/http/generated/user/user'
import { useGetAllRegioes } from '@/http/generated/regioes/regioes'
import { useGetAllNucleos } from '@/http/generated/nucleos/nucleos'
import { useAuth } from '@/hooks/use-auth'
import { PERMISSIONS } from '@/lib/permissions'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent } from '@/components/ui/card'

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: number | undefined
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
          <p className="text-2xl font-bold">{value ?? '—'}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export function DashboardPage() {
  const { user, hasPermission } = useAuth()
  const canUsers = hasPermission(PERMISSIONS.CRIAR_USUARIOS)
  const canRegioes = hasPermission(PERMISSIONS.CRIAR_REGIOES)
  const canNucleos = hasPermission(PERMISSIONS.CRIAR_NUCLEOS)

  const users = useFindAllUsers({ query: { enabled: canUsers } })
  const regioes = useGetAllRegioes({ query: { enabled: canRegioes } })
  const nucleos = useGetAllNucleos({ query: { enabled: canNucleos } })

  return (
    <div>
      <PageHeader
        title={`Olá, ${user?.nome ?? ''}`}
        description="Visão geral do sistema"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {canUsers && (
          <StatCard label="Usuários" value={users.data?.length} icon={Users} />
        )}
        {canRegioes && (
          <StatCard
            label="Regiões"
            value={regioes.data?.length}
            icon={MapPin}
          />
        )}
        {canNucleos && (
          <StatCard
            label="Núcleos"
            value={nucleos.data?.length}
            icon={Layers}
          />
        )}
      </div>
    </div>
  )
}
