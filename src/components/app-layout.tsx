import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  Layers,
  LayoutDashboard,
  LogOut,
  MapPin,
  Users,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

// Painel é só leitura (dados vêm do Cognito). Acesso já é gated na ProtectedRoute.
const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/usuarios', label: 'Usuários', icon: Users, end: false },
  { to: '/regioes', label: 'Regiões', icon: MapPin, end: false },
  { to: '/nucleos', label: 'Núcleos', icon: Layers, end: false },
]

export function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const nav = NAV

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <Layers className="size-6" />
          <span className="text-lg font-bold">UDV Painel</span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60',
                )
              }
            >
              <item.icon className="size-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Conteúdo */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-6">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{user?.nome}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user?.email}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="size-4" />
            Sair
          </Button>
        </header>

        <main className="flex-1 overflow-auto bg-muted/30 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
