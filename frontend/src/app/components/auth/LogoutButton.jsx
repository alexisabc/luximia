"use client";

import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export const LogoutButton = ({ className }) => {
    const { logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <button
            onClick={handleLogout}
            className={`px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors ${className}`}
        >
            Cerrar sesión
        </button>
    );
};