import * as React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import {
  useCreateNucleo,
  useGetNucleoById,
  useUpdateNucleo,
} from '@/http/generated/nucleos/nucleos'
import { useGetAllRegioes } from '@/http/generated/regioes/regioes'
import { getApiErrorMessage } from '@/lib/api'
import { PERMISSIONS } from '@/lib/permissions'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const schema = z.object({
  nome: z.string().min(3, 'Mínimo 3 caracteres'),
  regioesId: z.string().min(1, 'Selecione uma região'),
})
type FormValues = z.infer<typeof schema>

export function NucleoFormPage() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { hasPermission } = useAuth()

  const create = useCreateNucleo()
  const update = useUpdateNucleo()
  const { data: regioes } = useGetAllRegioes()
  const { data: nucleo, isLoading } = useGetNucleoById(
    { id: id ?? '' },
    { query: { enabled: isEdit } },
  )

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { nome: '', regioesId: '' },
  })

  React.useEffect(() => {
    // Espera as regiões carregarem antes do reset (senão o Select fica vazio).
    if (isEdit && nucleo && regioes) {
      reset({ nome: nucleo.nome, regioesId: nucleo.regioes?.id ?? '' })
    }
  }, [isEdit, nucleo, regioes, reset])

  if (!hasPermission(PERMISSIONS.CRIAR_NUCLEOS)) {
    return <Navigate to="/nucleos" replace />
  }

  async function onSubmit(values: FormValues) {
    try {
      if (isEdit && id) {
        await update.mutateAsync({ data: { id, ...values } })
        toast.success('Núcleo atualizado')
      } else {
        await create.mutateAsync({ data: values })
        toast.success('Núcleo criado')
      }
      await qc.invalidateQueries()
      navigate('/nucleos')
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
          onClick={() => navigate('/nucleos')}
          aria-label="Voltar"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          {isEdit ? 'Editar núcleo' : 'Novo núcleo'}
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
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input id="nome" {...register('nome')} />
                {errors.nome && (
                  <p className="text-xs text-destructive">
                    {errors.nome.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Região</Label>
                <Controller
                  control={control}
                  name="regioesId"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma região" />
                      </SelectTrigger>
                      <SelectContent>
                        {(regioes ?? []).map((r) => (
                          <SelectItem key={r.id} value={r.id}>
                            {r.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.regioesId && (
                  <p className="text-xs text-destructive">
                    {errors.regioesId.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/nucleos')}
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
