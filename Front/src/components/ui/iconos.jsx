import { 
    CheckCircle, 
    XCircle, 
    Pencil, 
    UserPlus,
    Save,
    X as CloseIcon
  } from 'lucide-react';
  
  export const ClientIcons = {
    // Estado
    Active: (props) => <CheckCircle {...props} />,
    Inactive: (props) => <XCircle {...props} />,
    
    // Acciones
    Edit: (props) => <Pencil {...props} />,
    Add: (props) => <UserPlus {...props} />,
    Save: (props) => <Save {...props} />,
    Close: (props) => <CloseIcon {...props} />,
  };
  
  export default ClientIcons;