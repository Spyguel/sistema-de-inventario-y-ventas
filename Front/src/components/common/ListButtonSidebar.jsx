import {HomeIcon, DocumentChartBarIcon, CubeIcon, TruckIcon, UserGroupIcon, UsersIcon, CogIcon, ArrowLeftOnRectangleIcon
  } from '@heroicons/react/24/solid';
  
  export const ListButtonsSidebar = [
    { 
      id: 'btn_home',
      title: 'Inicio',
      path: '/dashboard',
      icon: HomeIcon,
      gap: true
    },
    { 
      id: 'btn_informes',
      title: 'Informes',
      path: '/informes',
      icon: DocumentChartBarIcon
    },
    { 
      id: 'btn_productos',
      title: 'Productos',
      path: '/productos',
      icon: CubeIcon
    },
    { 
      id: 'btn_proveedores',
      title: 'Proveedores',
      path: '/proveedores',
      icon: TruckIcon
    },
    { 
      id: 'btn_clientes',
      title: 'Clientes',
      path: '/clientes',
      icon: UserGroupIcon
    },
    { 
      id: 'btn_movimientos',
      title: 'Movimientos',
      path: '/movimientos',
      icon: CubeIcon
    },
    { 
      id: 'btn_usuarios',
      title: 'Usuarios',
      path: '/usuarios',
      icon: UsersIcon,
      gap: true
    },
    { 
      id: 'btn_configuracion',
      title: 'Configuración',
      path: '/configuracion',
      icon: CogIcon
    },
    { 
      id: 'btn_logout',
      title: 'Cerrar Sesión',
      path: '/logout',
      icon: ArrowLeftOnRectangleIcon
    }
  ];

