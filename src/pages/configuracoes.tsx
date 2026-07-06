import * as React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Boxes, Loader2, Plug } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { getFindMeQueryKey } from '@/http/generated/user/user'
import { customInstance, getApiErrorMessage } from '@/lib/api'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'

// FindMe gerado ainda não tipa os flags novos — leitura tolerante.
interface FlagsUser {
  integracoesAtivo?: boolean
  nucleo?: { estoqueAtivo?: boolean } | null
}

type ConfigKey = 'estoqueAtivo' | 'integracoesAtivo'

const ITEMS: {
  key: ConfigKey
  title: string
  description: string
  scope: string
  icon: typeof Boxes
}[] = [
  {
    key: 'estoqueAtivo',
    title: 'Controle de estoque',
    description:
      'Cadastro de vegetal, saldos e desconto do estoque ao registrar sessões.',
    scope: 'Por núcleo',
    icon: Boxes,
  },
  {
    key: 'integracoesAtivo',
    title: 'Integrações',
    description: 'Sincronização com planilhas e serviços externos.',
    scope: 'Por usuário',
    icon: Plug,
  },
]

export function ConfiguracoesPage() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const flags = user as unknown as FlagsUser | undefined

  const [config, setConfig] = React.useState({
    estoqueAtivo: false,
    integracoesAtivo: false,
  })
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    if (flags) {
      setConfig({
        estoqueAtivo: !!flags.nucleo?.estoqueAtivo,
        integracoesAtivo: !!flags.integracoesAtivo,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function toggle(key: ConfigKey, value: boolean) {
    const prev = config
    setConfig({ ...config, [key]: value })
    setSaving(true)
    try {
      // Estoque é por núcleo; integrações é por usuário.
      const url = key === 'integracoesAtivo' ? '/user/config' : '/nucleo/config'
      await customInstance({ url, method: 'PUT', data: { [key]: value } })
      await qc.invalidateQueries({ queryKey: getFindMeQueryKey() })
      toast.success('Configuração salva')
    } catch (err) {
      setConfig(prev)
      toast.error(getApiErrorMessage(err, 'Erro ao salvar configuração'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Configurações"
        description="Ative as funcionalidades disponíveis."
        action={
          saving ? (
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Salvando…
            </span>
          ) : undefined
        }
      />

      <div className="grid max-w-2xl gap-4">
        {ITEMS.map(({ key, title, description, scope, icon: Icon }) => (
          <Card key={key}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{title}</p>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase text-muted-foreground">
                    {scope}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {description}
                </p>
              </div>
              <Checkbox
                checked={config[key]}
                disabled={saving}
                onCheckedChange={(v) => toggle(key, v === true)}
              />
            </CardContent>
          </Card>
        ))}
        {!flags?.nucleo && (
          <p className="text-sm text-muted-foreground">
            Seu usuário não tem núcleo — controle de estoque indisponível.
          </p>
        )}
      </div>
    </div>
  )
}
