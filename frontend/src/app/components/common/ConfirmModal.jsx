const ConfirmModal = ({
    title = "Confirmación",
    message = "¿Estás seguro de que deseas continuar?",
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    onConfirm,
    onCancel,
    isVisible = false,
}) => {
    if (!isVisible) return null; // Si no está visible, no renderiza nada

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-md w-1/3">
                <h3 className="text-lg font-semibold mb-4">{title}</h3>
                <p className="mb-6">{message}</p>
                <div className="flex justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 mr-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
