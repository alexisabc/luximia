"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null);

    // Función para verificar roles
    const hasRole = (requiredRoles) => {
        if (!currentUser) return false;
        if (!requiredRoles || requiredRoles.length === 0) return true;
        return requiredRoles.includes(currentUser.rol);
    };

    // Función para verificar permisos específicos (puedes expandir esto)
    const hasPermission = (permission) => {
        // Aquí puedes implementar lógica más compleja basada en el rol
        if (!currentUser) return false;

        // Ejemplo básico:
        const rolePermissions = {
            admin: ['manage_users', 'view_reports', 'edit_content'],
            manager: ['view_reports', 'edit_content'],
            user: ['view_content']
        };

        return rolePermissions[currentUser.rol]?.includes(permission) || false;
    };

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const savedUser = localStorage.getItem('luximia_user');
                if (savedUser) {
                    const parsedUser = JSON.parse(savedUser);
                    // Opcional: Verificar con el backend si la sesión sigue activa
                    setCurrentUser(parsedUser);
                }
            } catch (error) {
                console.error('Error loading user session:', error);
                logout();
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (usuario, contrasena) => {
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/usuarios/login/`,
                { usuario, contrasena }
            );

            if (response.data.user) {
                const userData = {
                    id: response.data.user.id,
                    nombre: response.data.user.nombre,
                    usuario: response.data.user.usuario,
                    rol: response.data.user.rol,
                    // Agrega más campos si es necesario
                };

                localStorage.setItem('luximia_user', JSON.stringify(userData));
                setCurrentUser(userData);
                setAuthError(null);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            setAuthError(error.response?.data?.detail || 'Error de autenticación');
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('luximia_user');
        setCurrentUser(null);
        // Opcional: Hacer llamada al backend para invalidar la sesión
    };

    return (
        <AuthContext.Provider value={{
            currentUser,
            login,
            logout,
            loading,
            authError,
            hasRole,
            hasPermission
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);