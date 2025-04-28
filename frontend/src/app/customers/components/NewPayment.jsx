import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext'; // Asegúrate de usar la ruta correcta

const ALLOWED_PAYMENT_METHODS = {
    1: "EFECTIVO",
    2: "TRANSFERENCIA"
};

const formatNumber = (number) => {
    return new Intl.NumberFormat('es-MX', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number);
};

const NewPaymentModal = ({ isModalOpen, onClose, onPaymentAdded }) => {
    const { currentUser } = useAuth(); // Obtenemos el usuario del contexto
    const [customerId, setCustomerId] = useState('');
    const [amount, setAmount] = useState(0);
    const [formattedAmount, setFormattedAmount] = useState('');
    const [paymentMethodId, setPaymentMethodId] = useState('');
    const [paymentMethods] = useState(
        Object.entries(ALLOWED_PAYMENT_METHODS).map(([id, descripcion]) => ({
            id: Number(id),
            descripcion
        }))
    );
    const [creditData, setCreditData] = useState(null);
    const [loadingCredit, setLoadingCredit] = useState(false);
    const [creditError, setCreditError] = useState('');
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loadingClients, setLoadingClients] = useState(false);
    const [clientError, setClientError] = useState('');
    const inputRef = useRef(null);
 // Función para manejar cambios en el monto
    const handleAmountChange = (value) => {
        const cursorPosition = inputRef.current?.selectionStart;
        const originalValue = formattedAmount;

        if (value === "") {
            setAmount(0);
            setFormattedAmount('');
            return;
        }

        // Detectar si el usuario está escribiendo un punto
        const hasDecimalPoint = value.includes('.');
        const [integerPart = '', decimalPart = ''] = value.split('.');

        // Limpiar partes
        const cleanInteger = integerPart.replace(/\D/g, '');
        const cleanDecimal = decimalPart.replace(/\D/g, '').slice(0, 2);

        // Construir nuevo valor numérico
        const numericValue = cleanInteger || '0';
        const parsedNumber = parseFloat(`${numericValue}.${cleanDecimal}`);

        // Formatear parte entera con separadores
        const formattedInteger = new Intl.NumberFormat('es-MX').format(Number(numericValue));

        // Construir nuevo valor formateado
        let formatted = formattedInteger;

        // Preservar el punto decimal si el usuario lo está usando
        if (hasDecimalPoint || cleanDecimal) {
            formatted += `.${cleanDecimal}`;
        }

        // Si es 0.00 vaciar el campo
        if (numericValue === '0' && cleanDecimal === '00') {
            formatted = '';
        }

        setAmount(parsedNumber);
        setFormattedAmount(formatted);

        // Control del cursor
        setTimeout(() => {
            if (!inputRef.current) return;
            const newCursor = calculateCursorPosition(
                originalValue,
                formatted,
                cursorPosition,
                value
            );
            inputRef.current.setSelectionRange(newCursor, newCursor);
        }, 0);
    };
    const calculateCursorPosition = (oldValue, newValue, oldPos, newRawValue) => {
        const decimalIndex = newValue.indexOf('.');
        const oldDecimalIndex = oldValue.indexOf('.');
        const parts = newValue.split('.');
        const decimalDigits = parts[1] ? parts[1].length : 0;

        // Caso especial: cuando completamos 2 decimales
        if (decimalIndex !== -1 && decimalDigits === 2 && oldPos >= decimalIndex) {
            return decimalIndex + 3; // Posición después del segundo decimal
        }

        // Caso: usuario está escribiendo el punto decimal
        if (newRawValue.endsWith('.') && decimalIndex !== -1) {
            return decimalIndex + 1;
        }

        // Ajuste por comas en la parte entera
        const commaDiff = (newValue.match(/,/g) || []).length - (oldValue.match(/,/g) || []).length;
        let adjustedPos = oldPos + commaDiff;

        // Limitar posición si hay decimales
        if (decimalIndex !== -1) {
            // Si está en la parte decimal
            if (adjustedPos > decimalIndex) {
                const maxDecimalPos = decimalIndex + 3; // Posición máxima: después del segundo decimal
                adjustedPos = Math.min(adjustedPos, maxDecimalPos);
            }
            // Si está en la parte entera
            else {
                adjustedPos = Math.min(adjustedPos, decimalIndex);
            }
        }

        return Math.max(0, Math.min(adjustedPos, newValue.length));
    };    const handleAmountFocus = (e) => {
        if (formattedAmount === '0.00') {
            setFormattedAmount('');
        }
        setTimeout(() => {
            const len = e.target.value.length;
            e.target.setSelectionRange(len, len);
        }, 0);
    };
    const handleAmountBlur = () => {
        if (formattedAmount === '') {
            setFormattedAmount('0.00');
            setAmount(0);
        } else {
            // Forzar formato completo con 2 decimales
            const [integer = '0', decimal = '00'] = formattedAmount.split('.');
            const paddedDecimal = decimal.padEnd(2, '0').slice(0, 2);
            const finalValue = `${integer.replace(/\D/g, '')}.${paddedDecimal}`;

            setFormattedAmount(formatNumber(parseFloat(finalValue)));
            setAmount(parseFloat(finalValue));
        }
    };
    // Obtener clientes con crédito válido al abrir el modal
    useEffect(() => {
        const fetchClientesConCredito = async () => {
            if (!isModalOpen) return;

            setLoadingClients(true);
            setClientError('');

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/clientes-con-credito/`
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Error en la respuesta del servidor');
                }

                const data = await response.json();

                if (!Array.isArray(data)) {
                    throw new Error('Formato de respuesta inválido');
                }

                const validClientes = data.filter(c => c.credito !== null);
                setFilteredCustomers(validClientes);

            } catch (error) {
                console.error("Error obteniendo clientes:", error);
                setClientError(error.message);
                setFilteredCustomers([]);
            } finally {
                setLoadingClients(false);
            }
        };

        fetchClientesConCredito();
    }, [isModalOpen]);

    // Obtener datos del crédito al seleccionar cliente
    useEffect(() => {
        const fetchCreditData = async () => {
            if (!customerId) {
                setCreditData(null);
                return;
            }

            setLoadingCredit(true);
            setCreditData(null);
            setCreditError('');

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/creditos/${customerId}/?status=true&_=${Date.now()}`
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || `Error ${response.status}`);
                }

                const credit = await response.json();

                if (!credit.status || credit.deuda_total <= 0) {
                    throw new Error('Crédito no válido para abonos');
                }

                const parsedCredit = {
                    ...credit,
                    limite_credito: Number(credit.limite_credito),
                    saldo_disponible: Number(credit.saldo_disponible),
                    deuda_total: Number(credit.deuda_total)
                };

                setCreditData(parsedCredit);
                setCreditError('');
            } catch (error) {
                console.error("Error obteniendo crédito:", error);
                setCreditError(error.message);
                setCreditData(null);
            } finally {
                setLoadingCredit(false);
            }
        };

        fetchCreditData();
    }, [customerId]);

    // Resetear todo al cerrar el modal
    useEffect(() => {
        if (!isModalOpen) {
            setCustomerId('');
            setAmount('');
            setPaymentMethodId('');
            setCreditData(null);
            setCreditError('');
        }
    }, [isModalOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verificar usuario autenticado
        if (!currentUser) {
            alert('Debe estar autenticado para realizar esta acción');
            return;
        }

        // Resto de validaciones (sin cambios)
        if (!creditData) {
            alert('Verifique los datos del crédito primero');
            return;
        }

        const paymentAmount = parseFloat(amount);
        if (paymentAmount <= 0 || isNaN(paymentAmount)) {
            alert('Ingrese un monto válido mayor a 0');
            return;
        }

        if (paymentAmount > creditData.deuda_total) {
            alert(`El monto excede la deuda total ($${creditData.deuda_total.toFixed(2)})`);
            return;
        }

        try {
            // Crear abono con usuario autenticado
            const newPayment = {
                fecha: new Date().toISOString(),
                id_usuario: currentUser.id, // Usamos el ID del contexto
                id_cliente: customerId,
                monto: paymentAmount,
                id_metodo_pago: paymentMethodId,
                status: true
            };

            const paymentResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/abonocreditos/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPayment),
            });

            if (!paymentResponse.ok) {
                const errorData = await paymentResponse.json();
                throw new Error(errorData.detail || 'Error registrando el abono');
            }

            // Actualizar crédito (corrección aplicada aquí)
            const updatedCredit = {
                deuda_total: creditData.deuda_total - paymentAmount,
                saldo_disponible: creditData.saldo_disponible + paymentAmount
            };

            const creditResponse = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/creditos/${creditData.id}/`,
                {  // Objeto de opciones correctamente formado
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedCredit),
                }
            );

            if (!creditResponse.ok) {
                throw new Error('Error actualizando el crédito');
            }

            // Actualizar lista de abonos
            onPaymentAdded({
                ...newPayment,
                id: (await paymentResponse.json()).id,
                cliente: filteredCustomers.find(c => c.id === customerId)?.nombre,
                metodo_pago: ALLOWED_PAYMENT_METHODS[paymentMethodId],
                fecha: new Date().toLocaleString('es-MX')
            });

            onClose();
        } catch (error) {
            console.error("Error en el proceso:", error);
            alert(`Error: ${error.message}`);
        }
    };

return (
    isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-md w-11/12 md:w-2/3 lg:w-1/3">
                <h3 className="text-lg font-semibold mb-4">Registrar Nuevo Abono</h3>

                {/* Errores generales */}
                {clientError && (
                    <div className="mb-4 p-3 bg-red-100 rounded-md">
                        <p className="text-red-600 text-sm">{clientError}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Selección de cliente */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cliente:
                        </label>
                        {loadingClients ? (
                            <div className="animate-pulse">
                                <div className="h-9 bg-gray-200 rounded-md"></div>
                            </div>
                        ) : (
                            <select
                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={customerId}
                                onChange={(e) => setCustomerId(e.target.value)}
                                required
                                disabled={filteredCustomers.length === 0}
                            >
                                <option value="">Seleccione un cliente</option>
                                {filteredCustomers.map((customer) => (
                                    <option
                                        key={customer.id}
                                        value={customer.id}
                                        className="flex justify-between"
                                    >
                                        {customer.nombre}
                                    </option>
                                ))}
                            </select>
                        )}
                        {filteredCustomers.length === 0 && !loadingClients && (
                            <p className="mt-2 text-sm text-yellow-600">
                                No hay clientes con crédito disponible
                            </p>
                        )}
                    </div>

                    {/* Información del crédito */}
                    {loadingCredit && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-md animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                    )}

                    {creditError && (
                        <div className="mb-4 p-3 bg-red-100 rounded-md">
                            <p className="text-red-600 text-sm">{creditError}</p>
                        </div>
                    )}

                    {creditData && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-md">
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <p className="font-medium">Límite:</p>
                                    <p>${formatNumber(creditData.limite_credito)}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Disponible:</p>
                                    <p>${formatNumber(creditData.saldo_disponible)}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Deuda:</p>
                                    <p className="text-red-600">${formatNumber(creditData.deuda_total)}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Método de pago */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Método de Pago:
                        </label>
                        <select
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={paymentMethodId}
                            onChange={(e) => setPaymentMethodId(e.target.value)}
                            required
                        >
                            <option value="">Seleccione un método</option>
                            {paymentMethods.map((method) => (
                                <option key={method.id} value={method.id}>
                                    {method.descripcion}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Monto */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Monto a abonar:
                        </label>
                        <input
                            type="text"
                            inputMode="decimal"
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ej. 1,500.00"
                            value={formattedAmount}
                            onChange={(e) => handleAmountChange(e.target.value)}
                            onFocus={handleAmountFocus}
                            onBlur={handleAmountBlur}
                            ref={inputRef}
                            required
                        />
                        {creditData && (
                            <p className="mt-1 text-sm text-gray-500">
                                Máximo permitido: {formatNumber(creditData.deuda_total)}
                            </p>
                        )}
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                            disabled={!!creditError || !creditData}
                        >
                            Registrar Abono
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
);
};

export default NewPaymentModal;