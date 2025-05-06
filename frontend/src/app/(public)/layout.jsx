'use client'
import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Image from 'next/image'

export default function PublicLayout({ children }) {
  const { currentUser, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && currentUser) {
      router.push('/dashboard')
    }
  }, [currentUser, loading, router])

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {/* Contenedor del logo */}
      <div className="mb-8 w-full max-w-[300px]">
        <Image
          src="/images/logos/luximia-logo.jpg"
          alt="Logo de Luximia"
          width={300}
          height={200}
          className="mx-auto object-contain"
          priority
        />
      </div>

      {/* Contenido de la página */}
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}