import { pipeline, TranslationPipeline, env } from '@xenova/transformers'

const instanceCache = new Map<string, Promise<TranslationPipeline>>()

// Skip initial check for local models, since we are not loading any local models.
env.allowLocalModels = false

// Due to a bug in onnxruntime-web, we must disable multithreading for now.
// See https://github.com/microsoft/onnxruntime/issues/14445 for more information.
env.backends.onnx.wasm.numThreads = 1

export async function loadXenovaPipeline(
  sourceLang: string,
  targetLang: string,
  progressCallback: (info: TranslateProgressEvent['data']) => void,
) {
  const model = 'Xenova/nllb-200-distilled-600M'
  if (!instanceCache.has(model)) {
    progressCallback({ status: 'start', sourceLang, targetLang })
    const instance = pipeline('translation', model, {
      progress_callback(info) {
        progressCallback({ ...info, sourceLang, targetLang })
      },
    }).then(model => {
      progressCallback({ status: 'success', sourceLang, targetLang })
      return model
    })
    instanceCache.set(model, instance)
  }
  return instanceCache.get(model)!
}
