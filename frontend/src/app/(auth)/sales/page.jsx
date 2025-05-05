"use client";

import { useState, useEffect } from 'react';

const Ventas = () => {
    const [currentDate, setCurrentDate] = useState('');
    const [selectedClient, setSelectedClient] = useState('PUBLICO EN GENERAL');
    const [subtotal, setSubtotal] = useState(0);
    const [iva, setIva] = useState(0);
    const [total, setTotal] = useState(0);
    const [applyIva, setApplyIva] = useState(false);
    const [clientList, setClientList] = useState(['Cliente 1', 'Cliente 2', 'Cliente 3']);
    const [cartItems, setCartItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toLocaleDateString('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
        setCurrentDate(formattedDate);
    }, []);

    const handleIvaChange = () => setApplyIva(!applyIva);

    useEffect(() => {
        const newSubtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
        setSubtotal(newSubtotal);
        const ivaAmount = applyIva ? newSubtotal * 0.16 : 0;
        setIva(ivaAmount);
        setTotal(newSubtotal + ivaAmount);
    }, [applyIva, cartItems]);

    const addItem = (newItem) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === newItem.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === newItem.id
                        ? {
                            ...item,
                            quantity: item.quantity + 1,
                            total: (item.quantity + 1) * item.price
                        }
                        : item
                );
            }
            return [...prevItems, { ...newItem, quantity: 1, total: newItem.price }];
        });
    };

    const removeItem = (itemId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    };

    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity < 1) return;

        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId
                    ? {
                        ...item,
                        quantity: newQuantity,
                        total: newQuantity * item.price
                    }
                    : item
            )
        );
    };

    const handleSearch = async (e) => {
        if (e.key === 'Enter') {
            // Ejemplo de producto - Debes reemplazar con tu lógica de búsqueda real
            const mockProduct = {
                id: Date.now(),
                name: searchTerm,
                price: 100.00,
            };
            addItem(mockProduct);
            setSearchTerm('');
        }
    };

    const handleClientChange = (event) => {
        setSelectedClient(event.target.value);
    };

    return (
        <div className="flex flex-col">
            <div className="flex justify-between items-center p-4">
                <div className="flex space-x-4">
                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
                        Corte de Caja
                    </button>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                        Abono Clientes
                    </button>
                    <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg">
                        Abono Anticipos
                    </button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded-lg">
                        Solicitud de Cancelación
                    </button>
                </div>
                <div>
                    <span className="text-sm font-semibold text-gray-700">Fecha: {currentDate}</span>
                </div>
            </div>

            <div className="flex-grow bg-gray-100 p-6 overflow-y-auto">
                <div className="flex flex-col md:flex-row justify-between mb-6">
                    <input
                        type="text"
                        placeholder="Buscar artículo"
                        className="border p-2 rounded-lg w-full md:w-1/2 mb-4 md:mb-0"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                    <select
                        className="border p-2 rounded-lg w-full md:w-1/2"
                        value={selectedClient}
                        onChange={handleClientChange}
                    >
                        <option value="PUBLICO EN GENERAL">PUBLICO EN GENERAL</option>
                        {clientList.map((client, index) => (
                            <option key={index} value={client}>
                                {client}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-md">
                    <div className="flex-grow border p-2 rounded-lg bg-gray-100 text-left">
                        <strong>Cliente:</strong> {selectedClient}
                    </div>
                    <div className="flex flex-col items-end text-right ml-4">
                        <div>
                            <p className="font-bold">Saldo Anticipo:</p>
                            <p className="text-gray-500">$[Saldo Anticipo]</p>
                        </div>
                        <div className="mt-2">
                            <p className="font-bold">Saldo Crédito:</p>
                            <p className="text-gray-500">$[Saldo Crédito]</p>
                        </div>
                    </div>
                </div>

                <table className="table-auto w-full bg-white shadow-md rounded-lg mb-6">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-2">Acción</th>
                            <th className="px-4 py-2">Cantidad</th>
                            <th className="px-4 py-2">Descripción</th>
                            <th className="px-4 py-2">Precio Unitario</th>
                            <th className="px-4 py-2">Importe</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map((item) => (
                            <tr key={item.id}>
                                <td className="border px-4 py-2">
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="bg-red-500 text-white px-4 py-1 rounded"
                                    >
                                        Remover
                                    </button>
                                </td>
                                <td className="border px-4 py-2">
                                    <div className="flex items-center justify-center">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="bg-gray-200 px-2 rounded-l"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                            className="w-12 text-center border-y"
                                            min="1"
                                        />
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="bg-gray-200 px-2 rounded-r"
                                        >
                                            +
                                        </button>
                                    </div>
                                </td>
                                <td className="border px-4 py-2">{item.name}</td>
                                <td className="border px-4 py-2">${item.price.toFixed(2)}</td>
                                <td className="border px-4 py-2">${item.total.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <textarea
                    placeholder="Comentario"
                    className="w-full border p-2 rounded-lg mb-6"
                />

                <div className="flex justify-between items-center mb-6">
                    <p className="font-bold">Subtotal: <span className="text-gray-500">${subtotal.toFixed(2)}</span></p>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={applyIva}
                            onChange={handleIvaChange}
                            className="mr-2"
                        />
                        <label className="font-bold mr-2">IVA:</label>
                        <span className="text-gray-500">${iva.toFixed(2)}</span>
                    </div>
                    <p className="font-bold">Total: <span className="text-gray-500">${total.toFixed(2)}</span></p>
                </div>
            </div>
        </div>
    );
};

export default Ventas;