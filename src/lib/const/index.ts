export { SUPPORT_LANGUAGES, isLanguageSupported } from './support-languages'

export const IS_DEV = import.meta.env.DEV

export const IS_CHROME = typeof chrome !== 'undefined' && chrome?.runtime

export const APP_NAME = 'Tapture'
