'use client'
import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Navbar from '../components/layout/navbar'
import Footer from '../components/layout/footer'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function AuthLayout({ children }) {
    const { currentUser: user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
        }
    }, [user, loading, router])

    if (loading) {
        return <LoadingSpinner />
    }

    return user ? (
        <div className="min-h-screen flex flex-col">
            {/* Navbar con props del usuario */}
            <Navbar user={user} />

            <main className="flex-grow container mx-auto p-4">
                {children}
            </main>

            {/* Footer estático */}
            <Footer />
        </div>
    ) : null
}