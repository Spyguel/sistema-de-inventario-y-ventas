import {HomeIcon, DocumentChartBarIcon, CubeIcon, TruckIcon, UserGroupIcon, UsersIcon, CogIcon, ArrowLeftOnRectangleIcon
  } from '@heroicons/react/24/solid';
  
  export const ListButtonsSidebar = [
    { 
      id: 'btn_home',
      name: 'Inicio',
      path: '/',
      icon: HomeIcon,
      gap: true
    },
    { 
      id: 'btn_informes',
      name: 'Informes',
      path: '/informes',
      icon: DocumentChartBarIcon
    },
    { 
      id: 'btn_productos',
      name: 'Productos',
      path: '/productos',
      icon: CubeIcon
    },
    { 
      id: 'btn_proveedores',
      name: 'Proveedores',
      path: '/proveedores',
      icon: TruckIcon
    },
    { 
      id: 'btn_clientes',
      name: 'Clientes',
      path: '/clientes',
      icon: UserGroupIcon
    },
    { 
      id: 'btn_movimientos',
      name: 'Movimientos',
      path: '/movimientos',
      icon: CubeIcon
    },
    { 
      id: 'btn_usuarios',
      name: 'Usuarios',
      path: '/usuarios',
      icon: UsersIcon,
      gap: true
    },
    { 
      id: 'btn_configuracion',
      name: 'Configuración',
      path: '/configuracion',
      icon: CogIcon
    },
    { 
      id: 'btn_logout',
      name: 'Cerrar Sesión',
      path: '/logout',
      icon: ArrowLeftOnRectangleIcon
    }
  ];

