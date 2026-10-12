import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  BarChart, Plus, Edit, Trash2, CheckCircle2, Eye, EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';
import { impactAPI } from '../../services/api';

export default function AdminImpactStats() {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStat, setEditingStat] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    label: '',
    value: 1000,
    suffix: '+',
    icon: 'heart',
    category: 'general',
    order: 1,
    isVisible: true,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await impactAPI.getAllAdmin();
      if (res.data.success) {
        setStats(res.data.stats || []);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch impact stats');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingStat(null);
    setFormData({
      label: '',
      value: 100,
      suffix: '+',
      icon: 'heart',
      category: 'general',
      order: stats.length + 1,
      isVisible: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (stat: any) => {
    setEditingStat(stat);
    setFormData({
      label: stat.label,
      value: stat.value,
      suffix: stat.suffix || '+',
      icon: stat.icon || 'heart',
      category: stat.category || 'general',
      order: stat.order || 1,
      isVisible: stat.isVisible !== false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingStat) {
        const res = await impactAPI.update(editingStat._id, formData);
        if (res.data.success) {
          toast.success('Impact metric updated');
          setStats((prev) =>
            prev.map((s) => (s._id === editingStat._id ? res.data.stat : s))
          );
          setIsModalOpen(false);
        }
      } else {
        const res = await impactAPI.create(formData);
        if (res.data.success) {
          toast.success('Impact metric added');
          setStats((prev) => [...prev, res.data.stat]);
          setIsModalOpen(false);
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save impact stat');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, label: string) => {
    if (!window.confirm(`Are you sure you want to delete "${label}"?`)) return;
    try {
      const res = await impactAPI.delete(id);
      if (res.data.success) {
        toast.success('Impact metric deleted');
        setStats((prev) => prev.filter((s) => s._id !== id));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete metric');
    }
  };

  const handleToggleVisibility = async (stat: any) => {
    try {
      const newStatus = !stat.isVisible;
      const res = await impactAPI.update(stat._id, { isVisible: newStatus });
      if (res.data.success) {
        toast.success(`Metric ${newStatus ? 'visible on site' : 'hidden from site'}`);
        setStats((prev) =>
          prev.map((s) => (s._id === stat._id ? { ...s, isVisible: newStatus } : s))
        );
      }
    } catch (error: any) {
      toast.error('Failed to toggle visibility');
    }
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Manage Impact Stats — NGO Admin Panel</title>
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-gray-900">Live Impact Counters</h2>
          <p className="text-sm text-gray-600">Update numbers shown on the public homepage counter (e.g. Lives Impacted, Trees Planted).</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Impact Metric
        </button>
      </div>

      {/* Grid of Impact Stat Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : stats.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <BarChart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-700">No impact metrics created yet</h3>
          <p className="text-sm text-gray-500 mt-1">Add your first counter metric to display on the live website.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {stats.map((s) => (
            <div
              key={s._id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 bg-primary-50 text-primary-700 rounded-md text-xs font-semibold capitalize">
                    {s.category}
                  </span>
                  <button
                    onClick={() => handleToggleVisibility(s)}
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                      s.isVisible !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {s.isVisible !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {s.isVisible !== false ? 'Live' : 'Hidden'}
                  </button>
                </div>

                <p className="text-3xl font-extrabold text-gray-900 mt-2">
                  {s.value?.toLocaleString('en-IN')}{s.suffix}
                </p>
                <h4 className="text-sm font-semibold text-gray-600 mt-1">{s.label}</h4>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => handleOpenEditModal(s)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(s._id, s.label)}
                  className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-heading font-bold text-lg text-gray-900">
                {editingStat ? 'Edit Impact Metric' : 'Add Impact Metric'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Metric Label *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lives Impacted, Trees Planted"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Target Number *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Suffix (e.g. +, %, k)</label>
                  <input
                    type="text"
                    value={formData.suffix}
                    onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="general">General</option>
                    <option value="education">Education</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="environment">Environment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isVisible"
                  checked={formData.isVisible}
                  onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <label htmlFor="isVisible" className="text-sm font-medium text-gray-700">
                  Visible on public website
                </label>
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
                  {isSubmitting ? 'Saving...' : 'Save Metric'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
