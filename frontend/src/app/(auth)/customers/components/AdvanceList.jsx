"use client";
import { useEffect, useState } from 'react';
import NewAdvanceModal from './NewAdvance';
import EditAdvanceModal from './EditAdvance';
import ConfirmDeleteModal from './DeleteAdvance';

const AdvanceList = () => {
    const [advances, setAdvances] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedAdvance, setSelectedAdvance] = useState(null);
    const [selectedAdvances, setSelectedAdvances] = useState([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);

    useEffect(() => {
        const fetchAdvances = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/anticipos/`);
                const data = await response.json();
                setAdvances(data);
            } catch (error) {
                console.error("Error al obtener los anticipos:", error);
            }
        };

        fetchAdvances();
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

    const openEditModal = (advanceId) => {
        const selectedAdvance = advances.find((advance) => advance.id === advanceId);
        setSelectedAdvance(selectedAdvance);
        setIsEditModalOpen(true);
    };
    const closeEditModal = () => setIsEditModalOpen(false);

    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode);
        setSelectedAdvances([]);
    };

    const handleSelectAdvance = (advanceId) => {
        setSelectedAdvances((prev) =>
            prev.includes(advanceId) ? prev.filter((id) => id !== advanceId) : [...prev, advanceId]
        );
    };

    const confirmDeleteAdvances = () => {
        setIsConfirmDeleteModalOpen(true);
    };

    const handleDeleteAdvances = async () => {
        try {
            for (const advanceId of selectedAdvances) {
                await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/anticipos/${advanceId}/`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: false }),
                });
            }
            setAdvances((prev) => prev.map(advance =>
                selectedAdvances.includes(advance.id) ? { ...advance, status: false } : advance
            ));
            setSelectedAdvances([]);
            setIsSelectionMode(false);
        } catch (error) {
            console.error("Error al actualizar el estado de los anticipos:", error);
        } finally {
            setIsConfirmDeleteModalOpen(false);
        }
    };

    const addNewAdvance = (newAdvance) => {
        setAdvances([...advances, newAdvance]);
    };

    const updateAdvance = (updatedAdvance) => {
        setAdvances((prev) =>
            prev.map((advance) => (advance.id === updatedAdvance.id ? updatedAdvance : advance))
        );
    };

    return (
        <div className="p-4 bg-white rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4">Catálogo de Anticipos</h2>

            <div className="flex mb-4">
                <button onClick={openModal} className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-700">Nuevo Anticipo</button>
                <button onClick={toggleSelectionMode} className="ml-4 px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-700">
                    {isSelectionMode ? "Cancelar Selección" : "Seleccionar Anticipos"}
                </button>
                {isSelectionMode && selectedAdvances.length === 1 && (
                    <button onClick={() => openEditModal(selectedAdvances[0])} className="ml-4 px-4 py-2 text-white bg-yellow-500 rounded-md hover:bg-yellow-600">Editar Anticipos</button>
                )}
                {isSelectionMode && selectedAdvances.length > 0 && (
                    <button onClick={confirmDeleteAdvances} className="ml-4 px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-700">Eliminar Anticipos</button>
                )}
            </div>

            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        {isSelectionMode && <th className="text-center"></th>}
                        <th className="text-left">Cliente</th>
                        <th className="text-right">Saldo Inicial</th>
                        <th className="text-right">Saldo Disponible</th>
                        <th className="text-right">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {advances.length > 0 ? (
                        advances.map((advance) => {
                            const cliente = customers.find((c) => c.id === advance.id_cliente);
                            return (
                                <tr key={advance.id} className="border-b">
                                    {isSelectionMode && (
                                        <td className="text-center">
                                            <input type="checkbox" checked={selectedAdvances.includes(advance.id)} onChange={() => handleSelectAdvance(advance.id)} />
                                        </td>
                                    )}
                                    <td className="text-left">{cliente ? cliente.nombre : 'Cliente no encontrado'}</td>
                                    <td className="text-right">{Number(advance.saldo_inicial).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td className="text-right">{Number(advance.saldo_disponible).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td className="text-right">{advance.status ? 'Activo' : 'Inactivo'}</td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center py-4">No hay anticipos disponibles</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {isModalOpen && <NewAdvanceModal isModalOpen={isModalOpen} onClose={closeModal} customers={customers} onAdvanceAdded={addNewAdvance} />}
            {isEditModalOpen && selectedAdvance && (
                <EditAdvanceModal advance={selectedAdvance} onClose={closeEditModal} onUpdateAdvance={updateAdvance} />
            )}
            {isConfirmDeleteModalOpen && (
                <ConfirmDeleteModal
                    isVisible={isConfirmDeleteModalOpen}
                    onConfirm={handleDeleteAdvances}
                    onCancel={() => setIsConfirmDeleteModalOpen(false)}
                />
            )}
        </div>
    );
};

export default AdvanceList;
