"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

export const ProtectedRoute = ({ children, requiredRoles = [] }) => {
    const { currentUser, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            // Si no hay usuario, redirigir a login
            if (!currentUser) {
                router.push('/login');
            }
            // Si hay roles requeridos y el usuario no tiene ninguno, redirigir
            else if (requiredRoles.length > 0 && !requiredRoles.includes(currentUser.rol)) {
                router.push('/unauthorized');
            }
        }
    }, [currentUser, loading, router, requiredRoles]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Mostrar contenido solo si hay usuario y cumple con los roles requeridos
    return currentUser && (requiredRoles.length === 0 || requiredRoles.includes(currentUser.rol))
        ? children
        : null;
};