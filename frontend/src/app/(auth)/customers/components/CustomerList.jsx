import { useEffect, useState } from 'react';
import NewCustomerModal from './NewCustomer';
import ConfirmDeleteModal from './DeleteCustomer';
import EditCustomerModal from './EditCustomer';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/clientes/`);
            const data = await response.json();

            // Ordena los clientes, colocando los activos (status: true) primero
            const sortedData = data.sort((a, b) => b.status - a.status);
            setCustomers(sortedData);
        } catch (error) {
            console.error("Error al obtener la lista de clientes:", error);
        }
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleCustomerSelect = (customerId) => {
        setSelectedCustomers((prevSelected) =>
            prevSelected.includes(customerId)
                ? prevSelected.filter((id) => id !== customerId)
                : [...prevSelected, customerId]
        );
    };

    const toggleSelecting = () => {
        setIsSelecting(!isSelecting);
        setSelectedCustomers([]);
    };

    const handleDeleteCustomers = async () => {
        try {
            await Promise.all(
                selectedCustomers.map(async (customerId) => {
                    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/clientes/${customerId}/`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: false }),
                    });
                })
            );
            fetchCustomers(); // Actualiza la tabla para reflejar los cambios
            setSelectedCustomers([]);
            setIsSelecting(false);
            setIsConfirmModalOpen(false);
        } catch (error) {
            console.error("Error al actualizar el estado del cliente:", error);
        }
    };

    const openConfirmModal = () => {
        if (selectedCustomers.length > 0) {
            setIsConfirmModalOpen(true);
        }
    };

    const closeConfirmModal = () => setIsConfirmModalOpen(false);

    const openEditModal = () => {
        if (selectedCustomers.length === 1) {
            setIsEditModalOpen(true);
        }
    };

    const closeEditModal = () => setIsEditModalOpen(false);

    return (
        <div className="p-4 bg-white rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4">Catálogo de Clientes</h2>

            {/* Botones de Nuevo Cliente y Seleccionar */}
            <div className="mb-4">
                <button
                    onClick={openModal}
                    className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-700 mr-2"
                >
                    Nuevo Cliente
                </button>
                <button
                    onClick={toggleSelecting}
                    className={`px-4 py-2 text-white rounded-md ${isSelecting ? 'bg-red-500' : 'bg-green-500'} hover:bg-opacity-75`}
                >
                    {isSelecting ? 'Cancelar Selección' : 'Seleccionar Clientes'}
                </button>
            </div>

            {/* Botón de Eliminar (visible solo si hay clientes seleccionados) */}
            {isSelecting && selectedCustomers.length > 0 && (
                <button
                    onClick={openConfirmModal}
                    className="mb-4 px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-700"
                >
                    Eliminar Cliente
                </button>
            )}

            {/* Botón de Editar (visible solo si hay exactamente 1 cliente seleccionado) */}
            {isSelecting && selectedCustomers.length === 1 && (
                <button
                    onClick={openEditModal}
                    className="mb-4 px-4 py-2 text-white bg-yellow-500 rounded-md hover:bg-yellow-700"
                >
                    Editar Cliente
                </button>
            )}

            {/* Lista de clientes en formato de tabla */}
            <table className="w-full text-left">
                <thead>
                    <tr>
                        {isSelecting && <th>Seleccionar</th>}
                        <th>ID</th>
                        <th>Clave</th>
                        <th>Representante</th>
                        <th>Nombre</th>
                        <th>RFC</th>
                        <th>Domicilio</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer) => (
                        <tr key={customer.id} className="border-b">
                            {isSelecting && (
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedCustomers.includes(customer.id)}
                                        onChange={() => handleCustomerSelect(customer.id)}
                                    />
                                </td>
                            )}
                            <td>{customer.id}</td>
                            <td>{customer.clave}</td>
                            <td>{customer.representante}</td>
                            <td>{customer.nombre}</td>
                            <td>{customer.rfc}</td>
                            <td>{customer.domicilio}</td>
                            <td>{customer.status ? 'Activo' : 'Inactivo'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal para agregar nuevo cliente */}
            {isModalOpen && <NewCustomerModal closeModal={closeModal} onCustomerAdded={fetchCustomers} />}

            {/* Modal de confirmación de eliminación */}
            {isConfirmModalOpen && (
                <ConfirmDeleteModal
                    isVisible={isConfirmModalOpen}
                    onConfirm={handleDeleteCustomers}
                    onCancel={closeConfirmModal}
                />
            )}

            {/* Modal de edición de cliente */}
            {isEditModalOpen && (
                <EditCustomerModal
                    customerId={selectedCustomers[0]}
                    onClose={closeEditModal}
                    onCustomerUpdated={fetchCustomers}
                />
            )}
        </div>
    );
};

export default CustomerList;
