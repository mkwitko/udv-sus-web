import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { Loader2, ShieldOff } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { PANEL_ACCESS_PERMISSIONS } from '@/lib/permissions'
import { Button } from '@/components/ui/button'

export function ProtectedRoute() {
  const { isAuthenticated, isLoading, hasPermission, logout } = useAuth()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Só ADMINISTRADOR ou quem tem alguma permissão de criar acessa o painel.
  if (!hasPermission(PANEL_ACCESS_PERMISSIONS)) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="max-w-sm text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <ShieldOff className="size-6" />
          </div>
          <h1 className="text-lg font-semibold">Sem acesso ao painel</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sua conta não tem permissão para acessar o painel de controle. Fale
            com um administrador.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={async () => {
              await logout()
              navigate('/login', { replace: true })
            }}
          >
            Sair
          </Button>
        </div>
      </div>
    )
  }

  return <Outlet />
}
