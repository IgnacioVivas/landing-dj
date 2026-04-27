'use client'

import { useState } from 'react'
import { Eye, EyeSlash } from '@phosphor-icons/react'

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  inputClassName?: string
}

export default function PasswordInput({ inputClassName, className, ...props }: Props) {
  const [visible, setVisible] = useState(false)

  return (
    <div className={`relative ${className ?? ''}`}>
      <input
        {...props}
        type={visible ? 'text' : 'password'}
        className={`${inputClassName ?? ''} pr-10`}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setVisible(v => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
        aria-label={visible ? 'Ocultar contraseña' : 'Ver contraseña'}
      >
        {visible ? <EyeSlash size={16} /> : <Eye size={16} />}
      </button>
    </div>
  )
}
