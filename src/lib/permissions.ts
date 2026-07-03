/** Nomes de permissão (coincidem com Permissoes.name no backend). */
export const PERMISSIONS = {
  CRIAR_USUARIOS: 'CRIAR_USUARIOS',
  CRIAR_NUCLEOS: 'CRIAR_NUCLEOS',
  CRIAR_REGIOES: 'CRIAR_REGIOES',
  VER_NUCLEOS: 'VER_NUCLEOS',
  VER_REGIOES: 'VER_REGIOES',
  VER_PROPRIA_REGIAO: 'VER_PROPRIA_REGIAO',
  EXPORTAR_NUCLEOS: 'EXPORTAR_NUCLEOS',
  EXPORTAR_REGIOES: 'EXPORTAR_REGIOES',
  EXPORTAR_PROPRIA_REGIAO: 'EXPORTAR_PROPRIA_REGIAO',
  ADMINISTRADOR: 'ADMINISTRADOR',
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

/**
 * Permissões que dão acesso ao painel web (leitura). Usuários/núcleos/regiões
 * são provisionados via Cognito — o painel é só consulta. Quem vê região
 * (global ou própria) acessa; usuário local usa apenas o app.
 */
export const PANEL_ACCESS_PERMISSIONS: Permission[] = [
  PERMISSIONS.VER_REGIOES,
  PERMISSIONS.VER_PROPRIA_REGIAO,
]
