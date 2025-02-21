import { useAppStore } from '@cs/store'

export default function ModelDownloadWidget() {
  const progress = useAppStore(state => Math.round(state.downloadProgress.progress))

  return (
    <div className='flex flex-col items-center gap-4 px-6 py-6'>
      <div className='flex gap-4 text-sm font-semibold'>
        <div className='rotate-[-8deg] rounded px-2 py-1 bg-sky-500'>にほんご</div>
        <div className='rotate-[-2deg] translate-y-[-1px] rounded px-2 py-1 bg-indigo-500'>English</div>
        <div className='rotate-[6deg] translate-y-[-3px] rounded px-2 py-1 bg-amber-500'>中文</div>
        <div className='rotate-[14deg] translate-y-[-4px] rounded px-2 py-1 bg-pink-500'>Français</div>
      </div>
      <p className='my-2 text-2xl font-semibold'>
        Fetching The Best
        <br /> Translation Model.
      </p>

      <div className='w-full overflow-hidden rounded-lg'>
        <div className='relative w-full h-4 bg-green-950'>
          <div style={{ width: `${progress}%` }} className='absolute top-0 left-0 h-full transition-all duration-100 bg-green-500'></div>
        </div>
      </div>
    </div>
  )
}
