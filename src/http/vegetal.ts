import { useQuery } from '@tanstack/react-query'
import { customInstance } from '@/lib/api'

/**
 * Cliente manual para `/vegetal` (estoque). O client gerado pelo orval ainda
 * não cobre este recurso; quando regenerar, migrar para o hook gerado.
 */
export interface VegetalNucleo {
  id: string
  nome: string
  regioes?: { id: string; nome: string } | null
}

export interface VegetalItem {
  id: string
  nome: string
  tipo: string
  dataPreparo: string
  mestrePreparo: string
  observacoes?: string | null
  litrosEstoque: string
  litrosGeladeira: string
  Nucleos?: VegetalNucleo | null
}

export interface VegetalParams {
  generalView?: string
  regionView?: string
  nucleoView?: string
}

export function useGetVegetal(params: VegetalParams) {
  return useQuery({
    queryKey: ['vegetal', params],
    queryFn: () =>
      customInstance<VegetalItem[]>({ url: '/vegetal', method: 'GET', params }),
  })
}
