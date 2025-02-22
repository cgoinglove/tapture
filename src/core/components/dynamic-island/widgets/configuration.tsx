import { ArrowRight, ChevronLeft, Moon, MousePointer2, Sun } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useAppStore } from '@core/store'
import { SUPPORT_LANGUAGES } from '@lib/const'
import clsx from 'clsx'
import Checkmark from '@core/components/common/check-mark'
import { TIME } from '@lib/timestamp'
import { useShallow } from 'zustand/shallow'

interface Props {
  close: () => void
}

export default function Configuration({ close }: Props) {
  const [theme, setTheme, targetLang, sourceLang, setLang] = useAppStore(
    useShallow(state => [state.theme, state.setTheme, state.targetLang, state.sourceLang, state.setLang]),
  )

  const [captureAnimationToggle, setCaptureAnimationToggle] = useState(false)

  const [isChangeTargetSource, setIsChangeTargetSource] = useState(false)

  const currentLang = useMemo(() => {
    return isChangeTargetSource ? targetLang : sourceLang
  }, [sourceLang, targetLang, isChangeTargetSource])

  const items = useMemo(() => {
    return Object.keys(SUPPORT_LANGUAGES).map(key => {
      return {
        label: SUPPORT_LANGUAGES[key].name,
        value: key,
      }
    })
  }, [targetLang])

  const onClickHandler = (value: string) => {
    setLang(value, isChangeTargetSource ? 'target' : 'source')
    if (!isChangeTargetSource) setIsChangeTargetSource(true)
  }

  useEffect(() => {
    setTimeout(() => {
      setCaptureAnimationToggle(true)
    }, 500)
    const key = setInterval(() => {
      setCaptureAnimationToggle(prev => !prev)
    }, TIME.SECONDS(8))

    return () => {
      clearInterval(key)
    }
  }, [])

  return (
    <div className='p-2 w-[620px] flex flex-col'>
      <div className='flex items-center justify-between mx-4 my-2 mb-8'>
        <button
          className='flex items-center justify-center gap-1 px-2 py-1 rounded-full text-subText hover:text-foreground hover:bg-hoverColor'
          onClick={close}
        >
          <ChevronLeft size={16} />
          <span className='mr-2 font-semibold'>DONE</span>
        </button>
        <div className='flex rounded-full ring-1 ring-ringColor bg-softBackground'>
          <button
            className={clsx(theme != 'dark' && 'bg-background ring-1 ring-ringColor', 'p-2 rounded-full hover:bg-hoverColor')}
            onClick={setTheme.bind(null, 'light')}
          >
            <Sun size={14} />
          </button>
          <button
            className={clsx(theme == 'dark' && 'bg-background ring-1 ring-ringColor', 'p-2 rounded-full hover:bg-hoverColor')}
            onClick={setTheme.bind(null, 'dark')}
          >
            <Moon size={14} />
          </button>
        </div>
      </div>
      <div className='px-8'>
        <div className='relative p-4 text-xl font-semibold'>
          <div
            className={clsx(
              captureAnimationToggle ? 'w-[100%] h-[100%]' : 'w-[0%] h-[0%]',
              'absolute rounded-sm transition-all  duration-1000 top-0 left-0  bg-indigo-300/20 ease-out border-indigo-300',
            )}
          >
            <MousePointer2 size={16} className='absolute bottom-[-18px] right-[-18px] stroke-indigo-300 fill-indigo-300' />
          </div>
          <h1 className='flex items-center gap-1 text-5xl'>
            Capture For Translation. <span className={captureAnimationToggle ? 'animate-pulse' : ''}></span>
          </h1>
          <p className='mt-4 text-subText'>No copy-pasting, no hassle. Just grab what you need and get the meaning instantly.</p>
        </div>
        <p className='my-10 text-xl text-subText'>
          Choose the language,{' '}
          <span className='font-semibold text-foreground'>{isChangeTargetSource ? 'You want to read.' : 'The original text.'}</span>
        </p>
        <div className='flex items-center mt-auto font-bold'>
          <button
            onClick={setIsChangeTargetSource.bind(null, false)}
            className={clsx(
              !isChangeTargetSource && 'bg-softBackground text-foreground ring-subText',
              'transition-all flex-1 gap-2 flex items-center justify-center rounded-full bg-background hover:bg-hoverColor text-subText py-2 text-xl ring-1 ring-ringColor',
            )}
          >
            <span>{SUPPORT_LANGUAGES[sourceLang].icon}</span>
            {SUPPORT_LANGUAGES[sourceLang].name}
          </button>
          <div className='animate-bounce-x'>
            <ArrowRight className='mx-4 stroke-zinc-400 ' />
          </div>
          <button
            onClick={setIsChangeTargetSource.bind(null, true)}
            className={clsx(
              isChangeTargetSource && 'bg-softBackground text-foreground ring-subText',
              'transition-all flex-1 gap-2 flex items-center justify-center rounded-full bg-background hover:bg-hoverColor text-subText py-2 text-xl ring-1 ring-ringColor',
            )}
          >
            <span>{SUPPORT_LANGUAGES[targetLang].icon}</span>
            {SUPPORT_LANGUAGES[targetLang].name}
          </button>
        </div>
        <div className='my-12'>
          <div className='flex flex-wrap gap-2'>
            {items.map(item => {
              const selected = currentLang == item.value
              return (
                <button
                  key={item.value}
                  onClick={onClickHandler.bind(null, item.value)}
                  className={clsx(
                    selected
                      ? 'text-indigo-400 ring-indigo-400 bg-indigo-400/20 '
                      : 'text-subText ring-ringColor bg-softBackground hover:bg-background hover:text-foreground',
                    'group flex-1 basis-auto flex justify-center items-center gap-2 px-4 py-2 rounded-full text-base font-medium whitespace-nowrap ring-1 ring-inset',
                  )}
                >
                  {item.label}
                  {selected && <Checkmark size={18} strokeWidth={8} />}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
