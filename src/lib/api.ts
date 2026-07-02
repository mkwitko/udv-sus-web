import Axios, { type AxiosRequestConfig } from 'axios'

// Injetada pelo Vite via `define` (vite.config.ts). Fica `undefined` quando
// o orval carrega este mutator fora do Vite — daí o fallback com typeof.
declare const __API_BASE_URL__: string
const baseURL =
  typeof __API_BASE_URL__ !== 'undefined'
    ? __API_BASE_URL__
    : 'http://localhost:3000'

let unauthorizedHandler: null | (() => void) = null
export const setUnauthorizedHandler = (fn: () => void) => {
  unauthorizedHandler = fn
}

export const AXIOS_INSTANCE = Axios.create({
  baseURL,
  withCredentials: true, // envia/recebe cookies HttpOnly (accessToken/refreshToken)
})

// Mutator usado pelos hooks gerados pelo orval.
// Segundo argumento `options` permite overrides por query.
export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = Axios.CancelToken.source()
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data)

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled')
  }

  return promise
}

AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    if (status === 401) {
      unauthorizedHandler?.()
    }
    if (error.response?.data?.message) {
      return Promise.reject(new Error(error.response.data.message))
    }
    return Promise.reject(error)
  },
)

/** Extrai mensagem de erro amigável de um erro de request. */
export function getApiErrorMessage(error: unknown, fallback = 'Ocorreu um erro') {
  if (error instanceof Error && error.message) return error.message
  return fallback
}
