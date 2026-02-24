import React, { useState } from 'react';
import { Users, Plus, Trash2, Edit2, Shield, Mail, Phone, CheckCircle, XCircle } from 'lucide-react';

const UserManagement = ({ storeId = 'STORE-001' }) => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Manager',
      email: 'john@store.com',
      phone: '(555) 123-4567',
      role: 'Manager',
      status: 'active',
      created: '2024-01-15',
      lastLogin: '2024-01-20 14:30',
      permissions: ['view_all', 'manage_incidents', 'manage_users', 'export_data'],
      twoFactorEnabled: true,
    },
    {
      id: 2,
      name: 'Sarah Security',
      email: 'sarah@store.com',
      phone: '(555) 234-5678',
      role: 'Security Officer',
      status: 'active',
      created: '2024-01-20',
      lastLogin: '2024-01-20 16:45',
      permissions: ['view_all', 'respond_incidents'],
      twoFactorEnabled: false,
    },
    {
      id: 3,
      name: 'Mike Admin',
      email: 'mike@store.com',
      phone: '(555) 345-6789',
      role: 'Admin',
      status: 'active',
      created: '2024-01-01',
      lastLogin: '2024-01-20 09:15',
      permissions: ['view_all', 'manage_all', 'manage_users', 'export_data', 'modify_settings'],
      twoFactorEnabled: true,
    },
    {
      id: 4,
      name: 'Lisa Operator',
      email: 'lisa@store.com',
      phone: '(555) 456-7890',
      role: 'Operator',
      status: 'inactive',
      created: '2024-02-10',
      lastLogin: '2024-01-18 11:20',
      permissions: ['view_limited', 'respond_incidents'],
      twoFactorEnabled: false,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Operator',
    permissions: [],
  });

  const roles = [
    {
      name: 'Admin',
      description: 'Acceso completo al sistema',
      permissions: ['view_all', 'manage_all', 'manage_users', 'export_data', 'modify_settings'],
    },
    {
      name: 'Manager',
      description: 'Gestión de tienda',
      permissions: ['view_all', 'manage_incidents', 'manage_users', 'export_data'],
    },
    {
      name: 'Security Officer',
      description: 'Respuesta a incidentes',
      permissions: ['view_all', 'respond_incidents', 'export_data'],
    },
    {
      name: 'Operator',
      description: 'Acceso limitado',
      permissions: ['view_limited', 'respond_incidents'],
    },
    {
      name: 'Viewer',
      description: 'Acceso de solo lectura',
      permissions: ['view_limited'],
    },
  ];

  const allPermissions = [
    { key: 'view_all', label: 'Ver Todos los Datos' },
    { key: 'view_limited', label: 'Ver Datos Limitados' },
    { key: 'manage_incidents', label: 'Gestionar Incidentes' },
    { key: 'respond_incidents', label: 'Responder a Incidentes' },
    { key: 'manage_users', label: 'Gestionar Usuarios' },
    { key: 'manage_all', label: 'Gestionar Todos los Sistemas' },
    { key: 'export_data', label: 'Exportar Datos' },
    { key: 'modify_settings', label: 'Modificar Configuración' },
  ];

  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        permissions: user.permissions,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'Operator',
        permissions: [],
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleSaveUser = () => {
    const roleData = roles.find((r) => r.name === formData.role);
    if (!roleData) return;

    if (editingUser) {
      setUsers(
        users.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                ...formData,
                permissions: roleData.permissions,
              }
            : u
        )
      );
    } else {
      const newUser = {
        id: Math.max(...users.map((u) => u.id), 0) + 1,
        ...formData,
        permissions: roleData.permissions,
        status: 'active',
        created: new Date().toISOString().split('T')[0],
        lastLogin: 'Nunca',
        twoFactorEnabled: false,
      };
      setUsers([...users, newUser]);
    }
    closeModal();
  };

  const handleDeleteUser = (id) => {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const handleToggleStatus = (id) => {
    setUsers(
      users.map((u) =>
        u.id === id
          ? {
              ...u,
              status: u.status === 'active' ? 'inactive' : 'active',
            }
          : u
      )
    );
  };

  const filteredUsers = users.filter((user) => {
    if (filterRole !== 'all' && user.role !== filterRole) return false;
    if (filterStatus !== 'all' && user.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6" />
          Gestión de Usuarios
        </h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition"
        >
          <Plus className="w-5 h-5" />
          Agregar Usuario
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
          <p className="text-sm text-gray-400">Total de Usuarios</p>
          <p className="text-3xl font-bold text-white">{users.length}</p>
        </div>
        <div className="bg-green-900/30 rounded-lg border border-green-700/50 p-4">
          <p className="text-sm text-green-300">Activos</p>
          <p className="text-3xl font-bold text-green-300">
            {users.filter((u) => u.status === 'active').length}
          </p>
        </div>
        <div className="bg-gray-700/30 rounded-lg border border-gray-600/50 p-4">
          <p className="text-sm text-gray-300">Inactivos</p>
          <p className="text-3xl font-bold text-gray-300">
            {users.filter((u) => u.status === 'inactive').length}
          </p>
        </div>
        <div className="bg-blue-900/30 rounded-lg border border-blue-700/50 p-4">
          <p className="text-sm text-blue-300">2FA Habilitado</p>
          <p className="text-3xl font-bold text-blue-300">
            {users.filter((u) => u.twoFactorEnabled).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 flex gap-4 flex-wrap">
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Filtrar por Rol</label>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
          >
            <option value="all">Todos los Roles</option>
            {roles.map((r) => (
              <option key={r.name} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Filtrar por Estado</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
          >
            <option value="all">Todos los Estados</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-900 border-b border-gray-700">
              <tr>
                <th className="text-left py-3 px-4 text-gray-400">Nombre</th>
                <th className="text-left py-3 px-4 text-gray-400">Correo</th>
                <th className="text-left py-3 px-4 text-gray-400">Rol</th>
                <th className="text-left py-3 px-4 text-gray-400">Estado</th>
                <th className="text-left py-3 px-4 text-gray-400">Último Acceso</th>
                <th className="text-left py-3 px-4 text-gray-400">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-700 hover:bg-gray-700/50 transition"
                >
                  <td className="py-3 px-4 font-medium">{user.name}</td>
                  <td className="py-3 px-4 text-gray-400">{user.email}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Shield className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-300">{user.role}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        user.status === 'active'
                          ? 'bg-green-900/50 text-green-300'
                          : 'bg-gray-700 text-gray-400'
                      }`}
                    >
                      {user.status === 'active' ? (
                        <>
                          <CheckCircle className="w-3 h-3 inline mr-1" />
                          Activo
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 inline mr-1" />
                          Inactivo
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-400">{user.lastLogin}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal(user)}
                        className="p-1.5 bg-blue-700 hover:bg-blue-600 rounded transition"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4 text-blue-100" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded transition"
                        title="Cambiar Estado"
                      >
                        {user.status === 'active' ? (
                          <XCircle className="w-4 h-4 text-gray-300" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-1.5 bg-red-700 hover:bg-red-600 rounded transition"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4 text-red-100" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg border border-gray-700 max-w-md w-full p-6 space-y-4">
            <h3 className="text-xl font-bold">
              {editingUser ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-400 block mb-1">Nombre</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-1">Correo</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-1">Rol</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  {roles.map((r) => (
                    <option key={r.name} value={r.name}>
                      {r.name} - {r.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-2">Permisos</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {allPermissions.map((perm) => (
                    <label
                      key={perm.key}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(perm.key)}
                        disabled
                        className="w-4 h-4 rounded cursor-not-allowed opacity-50"
                      />
                      <span className="text-sm text-gray-400">
                        {perm.label}
                      </span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Los permisos se establecen según el rol
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={handleSaveUser}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition"
              >
                Guardar
              </button>
              <button
                onClick={closeModal}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded font-semibold transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Reference */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role) => (
          <div
            key={role.name}
            className="bg-gray-800 rounded-lg border border-gray-700 p-4 space-y-2"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              <h4 className="font-semibold">{role.name}</h4>
            </div>
            <p className="text-xs text-gray-400">{role.description}</p>
            <div className="text-xs text-gray-500">
              <p className="font-semibold mb-1">Permisos:</p>
              <ul className="space-y-1">
                {role.permissions.slice(0, 3).map((perm) => (
                  <li key={perm} className="text-gray-400">
                    • {allPermissions.find((p) => p.key === perm)?.label}
                  </li>
                ))}
                {role.permissions.length > 3 && (
                  <li className="text-gray-400">
                    • +{role.permissions.length - 3} more
                  </li>
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;
