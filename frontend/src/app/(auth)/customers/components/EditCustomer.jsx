import { useState, useEffect } from 'react';

const EditCustomerModal = ({ customerId, onClose, onCustomerUpdated }) => {
    const [customerData, setCustomerData] = useState({
        clave: '',
        representante: '',
        nombre: '',
        rfc: '',
        domicilio: '',
        status: true,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Cargar los datos del cliente al abrir el modal
    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/clientes/${customerId}/`);
                const data = await response.json();
                setCustomerData(data);
            } catch (error) {
                console.error("Error al cargar los datos del cliente:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomerData();
    }, [customerId]);

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomerData((prevData) => ({
            ...prevData,
            [name]: name === 'status' ? e.target.checked : value,
        }));
    };

    // Guardar cambios en la base de datos
    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/clientes/${customerId}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(customerData),
            });

            if (response.ok) {
                onCustomerUpdated(); // Recargar la lista de clientes en el componente principal
                onClose(); // Cerrar el modal
            } else {
                console.error("Error al actualizar el cliente:", await response.json());
            }
        } catch (error) {
            console.error("Error al guardar los cambios del cliente:", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <p>Cargando datos del cliente...</p>;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-md w-96">
                <h2 className="text-xl font-bold mb-4">Editar Cliente</h2>

                <label className="block mb-2">
                    Clave:
                    <input
                        type="text"
                        name="clave"
                        value={customerData.clave}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </label>

                <label className="block mb-2">
                    Representante:
                    <input
                        type="text"
                        name="representante"
                        value={customerData.representante}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </label>

                <label className="block mb-2">
                    Nombre:
                    <input
                        type="text"
                        name="nombre"
                        value={customerData.nombre}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </label>

                <label className="block mb-2">
                    RFC:
                    <input
                        type="text"
                        name="rfc"
                        value={customerData.rfc}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </label>

                <label className="block mb-2">
                    Domicilio:
                    <input
                        type="text"
                        name="domicilio"
                        value={customerData.domicilio}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </label>

                <label className="block mb-4">
                    Status:
                    <input
                        type="checkbox"
                        name="status"
                        checked={customerData.status}
                        onChange={handleChange}
                        className="ml-2"
                    />
                </label>

                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2 hover:bg-gray-600"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className={`px-4 py-2 text-white rounded-md ${saving ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                        disabled={saving}
                    >
                        {saving ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditCustomerModal;
