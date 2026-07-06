import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@/components/protected-route'
import { AppLayout } from '@/components/app-layout'
import { LoginPage } from '@/pages/login'
import { DashboardPage } from '@/pages/dashboard'
import { UsuariosPage } from '@/pages/usuarios'
import { RegioesPage } from '@/pages/regioes'
import { NucleosPage } from '@/pages/nucleos'
import { SessoesPage } from '@/pages/sessoes'
import { PreparosPage } from '@/pages/preparos'
import { EstoquePage } from '@/pages/estoque'
import { RelatoriosPage } from '@/pages/relatorios'
import { ConfiguracoesPage } from '@/pages/configuracoes'
import { PrivacidadePage } from '@/pages/privacidade'
import { SuportePage } from '@/pages/suporte'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/privacidade" element={<PrivacidadePage />} />
      <Route path="/suporte" element={<SuportePage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/usuarios" element={<UsuariosPage />} />
          <Route path="/regioes" element={<RegioesPage />} />
          <Route path="/nucleos" element={<NucleosPage />} />
          <Route path="/sessoes" element={<SessoesPage />} />
          <Route path="/preparos" element={<PreparosPage />} />
          <Route path="/estoque" element={<EstoquePage />} />
          <Route path="/relatorios" element={<RelatoriosPage />} />
          <Route path="/configuracoes" element={<ConfiguracoesPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
