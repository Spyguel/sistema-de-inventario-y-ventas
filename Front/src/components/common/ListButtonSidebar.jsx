import {HomeIcon, DocumentChartBarIcon, CubeIcon, TruckIcon, UserGroupIcon, UsersIcon, CogIcon, ArrowLeftOnRectangleIcon
} from '@heroicons/react/20/solid';
export const ListButtonsSidebar = [
  { 
    id: 'btn_home',
    title: 'Inicio',
    path: '/dashboard',
    icon: HomeIcon,
    gap: true,
    permiso: null // Todos pueden verlo
  },
  { 
    id: 'btn_informes',
    title: 'Informes',
    path: '/informes',
    icon: DocumentChartBarIcon,
    permiso: 'ver_informes'
  },
  { 
    id: 'btn_productos',
    title: 'Productos',
    path: '/productos',
    icon: CubeIcon,
    permiso: 'gestionar_productos'
  },
  { 
    id: 'btn_proveedores',
    title: 'Proveedores',
    path: '/proveedores',
    icon: TruckIcon,
    permiso: 'gestionar_proveedores'
  },
  { 
    id: 'btn_clientes',
    title: 'Clientes',
    path: '/clientes',
    icon: UserGroupIcon,
    permiso: 'gestionar_clientes'
  },
  { 
    id: 'btn_movimientos',
    title: 'Movimientos',
    path: '/movimientos',
    icon: CubeIcon,
    permiso: 'gestionar_movimientos'
  },
  { 
    id: 'btn_usuarios',
    title: 'Usuarios',
    path: '/usuarios',
    icon: UsersIcon,
    gap: true,
    permiso: 'gestionar_usuarios'
  },
  { 
    id: 'btn_configuracion',
    title: 'Configuración',
    path: '/configuracion',
    icon: CogIcon,
    permiso: 'ver_configuracion',
    rolRequerido: 'Administrador' // Requiere rol + permiso
  },
  { 
    id: 'btn_logout',
    title: 'Cerrar Sesión',
    path: '/logout',
    icon: ArrowLeftOnRectangleIcon,
    permiso: null // Todos pueden verlo
  }
];