import ConfirmModal from '../../../components/common/ConfirmModal';

const ConfirmDeleteModal = ({ isVisible, onConfirm, onCancel }) => {
    return (
        <ConfirmModal
            isVisible={isVisible}
            title="Confirmar Eliminación"
            message="¿Estás seguro de que deseas eliminar a este crédito?"
            confirmText="Eliminar"
            cancelText="Cancelar"
            onConfirm={onConfirm}
            onCancel={onCancel}
        />
    );
};

export default ConfirmDeleteModal;
