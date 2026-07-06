import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Leaf } from 'lucide-react'

// E-mail de contato exibido nas páginas públicas (privacidade/suporte).
// [EDITAR] Trocar pelo e-mail oficial de contato antes de publicar.
export const CONTACT_EMAIL = 'suporte@udv.org.br'

// [EDITAR] Confirmar razão social/entidade responsável.
export const LEGAL_ENTITY = 'Centro Espírita Beneficente União do Vegetal'

export function PublicLayout({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: ReactNode
}) {
  return (
    <div className="flex min-h-svh flex-col bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-4 py-4">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Leaf className="size-5" />
          </div>
          <span className="font-semibold">UDV Sustentabilidade</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
        ) : null}
        <div className="prose-public mt-8 space-y-6 text-foreground/90">
          {children}
        </div>
      </main>

      <footer className="border-t bg-background">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {LEGAL_ENTITY}
          </span>
          <nav className="flex gap-4">
            <Link className="hover:text-foreground" to="/privacidade">
              Privacidade
            </Link>
            <Link className="hover:text-foreground" to="/suporte">
              Suporte
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
