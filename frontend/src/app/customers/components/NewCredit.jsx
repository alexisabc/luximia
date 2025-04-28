import React, { useState } from 'react';

const NewCreditModal = ({ isModalOpen, onClose, customers, onCreditAdded }) => {
    const [customerId, setCustomerId] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Crear el objeto de nuevo crédito con los valores predeterminados
        const newCredit = {
            id_cliente: customerId,
            limite_credito: parseFloat(amount),
            saldo_disponible: parseFloat(amount), // Saldo disponible igual al límite de crédito
            deuda_total: 0,
            status: true,
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/creditos/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCredit),
            });

            if (!response.ok) {
                throw new Error('Error al crear el nuevo crédito');
            }

            const createdCredit = await response.json();
            onCreditAdded(createdCredit); // Agregar el crédito a la lista
            onClose(); // Cerrar el modal
        } catch (error) {
            console.error("Error al añadir el crédito:", error);
        }
    };

    return (
        isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-md shadow-md w-1/3">
                    <h3 className="text-lg font-semibold mb-4">Agregar Nuevo Crédito</h3>
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
                            Límite de Crédito:
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
                                Agregar Crédito
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};

export default NewCreditModal;
