import React, { useState } from 'react';

const NewAdvanceModal = ({ isModalOpen, onClose, customers, onAdvanceAdded }) => {
    const [customerId, setCustomerId] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Crear el objeto de nuevo anticipo con los valores predeterminados
        const newAdvance = {
            id_cliente: customerId,
            saldo_inicial: parseFloat(amount),
            saldo_disponible: parseFloat(amount), // Saldo disponible igual al límite de anticipo
            status: true,
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/anticipos/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAdvance),
            });

            if (!response.ok) {
                throw new Error('Error al crear el nuevo anticipo');
            }

            const createdAdvance = await response.json();
            onAdvanceAdded(createdAdvance); // Agregar el anticipo a la lista
            onClose(); // Cerrar el modal
        } catch (error) {
            console.error("Error al añadir el anticipo:", error);
        }
    };

    return (
        isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-md shadow-md w-1/3">
                    <h3 className="text-lg font-semibold mb-4">Agregar Nuevo anticipo</h3>
                    <form onSubmit={handleSubmit}>
                        <label className="block mb-2">
                            Cliente:
                            <select
                                className="w-full px-3 py-2 border rounded-md"
                                value={customerId}
                                onChange={(e) => setCustomerId(e.target.value)}
                                required
                            >
                                <option value="">Selecciona un cliente</option>
                                {customers.map((customer) => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.nombre}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="block mb-2">
                            Saldo Inicial:
                            <input
                                type="number"
                                className="w-full px-3 py-2 border rounded-md"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </label>
                        <div className="flex justify-end mt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 mr-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                            >
                                Agregar anticipo
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};

export default NewAdvanceModal;
