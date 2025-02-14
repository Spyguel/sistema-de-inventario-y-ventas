//import { Message } from '../components/common/common/Messages/Message';
import Button  from '../components/common/button';
import Input  from '../components/common/common/Forms/Imputs/textInput';
import Select  from '../components/common/common/Forms/Imputs/SelectInput';
import ClienteTable  from '../components/Tablas/ClientesTable';
import ClientIcons from '../components/ui/iconos';

const Cliente = () => {
  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Tipo', accessor: 'tipo' },
    { header: 'Contacto', accessor: 'contacto' },
    { header: 'Email', accessor: 'email' },
    {
      header: 'Estado',
      accessor: 'estado',
      cell: (active) => (
        <Button 
          variant={active ? "success" : "destructive"} 
          className="w-8 h-8 p-0"
        >
          {active ? 
            <ClientIcons.Active className="h-4 w-4" /> : 
            <ClientIcons.Inactive className="h-4 w-4" />
          }
        </Button>
      )
    },
    {
      header: 'Acciones',
      accessor: 'acciones',
      cell: () => (
        <Button variant="outline" className="w-8 h-8 p-0">
          <ClientIcons.Edit className="h-4 w-4" />
        </Button>
      )
    }
  ];

  const data = [
    {
      id: 1,
      nombre: 'Juan Pérez',
      tipo: 'Proveedor',
      contacto: 'Dirección: Calle 123, Teléfono: 123-456-789',
      email: 'juan.perez@example.com',
      estado: true
    },
    {
      id: 2,
      nombre: 'María Gómez',
      tipo: 'Cliente',
      contacto: 'Dirección: Avenida 456, Teléfono: 987-654-321',
      email: 'maria.gomez@example.com',
      estado: false
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Gestión de Clientes</h2>
          <Button variant="primary" className="flex items-center gap-2">
            <ClientIcons.Add className="h-4 w-4" />
            <span>Agregar Cliente</span>
          </Button>
        </div>

        <ClienteTable 
          columns={columns}
          data={data}
          className="w-full"
        />

        {/* Modal Form */}
        <div className="hidden">
          <div className="space-y-4 max-w-md mx-auto">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Agregar Cliente</h3>
              <Button variant="ghost" className="w-8 h-8 p-0">
                <ClientIcons.Close className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre</label>
              <Input 
                type="text"
                placeholder="Ingrese nombre"
                name="nombre"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Contacto</label>
              <Select
                name="tipo"
                options={[
                  { value: 'proveedor', label: 'Proveedor' },
                  { value: 'cliente', label: 'Cliente' }
                ]}
                placeholder="Seleccionar Tipo"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Información de Contacto</label>
              <Input
                type="text"
                placeholder="Dirección y teléfono"
                name="contacto"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="ejemplo@correo.com"
                name="email"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="submit" variant="success" className="flex items-center gap-2">
                <ClientIcons.Save className="h-4 w-4" />
                <span>Guardar</span>
              </Button>
              <Button type="button" variant="secondary" className="flex items-center gap-2">
                <ClientIcons.Close className="h-4 w-4" />
                <span>Cancelar</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cliente;