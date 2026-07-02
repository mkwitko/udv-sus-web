import * as React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import {
  useCreateRegiao,
  useGetRegionById,
  useUpdateRegiao,
} from '@/http/generated/regioes/regioes'
import { getApiErrorMessage } from '@/lib/api'
import { PERMISSIONS } from '@/lib/permissions'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const schema = z.object({ nome: z.string().min(3, 'Mínimo 3 caracteres') })
type FormValues = z.infer<typeof schema>

export function RegiaoFormPage() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { hasPermission } = useAuth()

  const create = useCreateRegiao()
  const update = useUpdateRegiao()
  const { data: regiao, isLoading } = useGetRegionById(
    { id: id ?? '' },
    { query: { enabled: isEdit } },
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { nome: '' },
  })

  React.useEffect(() => {
    if (isEdit && regiao) reset({ nome: regiao.nome })
  }, [isEdit, regiao, reset])

  if (!hasPermission(PERMISSIONS.CRIAR_REGIOES)) {
    return <Navigate to="/regioes" replace />
  }

  async function onSubmit(values: FormValues) {
    try {
      if (isEdit && id) {
        await update.mutateAsync({ data: { id, nome: values.nome } })
        toast.success('Região atualizada')
      } else {
        await create.mutateAsync({ data: { nome: values.nome } })
        toast.success('Região criada')
      }
      await qc.invalidateQueries()
      navigate('/regioes')
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    }
  }

  const saving = create.isPending || update.isPending

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/regioes')}
          aria-label="Voltar"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          {isEdit ? 'Editar região' : 'Nova região'}
        </h1>
      </div>

      {isEdit && isLoading ? (
        <div className="py-20 text-center">
          <Loader2 className="mx-auto size-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input id="nome" {...register('nome')} />
                {errors.nome && (
                  <p className="text-xs text-destructive">
                    {errors.nome.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/regioes')}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="size-4 animate-spin" />}
              Salvar
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
