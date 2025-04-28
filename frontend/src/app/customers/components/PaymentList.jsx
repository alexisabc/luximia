"use client";
import { useEffect, useState } from 'react';
import NewPaymentModal from './NewPayment';
import EditPaymentModal from './EditPayment';
import ConfirmDeleteModal from './DeletePayment';

const PaymentList = () => {
    const [payments, setPayments] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [selectedPayments, setSelectedPayments] = useState([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/abonocreditos/`);
                const data = await response.json();
                setPayments(data);
            } catch (error) {
                console.error("Error al obtener los abonos a crédito:", error);
            }
        };

        fetchPayments();
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

    const openEditModal = (paymentId) => {
        const selectedPayment = payments.find((payment) => payment.id === paymentId);
        setSelectedPayment(selectedPayment);
        setIsEditModalOpen(true);
    };
    const closeEditModal = () => setIsEditModalOpen(false);

    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode);
        setSelectedPayments([]);
    };

    const handleSelectPayment = (paymentId) => {
        setSelectedPayments((prev) =>
            prev.includes(paymentId) ? prev.filter((id) => id !== paymentId) : [...prev, paymentId]
        );
    };

    const confirmDeletePayments = () => {
        setIsConfirmDeleteModalOpen(true);
    };

    const handleDeletePayments = async () => {
        try {
            for (const paymentId of selectedPayments) {
                await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/abonocreditos/${paymentId}/`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: false }),
                });
            }
            setPayments((prev) => prev.map(payment =>
                selectedPayments.includes(payment.id) ? { ...payment, status: false } : payment
            ));
            setSelectedPayments([]);
            setIsSelectionMode(false);
        } catch (error) {
            console.error("Error al actualizar el estado de los abonos de creditos:", error);
        } finally {
            setIsConfirmDeleteModalOpen(false);
        }
    };

    const addNewPayment = (newPayment) => {
        setPayments([...payments, newPayment]);
    };

    const updatePayment = (updatedPayment) => {
        setPayments((prev) =>
            prev.map((payment) => (payment.id === updatedPayment.id ? updatedPayment : payment))
        );
    };

    return (
        <div className="p-4 bg-white rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4">Catálogo de Abono a Créditos</h2>

            <div className="flex mb-4">
                <button onClick={openModal} className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-700">Nuevo Abono</button>
                <button onClick={toggleSelectionMode} className="ml-4 px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-700">
                    {isSelectionMode ? "Cancelar Selección" : "Seleccionar Abonos"}
                </button>
                {isSelectionMode && selectedPayments.length === 1 && (
                    <button onClick={() => openEditModal(selectedPayments[0])} className="ml-4 px-4 py-2 text-white bg-yellow-500 rounded-md hover:bg-yellow-600">Editar Abonos</button>
                )}
                {isSelectionMode && selectedPayments.length > 0 && (
                    <button onClick={confirmDeletePayments} className="ml-4 px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-700">Eliminar Abonos</button>
                )}
            </div>

            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        {isSelectionMode && <th className="text-center"></th>}
                        <th className="text-left">Cliente</th>
                        <th className="text-right">Monto</th>
                        <th className="text-right">Fecha</th>
                        <th className="text-right">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.length > 0 ? (
                        payments.map((payment) => {
                            const cliente = customers.find((c) => c.id === payment.id_cliente);
                            return (
                                <tr key={payment.id} className="border-b">
                                    {isSelectionMode && (
                                        <td className="text-center">
                                            <input type="checkbox" checked={selectedPayments.includes(payment.id)} onChange={() => handleSelectPayment(payment.id)} />
                                        </td>
                                    )}
                                    <td className="text-left">{cliente ? cliente.nombre : 'Cliente no encontrado'}</td>
                                    <td className="text-right">{Number(payment.monto).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td className="text-right">{new Date(payment.fecha).toLocaleDateString('es-MX')}</td>
                                    <td className="text-right">{payment.status ? 'Activo' : 'Inactivo'}</td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center py-4">No hay abonos disponibles</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {isModalOpen && <NewPaymentModal isModalOpen={isModalOpen} onClose={closeModal} customers={customers} onPaymentAdded={addNewPayment} />}
            {isEditModalOpen && selectedPayment && (
                <EditPaymentModal payment={selectedPayment} onClose={closeEditModal} onUpdatePayment={updatePayment} />
            )}
            {isConfirmDeleteModalOpen && (
                <ConfirmDeleteModal
                    isVisible={isConfirmDeleteModalOpen}
                    onConfirm={handleDeletePayments}
                    onCancel={() => setIsConfirmDeleteModalOpen(false)}
                />
            )}
        </div>
    );
};

export default PaymentList;
