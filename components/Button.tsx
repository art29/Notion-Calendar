'use client'

export interface ButtonProps {
  children: JSX.Element | string
  theme?: 'dark' | 'light' | 'link' | 'none'
  type?: 'submit' | 'button'
  onClick?: () => void
  disabled?: boolean
  styling?: string
}

const Button = ({
  theme = 'dark',
  type = 'submit',
  children,
  onClick,
  disabled = false,
  styling = '',
}: ButtonProps) => {
  const themeStyle = (): string => {
    switch (theme) {
      case 'dark':
        return `rounded-lg text-white py-1 px-2 ${
          disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-black'
        }`
      case 'light':
        return 'rounded-lg bg-white text-black py-1 px-2'
      case 'link':
        return 'bg-white text-black underline underline-offset-4'
      case 'none':
        return ''
      default: {
        throw new Error(`Unhandled theme: ${theme}`)
      }
    }
  }

  return (
    <button
      className={`${themeStyle()} ${styling}`}
      type={type}
      disabled={disabled}
      onClick={() => onClick && onClick()}
    >
      {children}
    </button>
  )
}

export default Button
