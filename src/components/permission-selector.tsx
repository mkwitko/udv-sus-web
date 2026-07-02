import { ShieldCheck } from 'lucide-react'
import type { GetPermissoes200Item } from '@/http/generated/api.schemas'
import {
  groupPermissions,
  permissionDescription,
  permissionLabel,
} from '@/lib/permission-labels'
import { PERMISSIONS } from '@/lib/permissions'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'

interface PermissionSelectorProps {
  permissoes: GetPermissoes200Item[]
  value: string[]
  onChange: (ids: string[]) => void
}

/** Seletor de permissões agrupado, com labels amigáveis e explicação. */
export function PermissionSelector({
  permissoes,
  value,
  onChange,
}: PermissionSelectorProps) {
  const selected = new Set(value)

  function toggle(id: string, on: boolean) {
    const next = new Set(selected)
    if (on) next.add(id)
    else next.delete(id)
    onChange([...next])
  }

  function toggleGroup(ids: string[], on: boolean) {
    const next = new Set(selected)
    for (const id of ids) {
      if (on) next.add(id)
      else next.delete(id)
    }
    onChange([...next])
  }

  const groups = groupPermissions(permissoes)

  return (
    <div className="space-y-4">
      {groups.map((group) => {
        const ids = group.items.map((p) => p.id)
        const allOn = ids.every((id) => selected.has(id))
        const isAdminGroup = group.category === 'Administrador'

        return (
          <div
            key={group.category}
            className={cn(
              'rounded-xl border p-4',
              isAdminGroup && 'border-primary/40 bg-primary/5',
            )}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isAdminGroup && <ShieldCheck className="size-4 text-primary" />}
                <h3 className="text-sm font-semibold">{group.category}</h3>
              </div>
              {ids.length > 1 && (
                <button
                  type="button"
                  className="text-xs font-medium text-primary hover:underline"
                  onClick={() => toggleGroup(ids, !allOn)}
                >
                  {allOn ? 'Limpar' : 'Selecionar todos'}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
              {group.items.map((p) => {
                const checked = selected.has(p.id)
                return (
                  <label
                    key={p.id}
                    className={cn(
                      'flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors',
                      checked
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-muted/50',
                    )}
                  >
                    <Checkbox
                      className="mt-0.5"
                      checked={checked}
                      onCheckedChange={(v) => toggle(p.id, !!v)}
                    />
                    <span className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium leading-none">
                        {permissionLabel(p.name)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {permissionDescription(p.name)}
                      </span>
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
        )
      })}

      {selected.has(
        permissoes.find((p) => p.name === PERMISSIONS.ADMINISTRADOR)?.id ?? '',
      ) && (
        <p className="text-xs text-muted-foreground">
          <ShieldCheck className="mr-1 inline size-3.5 text-primary" />
          Administrador concede acesso total — as demais permissões tornam-se
          redundantes.
        </p>
      )}
    </div>
  )
}
