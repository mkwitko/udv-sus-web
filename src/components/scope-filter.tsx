import * as React from 'react'
import { useGetAllRegioes } from '@/http/generated/regioes/regioes'
import { useGetAllNucleos } from '@/http/generated/nucleos/nucleos'
import { useAuth } from '@/hooks/use-auth'
import { PERMISSIONS } from '@/lib/permissions'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

export interface ScopeParams {
  generalView: string
  regionView: string
  nucleoView: string
}

const GERAL = '__GERAL__'
const TODOS = '__TODOS__'

/**
 * Filtro de escopo de visualização (geral / região / núcleo), espelhando os
 * níveis de permissão do backend (resolveViewScope):
 *  - VER_REGIOES / ADMINISTRADOR → geral + qualquer região/núcleo
 *  - VER_PROPRIA_REGIAO          → só a própria região (e núcleos dentro dela)
 *  - (baseline)                  → só o próprio núcleo (sem seletor)
 *
 * Retorna os params prontos para as queries de sessões/preparos e o elemento
 * de UI com os seletores.
 */
export function useScopeFilter() {
  const { user, hasPermission } = useAuth()

  const canGeral = hasPermission(PERMISSIONS.VER_REGIOES)
  const canPropria = hasPermission(PERMISSIONS.VER_PROPRIA_REGIAO)
  const ownRegiaoId = user?.nucleo?.regioes?.id ?? ''
  const ownRegiaoNome = user?.nucleo?.regioes?.nome ?? ''

  const hasScope = canGeral || canPropria

  const [regiao, setRegiao] = React.useState<string>(() =>
    canGeral ? GERAL : ownRegiaoId,
  )
  const [nucleo, setNucleo] = React.useState<string>(TODOS)

  const regioesQuery = useGetAllRegioes({ query: { enabled: canGeral } })
  const nucleosQuery = useGetAllNucleos({ query: { enabled: hasScope } })

  // Regiões disponíveis: todas (geral) ou só a própria.
  const regioes = React.useMemo(() => {
    if (canGeral) {
      return [...(regioesQuery.data ?? [])].sort((a, b) =>
        a.nome.localeCompare(b.nome),
      )
    }
    if (canPropria && ownRegiaoId) {
      return [{ id: ownRegiaoId, nome: ownRegiaoNome }]
    }
    return []
  }, [canGeral, canPropria, ownRegiaoId, ownRegiaoNome, regioesQuery.data])

  // Núcleos disponíveis, filtrados pela região selecionada.
  const nucleos = React.useMemo(() => {
    const all = [...(nucleosQuery.data ?? [])].sort((a, b) =>
      a.nome.localeCompare(b.nome),
    )
    if (regiao === GERAL) return all
    return all.filter((n) => n.regioes?.id === regiao)
  }, [nucleosQuery.data, regiao])

  // Ao trocar de região, zera o núcleo selecionado.
  function handleRegiao(value: string) {
    setRegiao(value)
    setNucleo(TODOS)
  }

  const params: ScopeParams = React.useMemo(() => {
    if (nucleo !== TODOS) {
      return { generalView: '', regionView: '', nucleoView: nucleo }
    }
    if (regiao === GERAL) {
      return { generalView: 'true', regionView: '', nucleoView: '' }
    }
    if (regiao) {
      return { generalView: '', regionView: regiao, nucleoView: '' }
    }
    // baseline: backend devolve o próprio núcleo
    return { generalView: '', regionView: '', nucleoView: '' }
  }, [regiao, nucleo])

  const element = hasScope ? (
    <div className="flex flex-wrap items-end gap-3">
      <div className="grid gap-1.5">
        <Label className="text-xs text-muted-foreground">Região</Label>
        <Select value={regiao} onValueChange={handleRegiao}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {canGeral && <SelectItem value={GERAL}>Todas as regiões</SelectItem>}
            {regioes.map((r) => (
              <SelectItem key={r.id} value={r.id}>
                {r.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-1.5">
        <Label className="text-xs text-muted-foreground">Núcleo</Label>
        <Select value={nucleo} onValueChange={setNucleo}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TODOS}>Todos os núcleos</SelectItem>
            {nucleos.map((n) => (
              <SelectItem key={n.id} value={n.id}>
                {n.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  ) : null

  return { params, element, hasScope }
}
