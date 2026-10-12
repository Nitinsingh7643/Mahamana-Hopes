import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Users, UserPlus, Search, ShieldCheck, ShieldAlert, 
  Trash2, Mail, Phone, Calendar, CheckCircle2, XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentAdminId, setCurrentAdminId] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
  });

  useEffect(() => {
    const userStr = localStorage.getItem('mhf_user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setCurrentAdminId(u._id || u.id);
      } catch (e) {}
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getUsers({ limit: 50 });
      if (res.data.success) {
        setUsers(res.data.users || []);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await adminAPI.updateUser(userId, { role: newRole });
      if (res.data.success) {
        toast.success(`Role updated to ${newRole}`);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await adminAPI.updateUser(userId, { isActive: !currentStatus });
      if (res.data.success) {
        toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'}`);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, isActive: !currentStatus } : u))
        );
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId: string, name: string) => {
    if (userId === currentAdminId) {
      toast.error('You cannot delete your own logged-in admin account!');
      return;
    }
    if (!window.confirm(`Are you sure you want to remove user "${name}"?`)) {
      return;
    }
    try {
      const res = await adminAPI.deleteUser(userId);
      if (res.data.success) {
        toast.success('User removed successfully');
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await adminAPI.createUser(formData);
      if (res.data.success) {
        toast.success('New user account created successfully');
        setUsers((prev) => [res.data.user, ...prev]);
        setIsModalOpen(false);
        setFormData({ name: '', email: '', password: '', role: 'admin' });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const adminsCount = users.filter((u) => u.role === 'admin').length;
  const activeCount = users.filter((u) => u.isActive !== false).length;

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Manage Users & Admins — NGO Admin Panel</title>
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-gray-900">Users & Admin Access</h2>
          <p className="text-sm text-gray-600">Control system administrators, assign roles, and manage NGO staff accounts.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold shadow-md transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" /> Add User / Admin
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Total Registered</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{users.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-semibold text-emerald-600">Administrators</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{adminsCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-semibold text-blue-600">Active Accounts</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{activeCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-semibold text-purple-600">Volunteers / Donors</p>
          <p className="text-2xl font-bold text-purple-700 mt-1">
            {users.filter((u) => u.role === 'volunteer' || u.role === 'donor').length}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-medium text-gray-500">Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="volunteer">Volunteer</option>
            <option value="donor">Donor</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-700">No users found</h3>
            <p className="text-sm text-gray-500 mt-1">Try clearing filters or search queries.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Email Address</th>
                  <th className="py-3.5 px-4">Role & Access</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4">Joined Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredUsers.map((u) => {
                  const isCurrentAdmin = u._id === currentAdminId;
                  return (
                    <tr key={u._id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                            u.role === 'admin' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 flex items-center gap-1.5">
                              {u.name}
                              {isCurrentAdmin && (
                                <span className="px-1.5 py-0.5 bg-primary-100 text-primary-700 rounded text-[10px] font-bold">
                                  You
                                </span>
                              )}
                            </p>
                            {u.phone && <p className="text-xs text-gray-400 font-mono">{u.phone}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-gray-700">
                        {u.email}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={u.role}
                            disabled={isCurrentAdmin}
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:ring-2 focus:ring-primary-500 capitalize ${
                              u.role === 'admin'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : u.role === 'volunteer'
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : 'bg-gray-50 text-gray-700 border-gray-200'
                            }`}
                          >
                            <option value="admin">Admin</option>
                            <option value="volunteer">Volunteer</option>
                            <option value="donor">Donor</option>
                            <option value="user">User</option>
                          </select>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          disabled={isCurrentAdmin}
                          onClick={() => handleToggleActive(u._id, u.isActive !== false)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            u.isActive !== false
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                          }`}
                        >
                          {u.isActive !== false ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" /> Active
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" /> Inactive
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-gray-500">
                        {new Date(u.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {!isCurrentAdmin ? (
                          <button
                            onClick={() => handleDeleteUser(u._id, u.name)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Remove User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-[11px] text-gray-400 italic">Self</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User / Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-heading font-bold text-lg text-gray-900">Create User or Admin</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="user@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Initial Password *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">System Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-500"
                >
                  <option value="admin">Administrator (Full Access)</option>
                  <option value="volunteer">Volunteer Member</option>
                  <option value="donor">Donor / Supporter</option>
                  <option value="user">Regular User</option>
                </select>
                <p className="text-[11px] text-gray-500 mt-1">
                  Selecting <strong>Administrator</strong> gives this account full access to the NGO Admin panel.
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold shadow transition-colors"
                >
                  {isSubmitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
