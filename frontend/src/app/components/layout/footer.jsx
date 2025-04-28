// components/Footer.jsx
import Image from 'next/image';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-4">
            <div className="flex justify-center items-center">
                {/* Icono de copyright */}
                <Image
                    src="/images/icons/copyright-icon.png"
                    alt="Copyright"
                    width={20}
                    height={20}
                />
                {/* Leyenda */}
                <p className="ml-2 text-sm">2025 ABC - Punto de Venta. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;
