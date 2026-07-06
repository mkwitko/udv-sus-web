import type { ReactNode } from 'react'
import { CONTACT_EMAIL, LEGAL_ENTITY, PublicLayout } from '@/components/public-layout'

// [EDITAR] Atualizar sempre que houver mudança relevante no tratamento de dados.
const LAST_UPDATED = '3 de julho de 2026'

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

export function PrivacidadePage() {
  return (
    <PublicLayout
      title="Política de Privacidade"
      subtitle={`Última atualização: ${LAST_UPDATED}`}
    >
      <Section title="1. Quem somos">
        <p>
          O aplicativo <strong>UDV Sustentabilidade</strong> é mantido pelo{' '}
          {LEGAL_ENTITY} ("nós"). Esta política descreve como coletamos, usamos e
          protegemos seus dados pessoais ao utilizar o aplicativo, em conformidade
          com a Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018).
        </p>
      </Section>

      <Section title="2. Dados que coletamos">
        <p>Coletamos apenas os dados necessários para o funcionamento do app:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            <strong>Dados de conta:</strong> nome, e-mail e senha, informados no
            cadastro. A autenticação é gerenciada pelo Amazon Cognito (AWS).
          </li>
          <li>
            <strong>Dados de uso do app:</strong> registros de sessões, preparos,
            regiões e núcleos que você cadastra ou consulta.
          </li>
          <li>
            <strong>Dados técnicos:</strong> tokens de autenticação armazenados de
            forma segura no dispositivo para manter você conectado.
          </li>
        </ul>
      </Section>

      <Section title="3. Como usamos os dados">
        <ul className="list-disc space-y-1 pl-6">
          <li>Autenticar seu acesso e manter a sessão ativa.</li>
          <li>Fornecer as funcionalidades de registro e consulta do aplicativo.</li>
          <li>Gerar relatórios e organizar informações por região e núcleo.</li>
          <li>Garantir a segurança e prevenir uso indevido.</li>
        </ul>
        <p>
          Não utilizamos seus dados para publicidade nem os vendemos a terceiros.
        </p>
      </Section>

      <Section title="4. Autenticação e compartilhamento de dados">
        <p>
          A autenticação de contas é processada pelo Amazon Cognito (Amazon Web
          Services), que armazena com segurança suas credenciais de acesso.
        </p>
        <p>
          Seus dados são armazenados em nossos servidores e não são compartilhados
          com terceiros, exceto com provedores de infraestrutura necessários ao
          funcionamento do serviço (como a AWS) ou por obrigação legal.
        </p>
      </Section>

      <Section title="5. Armazenamento e segurança">
        <p>
          Adotamos medidas técnicas e organizacionais para proteger seus dados
          contra acesso não autorizado. Os tokens de acesso ficam armazenados de
          forma criptografada no seu dispositivo e podem ser removidos ao sair do
          app.
        </p>
      </Section>

      <Section title="6. Seus direitos (LGPD)">
        <p>
          Você pode solicitar a qualquer momento o acesso, a correção, a
          portabilidade ou a exclusão dos seus dados pessoais, bem como revogar o
          consentimento. Para exercer esses direitos, entre em contato pelo e-mail
          abaixo.
        </p>
      </Section>

      <Section title="7. Exclusão de conta e dados">
        <p>
          Para excluir sua conta e os dados associados, envie um pedido para{' '}
          <a
            className="text-primary underline underline-offset-4"
            href={`mailto:${CONTACT_EMAIL}`}
          >
            {CONTACT_EMAIL}
          </a>
          . Concluímos a exclusão em até 30 dias, salvo dados que devamos reter por
          obrigação legal.
        </p>
      </Section>

      <Section title="8. Alterações nesta política">
        <p>
          Podemos atualizar esta política periodicamente. Alterações relevantes
          serão comunicadas por meio do aplicativo ou desta página.
        </p>
      </Section>

      <Section title="9. Contato">
        <p>
          Dúvidas sobre privacidade ou tratamento de dados podem ser enviadas para{' '}
          <a
            className="text-primary underline underline-offset-4"
            href={`mailto:${CONTACT_EMAIL}`}
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </Section>
    </PublicLayout>
  )
}
