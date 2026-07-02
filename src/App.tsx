import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@/components/protected-route'
import { AppLayout } from '@/components/app-layout'
import { LoginPage } from '@/pages/login'
import { DashboardPage } from '@/pages/dashboard'
import { UsuariosPage } from '@/pages/usuarios'
import { UsuarioFormPage } from '@/pages/usuario-form'
import { RegioesPage } from '@/pages/regioes'
import { RegiaoFormPage } from '@/pages/regiao-form'
import { NucleosPage } from '@/pages/nucleos'
import { NucleoFormPage } from '@/pages/nucleo-form'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/usuarios" element={<UsuariosPage />} />
          <Route path="/usuarios/novo" element={<UsuarioFormPage />} />
          <Route path="/usuarios/:id" element={<UsuarioFormPage />} />
          <Route path="/regioes" element={<RegioesPage />} />
          <Route path="/regioes/novo" element={<RegiaoFormPage />} />
          <Route path="/regioes/:id" element={<RegiaoFormPage />} />
          <Route path="/nucleos" element={<NucleosPage />} />
          <Route path="/nucleos/novo" element={<NucleoFormPage />} />
          <Route path="/nucleos/:id" element={<NucleoFormPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
