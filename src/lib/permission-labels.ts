/** Rótulos amigáveis para os nomes de permissão vindos do backend. */
export const PERMISSION_LABELS: Record<string, string> = {
  CRIAR_USUARIOS: 'Criar usuários',
  CRIAR_NUCLEOS: 'Criar núcleos',
  CRIAR_REGIOES: 'Criar regiões',
  VER_NUCLEOS: 'Ver núcleos',
  VER_REGIOES: 'Ver regiões',
  EXPORTAR_NUCLEOS: 'Exportar núcleos',
  EXPORTAR_REGIOES: 'Exportar regiões',
  ADMINISTRADOR: 'Administrador',
  // Permissões legadas (mantidas amigáveis caso ainda existam no banco)
  CRIAR_USUARIOS_NUCLEO: 'Criar usuários do núcleo',
  CRIAR_USUARIOS_REGIAO: 'Criar usuários da região',
  CRIAR_USUARIOS_GERAL: 'Criar usuários (geral)',
  VER_GERAL: 'Ver tudo (geral)',
  EXPORTAR_GERAL: 'Exportar tudo (geral)',
  EXPORTAR_INFOS: 'Exportar informações',
  PREENCHER_INFOS: 'Preencher informações',
}

export function permissionLabel(name: string) {
  return PERMISSION_LABELS[name] ?? name
}

/** Explicação do que cada permissão concede. */
export const PERMISSION_DESCRIPTIONS: Record<string, string> = {
  CRIAR_USUARIOS: 'Criar, editar e excluir usuários do sistema.',
  CRIAR_NUCLEOS: 'Criar, editar e excluir núcleos.',
  CRIAR_REGIOES: 'Criar, editar e excluir regiões.',
  VER_NUCLEOS:
    'Ver dados de qualquer núcleo, não apenas o próprio. Sem esta, o usuário vê só o núcleo dele.',
  VER_REGIOES:
    'Ver dados agrupados por região e a visão geral (todas as regiões). Inclui o acesso de VER_NUCLEOS.',
  EXPORTAR_NUCLEOS:
    'Exportar dados de qualquer núcleo. Exportar o próprio núcleo é livre para todos.',
  EXPORTAR_REGIOES:
    'Exportar dados por região e geral. Inclui o acesso de EXPORTAR_NUCLEOS.',
  ADMINISTRADOR: 'Acesso total — concede todas as permissões acima.',
  // Legadas
  CRIAR_USUARIOS_NUCLEO:
    'Permissão antiga — criar usuários no próprio núcleo. Substituída por "Criar usuários".',
  CRIAR_USUARIOS_REGIAO:
    'Permissão antiga — criar usuários na região. Substituída por "Criar usuários".',
  CRIAR_USUARIOS_GERAL:
    'Permissão antiga — criar usuários em qualquer lugar. Substituída por "Criar usuários".',
  VER_GERAL: 'Permissão antiga — ver todos os dados. Substituída por "Ver regiões".',
  EXPORTAR_GERAL:
    'Permissão antiga — exportar todos os dados. Substituída por "Exportar regiões".',
  EXPORTAR_INFOS: 'Permissão antiga de exportação.',
  PREENCHER_INFOS: 'Permissão antiga — preencher informações (não é mais necessária).',
}

export function permissionDescription(name: string) {
  return PERMISSION_DESCRIPTIONS[name] ?? ''
}

/** Categoria de uma permissão a partir do prefixo do nome. */
export function permissionCategory(name: string): string {
  if (name === 'ADMINISTRADOR') return 'Administrador'
  if (name.startsWith('CRIAR_')) return 'Criar'
  if (name.startsWith('VER_')) return 'Ver'
  if (name.startsWith('EXPORTAR_')) return 'Exportar'
  if (name.startsWith('PREENCHER_')) return 'Preencher'
  return 'Outros'
}

/** Ordem de exibição das categorias. */
export const PERMISSION_CATEGORY_ORDER = [
  'Criar',
  'Ver',
  'Exportar',
  'Preencher',
  'Administrador',
  'Outros',
]

/** Agrupa uma lista de permissões por categoria, na ordem definida. */
export function groupPermissions<T extends { name: string }>(perms: T[]) {
  const map = new Map<string, T[]>()
  for (const p of perms) {
    const cat = permissionCategory(p.name)
    const arr = map.get(cat) ?? []
    arr.push(p)
    map.set(cat, arr)
  }
  return PERMISSION_CATEGORY_ORDER.filter((c) => map.has(c)).map((c) => ({
    category: c,
    items: map.get(c)!,
  }))
}
