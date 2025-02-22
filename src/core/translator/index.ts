import { getDefaultModelOption, isFastModel } from './xenova-models'
import { loadFakePipeline } from './pipeline/load-fake-pipeline'
import { loadXenovaPipeline } from './pipeline/load-xenova-pipeline'

type Option = {
  fake?: boolean
  progressCallback: (info: TranslateProgressEvent['data']) => void
}

type Translate = (text: string, sourceLang: string, targetLang: string) => Promise<string>

export const Translator = (options: Option) => {
  const load = async (sourceLang: string, targetLang: string) => {
    const handleError = (err: Error) => {
      options.progressCallback({
        status: 'fail',
        sourceLang,
        targetLang,
        error: err?.message || 'Download Error',
      })
      throw err
    }

    return options.fake
      ? await loadFakePipeline(sourceLang, targetLang, options.progressCallback).catch(handleError)
      : await loadXenovaPipeline(sourceLang, targetLang, options.progressCallback).catch(handleError)
  }

  const translate: Translate = async (text, src, tgt) => {
    const translator = await load(src, tgt)
    const translateOption = isFastModel(src, tgt) ? undefined : getDefaultModelOption(src, tgt)

    const out = await translator(text, translateOption as unknown as undefined)

    return (([out].flat()[0] as any)?.translation_text ?? out) as string
  }

  const translateStream = async (text: string, src, tgt, callback: (text: string) => void) => {
    const translator = await load(src, tgt)
    const translateOption = isFastModel(src, tgt)
      ? undefined
      : {
          ...getDefaultModelOption(src, tgt),
          callback_function: x => {
            callback(translator.tokenizer.decode(x[0].output_token_ids, { skip_special_tokens: true }))
          },
        }

    const out = await translator(text, translateOption as unknown as undefined)

    return (([out].flat()[0] as any)?.translation_text ?? out) as string
  }

  return {
    load,
    translate,
    translateStream,
  }
}
