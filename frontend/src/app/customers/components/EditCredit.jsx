import React, { useState } from 'react';

const EditCreditModal = ({ credit, onClose, onUpdateCredit }) => {
    const [amount, setAmount] = useState('');

    if (!credit) return null;

    const handleAmountChange = (e) => {
        setAmount(Number(e.target.value));
    };

    const handleIncrease = async () => {
        if (amount > 0) {
            const newLimit = Number(credit.limite_credito) + Number(amount);
            const newAvailableBalance = Number(credit.saldo_disponible) + Number(amount);

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/creditos/${credit.id}/`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        limite_credito: newLimit,
                        saldo_disponible: newAvailableBalance,
                    }),
                });

                if (response.ok) {
                    const updatedCredit = await response.json();
                    onUpdateCredit(updatedCredit); // Actualiza el estado en CreditList
                    onClose();
                } else {
                    console.error("Error al actualizar el crédito:", await response.text());
                }
            } catch (error) {
                console.error("Error al conectar con el servidor:", error);
            }
        }
    };

    const handleDecrease = async () => {
        if (amount > 0 && amount <= credit.limite_credito) {
            const newLimit = credit.limite_credito - amount;
            const newAvailableBalance = credit.saldo_disponible - amount;

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/creditos/${credit.id}/`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        limite_credito: newLimit,
                        saldo_disponible: newAvailableBalance,
                    }),
                });

                if (response.ok) {
                    const updatedCredit = await response.json();
                    onUpdateCredit(updatedCredit);
                    onClose();
                } else {
                    console.error("Error al actualizar el crédito:", await response.text());
                }
            } catch (error) {
                console.error("Error al conectar con el servidor:", error);
            }
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-semibold mb-4">Editar Límite de Crédito</h2>

                <label className="block mb-2">
                    Límite de Crédito Actual:
                    <input
                        type="number"
                        value={credit.limite_credito}
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

export default EditCreditModal;
