import { useState } from 'react';

const useModals = () => {
    const [modals, setModals] = useState({
        usuarios: false,
        roles: false,
        permisos: false,
    });

    const [selectedItems, setSelectedItems] = useState({
        usuario: null,
        rol: null,
        permiso: null,
    });

    const handleOpenModal = (type) => {
        setModals({
            usuarios: false,
            roles: false,
            permisos: false,
            [type]: true,
        });
    };

    const handleCloseModal = (type) => {
        setModals(prev => ({
            ...prev,
            [type]: false,
        }));
        setSelectedItems(prev => ({
            ...prev,
            [type.slice(0, -1)]: null,
        }));
    };

    const handleAddButton = (activeTab) => {
        setSelectedItems({
            usuario: null,
            rol: null,
            permiso: null,
        });
        handleOpenModal(activeTab);
    };

    return {
        modals,
        selectedItems,
        setSelectedItems,
        handleOpenModal,
        handleCloseModal,
        handleAddButton,
    };
};

export default useModals;