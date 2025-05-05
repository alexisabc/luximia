import { useState } from 'react';

const NewCustomerModal = ({ closeModal, onCustomerAdded }) => {
    const [formData, setFormData] = useState({
        clave: '',
        representante: '',
        nombre: '',
        rfc: '',
        domicilio: '',
        status: true,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/clientes/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                const newCustomer = await response.json();
                onCustomerAdded(newCustomer);
                closeModal();
            } else {
                console.error("Error adding customer");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Agregar Nuevo Cliente</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        name="clave"
                        value={formData.clave}
                        onChange={handleChange}
                        placeholder="Clave"
                        className="w-full p-2 border mb-2 rounded"
                        required
                    />
                    <input
                        name="representante"
                        value={formData.representante}
                        onChange={handleChange}
                        placeholder="Representante"
                        className="w-full p-2 border mb-2 rounded"
                        required
                    />
                    <input
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder="Nombre"
                        className="w-full p-2 border mb-2 rounded"
                        required
                    />
                    <input
                        name="rfc"
                        value={formData.rfc}
                        onChange={handleChange}
                        placeholder="RFC"
                        className="w-full p-2 border mb-2 rounded"
                        required
                    />
                    <input
                        name="domicilio"
                        value={formData.domicilio}
                        onChange={handleChange}
                        placeholder="Domicilio"
                        className="w-full p-2 border mb-2 rounded"
                        required
                    />
                    <div className="flex justify-end mt-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 bg-gray-400 text-white rounded-md mr-2"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewCustomerModal;

