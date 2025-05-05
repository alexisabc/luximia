import React, { useState } from 'react';

const EditAdvanceModal = ({ advance, onClose, onUpdateAdvance }) => {
    const [amount, setAmount] = useState('');

    if (!advance) return null;

    const handleAmountChange = (e) => {
        setAmount(Number(e.target.value));
    };

    const handleIncrease = async () => {
        if (amount > 0) {
            const newLimit = Number(advance.saldo_inicial) + Number(amount);
            const newAvailableBalance = Number(advance.saldo_disponible) + Number(amount);

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/anticipos/${advance.id}/`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        saldo_inicial: newLimit,
                        saldo_disponible: newAvailableBalance,
                    }),
                });

                if (response.ok) {
                    const updatedAdvance = await response.json();
                    onUpdateAdvance(updatedAdvance); // Actualiza el estado en AdvanceList
                    onClose();
                } else {
                    console.error("Error al actualizar el anticipo:", await response.text());
                }
            } catch (error) {
                console.error("Error al conectar con el servidor:", error);
            }
        }
    };

    const handleDecrease = async () => {
        if (amount > 0 && amount <= advance.saldo_inicial) {
            const newLimit = advance.saldo_inicial - amount;
            const newAvailableBalance = advance.saldo_disponible - amount;

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/anticipos/${advance.id}/`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        saldo_inicial: newLimit,
                        saldo_disponible: newAvailableBalance,
                    }),
                });

                if (response.ok) {
                    const updatedAdvance = await response.json();
                    onUpdateAdvance(updatedAdvance);
                    onClose();
                } else {
                    console.error("Error al actualizar el anticipo:", await response.text());
                }
            } catch (error) {
                console.error("Error al conectar con el servidor:", error);
            }
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-semibold mb-4">Editar Saldo Inicial</h2>

                <label className="block mb-2">
                    Saldo Inicial Actual:
                    <input
                        type="number"
                        value={advance.saldo_inicial}
                        readOnly
                        className="mt-1 block w-full border-gray-300 rounded-md"
                    />
                </label>

                <label className="block mb-2">
                    Monto a modificar:
                    <input
                        type="text"
                        value={amount}
                        onChange={handleAmountChange}
                        className="mt-1 block w-full border-gray-300 rounded-md"
                    />
                </label>

                <div className="flex justify-end mt-4">
                    <button onClick={handleIncrease} className="px-4 py-2 mr-2 text-white bg-green-500 rounded-md hover:bg-green-600">Aumentar</button>
                    <button onClick={handleDecrease} className="px-4 py-2 mr-2 text-white bg-red-500 rounded-md hover:bg-red-600">Disminuir</button>
                    <button onClick={onClose} className="px-4 py-2 bg-gray-500 rounded-md hover:bg-gray-600">Cerrar</button>
                </div>
            </div>
        </div>
    );
};

export default EditAdvanceModal;
