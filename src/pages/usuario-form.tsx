import * as React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import {
  useCreateUser,
  useFindUserById,
  useUpdateUser,
} from '@/http/generated/user/user'
import { useGetAllNucleos } from '@/http/generated/nucleos/nucleos'
import { useGetPermissoes } from '@/http/generated/permissoes/permissoes'
import { getApiErrorMessage } from '@/lib/api'
import { PERMISSIONS } from '@/lib/permissions'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PermissionSelector } from '@/components/permission-selector'

function buildSchema(isEdit: boolean) {
  return z.object({
    nome: z.string().min(3, 'Mínimo 3 caracteres'),
    email: z.string().email('E-mail inválido'),
    senha: isEdit
      ? z.string().max(0).or(z.string().min(6, 'Mínimo 6 caracteres'))
      : z.string().min(6, 'Mínimo 6 caracteres'),
    nucleoId: z.string().min(1, 'Selecione um núcleo'),
    permissoes: z.array(z.string()),
  })
}
type FormValues = z.infer<ReturnType<typeof buildSchema>>

export function UsuarioFormPage() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { hasPermission } = useAuth()

  const create = useCreateUser()
  const update = useUpdateUser()
  const { data: nucleos } = useGetAllNucleos()
  const { data: permissoes } = useGetPermissoes()
  const { data: userDetail, isLoading: loadingDetail } = useFindUserById(
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
    resolver: zodResolver(buildSchema(isEdit)),
    defaultValues: {
      nome: '',
      email: '',
      senha: '',
      nucleoId: '',
      permissoes: [],
    },
  })

  React.useEffect(() => {
    // Espera os núcleos carregarem antes do reset — senão o Select (Radix)
    // fica no placeholder porque a opção selecionada ainda não existe.
    if (isEdit && userDetail && nucleos) {
      reset({
        nome: userDetail.nome,
        email: userDetail.email ?? '',
        senha: '',
        nucleoId: userDetail.nucleo?.id ?? '',
        permissoes: userDetail.permissoes.map((p) => p.id),
      })
    }
  }, [isEdit, userDetail, nucleos, reset])

  if (!hasPermission(PERMISSIONS.CRIAR_USUARIOS)) {
    return <Navigate to="/usuarios" replace />
  }

  async function onSubmit(values: FormValues) {
    const permissoesStr = values.permissoes.join(',')
    try {
      if (isEdit && id) {
        await update.mutateAsync({
          data: {
            id,
            nome: values.nome,
            email: values.email,
            nucleoId: values.nucleoId,
            permissoes: permissoesStr,
            ...(values.senha ? { senha: values.senha } : {}),
          },
        })
        toast.success('Usuário atualizado')
      } else {
        await create.mutateAsync({
          data: {
            nome: values.nome,
            email: values.email,
            senha: values.senha,
            nucleoId: values.nucleoId,
            permissoes: permissoesStr,
          },
        })
        toast.success('Usuário criado')
      }
      await qc.invalidateQueries()
      navigate('/usuarios')
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
          onClick={() => navigate('/usuarios')}
          aria-label="Voltar"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEdit ? 'Editar usuário' : 'Novo usuário'}
          </h1>
          <p className="text-sm text-muted-foreground">
            Dados de acesso, núcleo e permissões
          </p>
        </div>
      </div>

      {isEdit && loadingDetail ? (
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
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="senha">
                  Senha{' '}
                  {isEdit && (
                    <span className="font-normal text-muted-foreground">
                      (em branco = manter)
                    </span>
                  )}
                </Label>
                <Input id="senha" type="password" {...register('senha')} />
                {errors.senha && (
                  <p className="text-xs text-destructive">
                    {errors.senha.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Núcleo</Label>
                <Controller
                  control={control}
                  name="nucleoId"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um núcleo" />
                      </SelectTrigger>
                      <SelectContent>
                        {(nucleos ?? []).map((n) => (
                          <SelectItem key={n.id} value={n.id}>
                            {n.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.nucleoId && (
                  <p className="text-xs text-destructive">
                    {errors.nucleoId.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Permissões</CardTitle>
              <p className="text-sm text-muted-foreground">
                Marque o que este usuário pode fazer. Sem permissões, ele vê
                apenas os dados do próprio núcleo.
              </p>
            </CardHeader>
            <CardContent>
              <Controller
                control={control}
                name="permissoes"
                render={({ field }) => (
                  <PermissionSelector
                    permissoes={permissoes ?? []}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/usuarios')}
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
