'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext({
    currentUser: null,
    login: () => { },
    logout: () => { },
    loading: true,
    authError: null,
    hasRole: () => false,
    hasPermission: () => false
})

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [authError, setAuthError] = useState(null)

    const hasRole = (requiredRoles) => {
        if (!currentUser?.rol) return false
        return requiredRoles.includes(currentUser.rol)
    }

    const hasPermission = (permission) => {
        const rolePermissions = {
            admin: ['manage_users', 'view_reports', 'edit_content'],
            manager: ['view_reports', 'edit_content'],
            user: ['view_content']
        }
        return rolePermissions[currentUser?.rol]?.includes(permission) || false
    }

    useEffect(() => {
        const initializeAuth = async () => {
            if (typeof window === 'undefined') return

            try {
                const savedUser = localStorage.getItem('luximia_user')
                if (savedUser) {
                    const parsedUser = JSON.parse(savedUser)
                    const { data } = await axios.post(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/token/verify/`,
                        { token: parsedUser.token }
                    )
                    if (data.valid) setCurrentUser(parsedUser)
                    else logout()
                }
            } catch (error) {
                console.error('Auth initialization error:', error)
                logout()
            } finally {
                setLoading(false)
            }
        }

        initializeAuth()
    }, [])

    const login = async (usuario, contrasena) => {
        try {
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/usuarios/login/`,
                { usuario, contrasena },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            )

            if (data.user) {
                const userData = {
                    id: data.user.id,
                    nombre: data.user.nombre,
                    usuario: data.user.usuario,
                    rol: data.user.rol,
                    token: data.token // Asegúrate de recibir el token del backend
                }

                localStorage.setItem('luximia_user', JSON.stringify(userData))
                setCurrentUser(userData)
                setAuthError(null)
                return true
            }
            return false
        } catch (error) {
            setAuthError(error.response?.data?.detail || 'Error de autenticación')
            throw error
        }
    }

    const logout = () => {
        localStorage.removeItem('luximia_user')
        setCurrentUser(null)
        // Opcional: Llamar a API de logout
    }

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                login,
                logout,
                loading,
                authError,
                hasRole,
                hasPermission
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider')
    }
    return context
}