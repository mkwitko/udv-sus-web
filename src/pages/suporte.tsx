import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { CONTACT_EMAIL, PublicLayout } from '@/components/public-layout'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <div className="space-y-3 leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  )
}

export function SuportePage() {
  return (
    <PublicLayout
      title="Suporte"
      subtitle="Precisa de ajuda com o UDV Sustentabilidade? Estamos aqui."
    >
      <div className="rounded-xl border bg-background p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Mail className="size-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Fale conosco</p>
            <a
              className="font-medium text-primary underline underline-offset-4"
              href={`mailto:${CONTACT_EMAIL}`}
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </div>

      <Section title="Como obter ajuda">
        <p>
          Envie um e-mail para o endereço acima descrevendo sua dúvida ou problema.
          Para agilizar o atendimento, inclua:
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li>Descrição do que aconteceu;</li>
          <li>Modelo do aparelho e versão do sistema (Android/iOS);</li>
          <li>Versão do aplicativo, se souber;</li>
          <li>Prints da tela, quando possível.</li>
        </ul>
      </Section>

      <Section title="Perguntas frequentes">
        <p>
          <strong>Não consigo entrar na minha conta.</strong> Verifique se e-mail e
          senha estão corretos. Persistindo, entre em contato pelo e-mail de
          suporte.
        </p>
        <p>
          <strong>Como excluir minha conta e meus dados?</strong> Consulte a{' '}
          <Link
            className="text-primary underline underline-offset-4"
            to="/privacidade"
          >
            Política de Privacidade
          </Link>{' '}
          ou envie o pedido para o e-mail de suporte.
        </p>
      </Section>

      <Section title="Tempo de resposta">
        <p>
          Respondemos, em geral, em até 3 dias úteis.
        </p>
      </Section>
    </PublicLayout>
  )
}
