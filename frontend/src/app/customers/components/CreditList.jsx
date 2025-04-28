"use client";
import { useEffect, useState } from 'react';
import NewCreditModal from './NewCredit';
import EditCreditModal from './EditCredit';
import ConfirmDeleteModal from './DeleteCredit'; // Importa el modal de confirmación

const CreditList = () => {
    const [credits, setCredits] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCredit, setSelectedCredit] = useState(null);
    const [selectedCredits, setSelectedCredits] = useState([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false); // Nuevo estado para el modal de confirmación

    useEffect(() => {
        const fetchCredits = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/creditos/`);
                const data = await response.json();
                setCredits(data);
            } catch (error) {
                console.error("Error al obtener los créditos:", error);
            }
        };

        fetchCredits();
    }, []);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/clientes/`);
                const data = await response.json();
                setCustomers(data);
            } catch (error) {
                console.error("Error al obtener los clientes:", error);
            }
        };

        fetchCustomers();
    }, []);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const openEditModal = (creditId) => {
        const selectedCredit = credits.find((credit) => credit.id === creditId);
        setSelectedCredit(selectedCredit);
        setIsEditModalOpen(true);
    };
    const closeEditModal = () => setIsEditModalOpen(false);

    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode);
        setSelectedCredits([]);
    };

    const handleSelectCredit = (creditId) => {
        setSelectedCredits((prev) =>
            prev.includes(creditId) ? prev.filter((id) => id !== creditId) : [...prev, creditId]
        );
    };

    const confirmDeleteCredits = () => {
        setIsConfirmDeleteModalOpen(true); // Abre el modal de confirmación
    };

    const handleDeleteCredits = async () => {
        try {
            for (const creditId of selectedCredits) {
                await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/creditos/${creditId}/`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: false }),
                });
            }
            setCredits((prev) => prev.map(credit =>
                selectedCredits.includes(credit.id) ? { ...credit, status: false } : credit
            ));
            setSelectedCredits([]);
            setIsSelectionMode(false);
        } catch (error) {
            console.error("Error al actualizar el estado de los créditos:", error);
        } finally {
            setIsConfirmDeleteModalOpen(false); // Cierra el modal después de la eliminación
        }
    };

    const addNewCredit = (newCredit) => {
        setCredits([...credits, newCredit]);
    };

    const updateCredit = (updatedCredit) => {
        setCredits((prev) =>
            prev.map((credit) => (credit.id === updatedCredit.id ? updatedCredit : credit))
        );
    };

    return (
        <div className="p-4 bg-white rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4">Catálogo de Créditos</h2>

            <div className="flex mb-4">
                <button onClick={openModal} className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-700">Nuevo Crédito</button>
                <button onClick={toggleSelectionMode} className="ml-4 px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-700">
                    {isSelectionMode ? "Cancelar Selección" : "Seleccionar Créditos"}
                </button>
                {isSelectionMode && selectedCredits.length === 1 && (
                    <button onClick={() => openEditModal(selectedCredits[0])} className="ml-4 px-4 py-2 text-white bg-yellow-500 rounded-md hover:bg-yellow-600">Editar Crédito</button>
                )}
                {isSelectionMode && selectedCredits.length > 0 && (
                    <button onClick={confirmDeleteCredits} className="ml-4 px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-700">Eliminar Créditos</button>
                )}
            </div>

            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        {isSelectionMode && <th className="text-center"></th>}
                        <th className="text-left">Cliente</th>
                        <th className="text-right">Límite Crédito</th>
                        <th className="text-right">Saldo Disponible</th>
                        <th className="text-right">Deuda Total</th>
                        <th className="text-right">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {credits.map((credit) => {
                        const cliente = customers.find((c) => c.id === credit.id_cliente);
                        return (
                            <tr key={credit.id} className="border-b">
                                {isSelectionMode && (
                                    <td className="text-center">
                                        <input type="checkbox" checked={selectedCredits.includes(credit.id)} onChange={() => handleSelectCredit(credit.id)} />
                                    </td>
                                )}
                                <td className="text-left">{cliente ? cliente.nombre : 'Cliente no encontrado'}</td>
                                <td className="text-right">{Number(credit.limite_credito).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="text-right">{Number(credit.saldo_disponible).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="text-right">{Number(credit.deuda_total).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="text-right">{credit.status ? 'Activo' : 'Inactivo'}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {isModalOpen && <NewCreditModal isModalOpen={isModalOpen} onClose={closeModal} customers={customers} onCreditAdded={addNewCredit} />}
            {isEditModalOpen && selectedCredit && (
                <EditCreditModal credit={selectedCredit} onClose={closeEditModal} onUpdateCredit={updateCredit} />
            )}
            {isConfirmDeleteModalOpen && (
                <ConfirmDeleteModal
                    isVisible={isConfirmDeleteModalOpen}
                    onConfirm={handleDeleteCredits}
                    onCancel={() => setIsConfirmDeleteModalOpen(false)}
                />
            )}
        </div>
    );
};

export default CreditList;
