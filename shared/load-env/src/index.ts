import { config } from 'dotenv'
import { existsSync } from 'node:fs'

export const load = <T extends Record<string, string> = Record<string, string>>(
  root: string = process.cwd(),
): T => {
  const localEnv = `${root}/.env.local`
  const modeEnv = `${root}/.env.${process.env.NODE_ENV}`
  const defaultEnv = `${root}/.env`
  return [localEnv, modeEnv, defaultEnv].reduce<T>((prev, path) => {
    const variables = !existsSync(path) ? {} : (config({ path }).parsed ?? {})
    Object.entries(variables).forEach(([key, value]) => {
      if (!Object.prototype.hasOwnProperty.call(prev, key)) Object.assign(prev, { [key]: value })
    })
    return prev
  }, {} as T)
}
