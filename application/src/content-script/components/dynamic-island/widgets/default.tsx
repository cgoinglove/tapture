import Checkmark from '@cs/components/shared/check-mark'
import CircularProgress from '@cs/components/shared/circle-progress'
import { useAppStore } from '@cs/store'
import { APP_NAME } from '@lib/const'
import { wait } from '@shared/util'

import clsx from 'clsx'
import { Earth, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useShallow } from 'zustand/shallow'

interface Props {
  openConfiguration: () => void
}

export default function DefaultWidget(props: Props) {
  const [downloadProgress, setDownloadProgress, setShow] = useAppStore(
    useShallow(state => [state.downloadProgress, state.setDownloadProgress, state.setShow]),
  )

  const [progress, setProgress] = useState<number | null>(null)

  useEffect(() => {
    if (downloadProgress.status == 'downloading') {
      return setProgress(prev => Math.max(downloadProgress.progress, prev ?? 0))
    }
    if (downloadProgress.status == 'success') {
      setProgress(100)
      wait(2000).then(() => setDownloadProgress({ status: 'init', progress: 0 }))
      return
    }
    if (progress != null) setProgress(null)
  }, [downloadProgress])

  return (
    <div className='relative flex items-center group'>
      <div className='z-10 flex items-center mx-4 font-bold select-none'>
        <span className='font-bold'>{APP_NAME}</span>
      </div>
      <div className='flex ml-auto rounded-full text-subText bg-softBackground ring-1 ring-ringColor'>
        <button onClick={props.openConfiguration} className='flex items-center justify-center w-8 h-8'>
          {Boolean(progress) && (
            <div className='duration-500 group-hover:hidden animate-in fade-in'>
              {progress == 100 ? (
                <Checkmark color='#11FF82' size={18} strokeWidth={8} />
              ) : (
                <CircularProgress progress={progress!} size={18} strokeColor='#11FF82' strokeWidth={2} />
              )}
            </div>
          )}

          <div
            onClick={props.openConfiguration}
            className={clsx(
              'transition-colors duration-200 cursor-pointer hover:text-foreground animate-in fade-in p-2 hover:bg-hoverColor rounded-full',
              Boolean(progress) && 'group-hover:block hidden',
            )}
          >
            <Earth size={16} />
          </div>
        </button>
        <button className='flex items-center justify-center w-8 h-8'>
          {Boolean(progress) && <span className='text-xs duration-500 animate-in fade-in group-hover:hidden'>{progress!.toFixed(0)}</span>}

          <div
            onClick={setShow.bind(null, false)}
            className={clsx(
              ' transition-colors duration-200 cursor-pointer hover:text-foreground animate-in fade-in p-2 hover:bg-hoverColor rounded-full',
              Boolean(progress) && 'group-hover:block hidden',
            )}
          >
            <X size={16} />
          </div>
        </button>
      </div>
    </div>
  )
}
