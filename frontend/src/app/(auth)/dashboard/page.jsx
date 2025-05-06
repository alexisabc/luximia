import Image from 'next/image'

const Dashboard = () => {
    return (
        <div className="flex-grow flex flex-col items-center justify-center bg-gray-100 p-6">
            <Image
                src="/images/logos/luximia-petreos.png"
                alt="Logo"
                width={800}
                height={300}
                className="mx-auto"
                priority
            />
        </div>
    )
}

export default Dashboard