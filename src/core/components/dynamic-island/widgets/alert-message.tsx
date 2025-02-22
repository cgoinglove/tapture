import { AlertCircle, CheckCircle, Info } from 'lucide-react'
import { PropsWithChildren } from 'react'

type AlertVariant = 'success' | 'info' | 'error'

interface AlertMessageProps {
  variant?: AlertVariant
}

export default function AlertMessage({ children, variant = 'info' }: PropsWithChildren<AlertMessageProps>) {
  const getAlertStyles = (variant: AlertVariant) => {
    switch (variant) {
      case 'success':
        return 'text-green-300'
      case 'error':
        return 'text-red-400'
      case 'info':
      default:
        return 'text-blue-300'
    }
  }

  const getIcon = (variant: AlertVariant) => {
    switch (variant) {
      case 'success':
        return <CheckCircle className='flex-shrink-0 w-5 h-5 text-green-400' />
      case 'error':
        return <AlertCircle className='flex-shrink-0 w-5 h-5 text-red-400' />
      case 'info':
      default:
        return <Info className='flex-shrink-0 w-5 h-5 text-blue-400' />
    }
  }

  return (
    <div
      className={`font-bold p-4 flex items-center space-x-3 ${getAlertStyles(variant)} m-4`}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      {getIcon(variant)}
      <p className='text-sm'>{children}</p>
    </div>
  )
}
