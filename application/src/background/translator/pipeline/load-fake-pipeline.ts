import { TranslationPipeline } from '@xenova/transformers'
import { randomRange, wait } from '@shared/util'

const fake_model_cache: string[] = []

export async function loadFakePipeline(
  sourceLang: string,
  targetLang: string,
  progressCallback: (info: TranslateProgressEvent['data']) => void,
) {
  const key = `${sourceLang}_${targetLang}`

  if (!fake_model_cache.some(v => v == key)) {
    fake_model_cache.push(key)
    const files = ['tokenizer.json', 'tokenizer_config.json', 'config.json', 'encoder_quantized.onnx', 'decoder_quantized.onnx'].map(v => ({
      name: `Cgoing/fake-model-${sourceLang}-${targetLang}`,
      file: `fake_${v}`,
    }))
    progressCallback({ status: 'start', sourceLang, targetLang })
    for (const file of files) {
      progressCallback({
        status: 'initiate',
        ...file,
        sourceLang,
        targetLang,
      })
    }

    for (const file of files) {
      progressCallback({
        status: 'download',
        ...file,
        sourceLang,
        targetLang,
      })
    }

    await Promise.all(
      files.map(async file => {
        for await (const progress of Array.from({ length: 100 }).map((_, i) => i + 1)) {
          await wait(randomRange(50, 200))
          progressCallback!({
            status: 'progress',
            sourceLang,
            targetLang,
            progress,
            loaded: progress,
            total: 100,
            ...file,
          })
        }
      }),
    )

    for (const file of files) {
      progressCallback({
        sourceLang,
        targetLang,
        status: 'done',
        ...file,
      })
    }

    for (const file of files) {
      progressCallback({
        status: 'ready',
        sourceLang,
        targetLang,
        ...file,
      })
    }

    progressCallback({ status: 'success', sourceLang, targetLang })
  }

  const instance = (message: string) =>
    new Promise<string>(resolve => {
      setTimeout(() => resolve(`[ ${message} ]`), randomRange(1000, 3000))
    })

  return instance as unknown as TranslationPipeline
}
