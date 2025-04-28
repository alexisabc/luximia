"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { LogoutButton } from '../auth/LogoutButton';

const Navbar = () => {
    const [openMenu, setOpenMenu] = useState(null);
    const router = useRouter();
    const pathname = usePathname();
    const [activeRoute, setActiveRoute] = useState('');
    const { currentUser, loading, hasRole } = useAuth();

    useEffect(() => {
        setActiveRoute(pathname);
    }, [pathname]);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (!event.target.closest('.menu-button') && !event.target.closest('.menu-content')) {
                setOpenMenu(null);
            }
        };

        document.addEventListener('click', handleOutsideClick);
        return () => document.removeEventListener('click', handleOutsideClick);
    }, []);

    const toggleMenu = (menu) => {
        setOpenMenu((prevMenu) => (prevMenu === menu ? null : menu));
    };

    const isActive = (route) => activeRoute === route ? 'text-blue-500' : 'text-white';

    if (loading || !currentUser) return null;

    return (
        <nav className="bg-gray-800 text-white p-4 relative">
            <div className="flex justify-between items-center">
                <div className="grid grid-cols-6 gap-4">

                    {/* Sección de Caja */}
                    <div className={`flex flex-col items-center cursor-pointer ${isActive('/sales')}`}
                        onClick={() => router.push('/sales')}>
                        <Image src="/images/icons/sales-icon.png" alt="Caja" width={32} height={32} />
                        <span className="text-sm">Caja</span>
                    </div>

                    {/* Movimientos de Caja */}
                    <div className="relative flex flex-col items-center cursor-pointer menu-button">
                        <div onClick={() => toggleMenu('cashMov')}
                            className={`flex flex-col items-center ${isActive('/cash_mov')}`}>
                            <Image src="/images/icons/cash-icon.png" alt="Movimientos de caja" width={32} height={32} />
                            <span className="text-sm">Movimientos de Caja</span>
                        </div>
                        {openMenu === 'cashMov' && (
                            <div className="absolute top-12 bg-white text-gray-800 shadow-md rounded-md w-48 p-4 menu-content">
                                <Link href="/cancellations" className="flex items-center space-x-2 p-2 hover:bg-gray-100">
                                    <Image src="/images/icons/cancellation-icon.png" alt="Cancelaciones" width={40} height={40} />
                                    <span>Cancelaciones</span>
                                </Link>
                                <Link href="/cashmov" className="flex items-center space-x-2 p-2 hover:bg-gray-100">
                                    <Image src="/images/icons/cashmov-icon.png" alt="Movimientos de Caja" width={40} height={40} />
                                    <span>Movimientos de Caja</span>
                                </Link>
                                <Link href="/cashcuts" className="flex items-center space-x-2 p-2 hover:bg-gray-100">
                                    <Image src="/images/icons/cashcuts-icon.png" alt="Cortes de Caja" width={40} height={40} />
                                    <span>Cortes de Caja</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Artículos */}
                    <div className="relative flex flex-col items-center cursor-pointer menu-button">
                        <div onClick={() => toggleMenu('articles')} className={`flex flex-col items-center ${isActive('/articles')}`}>
                            <Image src="/images/icons/articles-icon.png" alt="Artículos" width={32} height={32} />
                            <span className="text-sm">Artículos</span>
                        </div>
                        {openMenu === 'articles' && (
                            <div className="absolute top-12 bg-white text-gray-800 shadow-md rounded-md w-48 p-4 menu-content">
                                <Link href="/articleslist" className="flex items-center space-x-2 p-2 hover:bg-gray-100">
                                    <Image src="/images/icons/cataloga-icon.png" alt="Catálogo" width={40} height={40} />
                                    <span>Catálogo</span>
                                </Link>
                                <Link href="/prices" className="flex items-center space-x-2 p-2 hover:bg-gray-100">
                                    <Image src="/images/icons/prices-icon.png" alt="Precios" width={40} height={40} />
                                    <span>Precios</span>
                                </Link>
                                <Link href="/pricelist" className="flex items-center space-x-2 p-2 hover:bg-gray-100">
                                    <Image src="/images/icons/listprice-icon.png" alt="Lista de precios" width={40} height={40} />
                                    <span>Lista de precios</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Clientes */}
                    <div className="relative flex flex-col items-center cursor-pointer menu-button">
                        <div onClick={() => toggleMenu('clients')} className={`flex flex-col items-center ${isActive('/customers')}`}>
                            <Image src="/images/icons/customers-icon.png" alt="Clientes" width={32} height={32} />
                            <span className="text-sm">Clientes</span>
                        </div>
                        {openMenu === 'clients' && (
                            <div className="absolute top-12 bg-white text-gray-800 shadow-md rounded-md w-48 p-4 menu-content">
                                <Link href="/customers/list" className="flex items-center space-x-2 p-2 hover:bg-gray-100">
                                    <Image src="/images/icons/catalog-icon.png" alt="Catálogo" width={40} height={40} />
                                    <span>Catálogo</span>
                                </Link>
                                <Link href="/customers/credits" className="flex items-center space-x-2 p-2 hover:bg-gray-100">
                                    <Image src="/images/icons/credits-icon.png" alt="Créditos" width={40} height={40} />
                                    <span>Créditos</span>
                                </Link>
                                <Link href="/customers/advance" className="flex items-center space-x-2 p-2 hover:bg-gray-100">
                                    <Image src="/images/icons/advance-icon.png" alt="Anticipos" width={40} height={40} />
                                    <span>Anticipos</span>
                                </Link>
                                <Link href="/customers/payments" className="flex items-center space-x-2 p-2 hover:bg-gray-100">
                                    <Image src="/images/icons/payment-icon.png" alt="Abonos" width={40} height={40} />
                                    <span>Abonos</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Reportes */}
                    <div className="relative flex flex-col items-center cursor-pointer menu-button">
                        <div onClick={() => toggleMenu('reports')} className={`flex flex-col items-center ${isActive('/reports')}`}>
                            <Image src="/images/icons/reports-icon.png" alt="Reportes" width={32} height={32} />
                            <span className="text-sm">Reportes</span>
                        </div>
                        {openMenu === 'reports' && (
                            <div className="absolute top-12 bg-white text-gray-800 shadow-md rounded-md w-48 p-4 menu-content">
                                <Link href="/salesreport" className="flex items-center space-x-2 p-2 hover:bg-gray-100">
                                    <Image src="/images/icons/rsales-icon.png" alt="Ventas" width={40} height={40} />
                                    <span>Ventas</span>
                                </Link>
                                <Link href="/clientsreport" className="flex items-center space-x-2 p-2 hover:bg-gray-100">
                                    <Image src="/images/icons/rclients-icon.png" alt="Clientes" width={40} height={40} />
                                    <span>Clientes</span>
                                </Link>
                                <Link href="/cashreport" className="flex items-center space-x-2 p-2 hover:bg-gray-100">
                                    <Image src="/images/icons/rcash-icon.png" alt="Caja" width={40} height={40} />
                                    <span>Caja</span>
                                </Link>
                                <Link href="/articlesreport" className="flex items-center space-x-2 p-2 hover:bg-gray-100">
                                    <Image src="/images/icons/rarticles-icon.png" alt="Articlesreport Icon" width={40} height={40} />
                                    <span>Articulos</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Configuración */}
                    <div className="relative flex flex-col items-center cursor-pointer menu-button">
                        <div onClick={() => toggleMenu('settings')} className={`flex flex-col items-center ${isActive('/settings')}`}>
                            <Image src="/images/icons/settings-icon.png" alt="Configuración" width={32} height={32} />
                            <span className="text-sm">Configuración</span>
                        </div>
                        {openMenu === 'settings' && (
                            <div className="absolute top-12 bg-white text-gray-800 shadow-md rounded-md w-48 p-4 menu-content">
                                <Link href="/company" className="flex items-center space-x-2 p-2 hover:bg-gray-100">
                                    <Image src="/images/icons/company-icon.png" alt="Company Icon" width={40} height={40} />
                                    <span>Empresa</span>
                                </Link>
                                <Link href="/roles" className="flex items-center space-x-2 p-2 hover:bg-gray-100">
                                    <Image src="/images/icons/roleuser-icon.png" alt="Role Icon" width={40} height={40} />
                                    <span>Roles</span>
                                </Link>
                                <Link href="/users" className="flex items-center space-x-2 p-2 hover:bg-gray-100">
                                    <Image src="/images/icons/users-icon.png" alt="Users Icon" width={40} height={40} />
                                    <span>Usuarios</span>
                                </Link>
                                <Link href="/print" className="flex items-center space-x-2 p-2 hover:bg-gray-100">
                                    <Image src="/images/icons/print-icon.png" alt="Print Icon" width={40} height={40} />
                                    <span>Impresora</span>
                                </Link>
                                <Link href="/taxes" className="flex items-center space-x-2 p-2 hover:bg-gray-100">
                                    <Image src="/images/icons/taxes-icon.png" alt="Taxes Icon" width={40} height={40} />
                                    <span>Impuestos</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sección de perfil de usuario */}
                <div className="relative flex items-center cursor-pointer menu-button">
                    <div onClick={() => toggleMenu('userMenu')} className="flex items-center space-x-2">
                        <Image
                            src={currentUser.profilePicture || '/images/profiles/alexis.png'}
                            alt="Profile Picture"
                            className="rounded-full"
                            width={40}
                            height={40}
                        />
                        <span>{currentUser.nombre || currentUser.usuario}</span>
                    </div>
                    {openMenu === 'userMenu' && (
                        <div className="absolute top-12 right-0 bg-white text-gray-800 shadow-md rounded-md w-48 p-4 menu-content">
                            <LogoutButton className="w-full text-left p-2 hover:bg-gray-100" />
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;