
import Image from 'next/image'

const Dashboard = () => {
    return (
        <div className="flex flex-col">
            <div className="flex-grow flex flex-col items-center justify-center bg-gray-100 p-6">
                {/* Imagen centrada */}
                <Image
                    src="/images/logos/luximia-petreos.png" // Asegúrate de que el logo esté en la carpeta public
                    alt="Logo"
                    width={800} // Ancho del logo
                    height={300} // Alto del logo
                    className="mx-auto"
                />
            </div>
        </div>
    );
}

export default Dashboard