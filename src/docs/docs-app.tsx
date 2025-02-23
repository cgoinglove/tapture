import { ArrowRight, MousePointer2 } from 'lucide-react'
import createTapture from '@core/index'
import { WebWokerEventProvider } from '@lib/event-provider/web-woker-event-provider'
import { useEffect, useRef, useState } from 'react'
import { TIME } from '@lib/timestamp'

const container = document.createElement('div')
container.id = 'tapture-rootxasdasd'
container.style.zIndex = '9999999'
container.style.position = 'relative'
document.body.appendChild(container)
const woker = new Worker(new URL('./web-worker.ts', import.meta.url), { type: 'module' })

const { close, isOpen, open } = createTapture(container, new WebWokerEventProvider(woker))

export default function DemoApp() {
  const [shouldIntro, setShouldIntro] = useState(true)

  const introRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'e') {
        e.preventDefault()
        e.stopPropagation()
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        isOpen() ? close() : open()
      }
    }

    open()
    document.addEventListener('keydown', handler, { capture: true })

    setTimeout(() => {
      if (introRef.current) {
        introRef.current.style.width = '100%'
        introRef.current.style.height = '100%'
      }

      setTimeout(() => {
        setShouldIntro(false)
      }, TIME.SECONDS(3))
    }, TIME.SECONDS(0.1))

    return () => {
      document.removeEventListener('keydown', handler)
    }
  }, [])

  return (
    <div className='relative flex items-center justify-center w-full min-h-screen text-foreground light bg-background'>
      {shouldIntro && <div className='absolute inset-0 z-10 w-full h-full pointer-events-all bg-black/20' />}
      <main className='text-center md:w-[750px] w-full mx-auto'>
        <div className='flex justify-center mb-4 text-[4.5rem] font-extrabold'>
          Translate To
          <div className='relative ml-4 overflow-hidden text-center rounded-lg bg-hoverColor'>
            <div className='absolute flex flex-col w-full animate-text-up'>
              {['にほんご', '한국어', 'English', 'にほんご'].map((lang, i) => (
                <span key={i}>{lang}</span>
              ))}
            </div>
            <span className='px-4 opacity-0'>にほんご</span>
          </div>
        </div>
        <div className='relative z-20 max-w-3xl py-4 mx-auto my-12 text-xl text-subText'>
          Easily translate for the text you need. No need for full-page translations or copy-pasting. ust drag over any section to get
          instant results!
          {shouldIntro && (
            <div
              ref={introRef}
              className='absolute top-0 left-0 w-0 h-0 transition-all ease-out border-indigo-300 rounded-sm duration-[2s] bg-white/80'
            >
              <div className='px-3 py-2 text-sm rounded bg-black text-white absolute bottom-[-54px] right-[-90px]'>
                {' '}
                Try This
                <MousePointer2 className='absolute left-[-18px] top-[-18px] stroke-black fill-black' />
              </div>
            </div>
          )}
        </div>
        <a
          href='#'
          className='inline-flex items-center justify-between px-4 py-4 text-4xl font-bold rounded-full bg-softBackground ring-1 ring-ringColor hover:bg-hoverColor'
        >
          <span className='ml-4 mr-24'>Start Extension</span>
          <div className='p-2 rounded-full bg-foreground'>
            <ArrowRight className='text-background' size={32} />
          </div>
        </a>
      </main>
    </div>
  )
}
