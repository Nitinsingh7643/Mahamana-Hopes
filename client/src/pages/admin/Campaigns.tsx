import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Megaphone, Plus, Search, Filter, Edit, Trash2, 
  MapPin, Calendar, IndianRupee, Users, Star, CheckCircle, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { campaignAPI } from '../../services/api';

const categories = [
  { value: 'education', label: 'Education' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'environment', label: 'Environment' },
  { value: 'community', label: 'Community' },
];

const sampleImages = [
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800',
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
  'https://images.unsplash.com/photo-1532629345422-7515f3d16bb7?w=800',
];

export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    category: 'education',
    location: '',
    goalAmount: 500000,
    raisedAmount: 0,
    volunteersRequired: 50,
    volunteersJoined: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    image: sampleImages[0],
    status: 'active',
    isFeatured: true,
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await campaignAPI.getAll({ limit: 50 });
      if (res.data.success) {
        setCampaigns(res.data.campaigns || []);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingCampaign(null);
    setFormData({
      title: '',
      shortDescription: '',
      description: '',
      category: 'education',
      location: 'Varanasi, Uttar Pradesh',
      goalAmount: 250000,
      raisedAmount: 0,
      volunteersRequired: 30,
      volunteersJoined: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      image: sampleImages[0],
      status: 'active',
      isFeatured: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (campaign: any) => {
    setEditingCampaign(campaign);
    setFormData({
      title: campaign.title || '',
      shortDescription: campaign.shortDescription || '',
      description: campaign.description || '',
      category: campaign.category || 'education',
      location: campaign.location || '',
      goalAmount: campaign.goalAmount || 0,
      raisedAmount: campaign.raisedAmount || 0,
      volunteersRequired: campaign.volunteersRequired || 0,
      volunteersJoined: campaign.volunteersJoined || 0,
      startDate: campaign.startDate ? new Date(campaign.startDate).toISOString().split('T')[0] : '',
      endDate: campaign.endDate ? new Date(campaign.endDate).toISOString().split('T')[0] : '',
      image: campaign.image || sampleImages[0],
      status: campaign.status || 'active',
      isFeatured: campaign.isFeatured || false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingCampaign) {
        const res = await campaignAPI.update(editingCampaign._id, formData);
        if (res.data.success) {
          toast.success('Campaign updated successfully');
          setCampaigns((prev) =>
            prev.map((c) => (c._id === editingCampaign._id ? res.data.campaign : c))
          );
          setIsModalOpen(false);
        }
      } else {
        const res = await campaignAPI.create(formData);
        if (res.data.success) {
          toast.success('Campaign created successfully');
          setCampaigns((prev) => [res.data.campaign, ...prev]);
          setIsModalOpen(false);
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save campaign');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the campaign "${title}"?`)) {
      return;
    }
    try {
      const res = await campaignAPI.delete(id);
      if (res.data.success) {
        toast.success('Campaign deleted successfully');
        setCampaigns((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete campaign');
    }
  };

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch =
      c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalRaised = campaigns.reduce((acc, c) => acc + (c.raisedAmount || 0), 0);
  const totalGoal = campaigns.reduce((acc, c) => acc + (c.goalAmount || 0), 0);

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Manage Campaigns — NGO Admin Panel</title>
      </Helmet>

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-gray-900">NGO Campaigns & Drives</h2>
          <p className="text-sm text-gray-600">Launch fundraising drives, field programs, and track volunteer mobilization.</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Campaign
        </button>
      </div>

      {/* Stats Summary Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Total Campaigns</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{campaigns.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-semibold text-emerald-600">Active Campaigns</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">
            {campaigns.filter((c) => c.status === 'active').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Total Funds Raised</p>
          <p className="text-2xl font-bold text-primary-600 mt-1">₹{totalRaised.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Fundraising Target</p>
          <p className="text-2xl font-bold text-gray-700 mt-1">₹{totalGoal.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search campaigns by title, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Campaign Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-700">No campaigns found</h3>
          <p className="text-sm text-gray-500 mt-1">Get started by creating your first NGO campaign.</p>
          <button
            onClick={handleOpenCreateModal}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
          >
            Add Campaign
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((camp) => {
            const percent = camp.goalAmount ? Math.min(100, Math.round((camp.raisedAmount / camp.goalAmount) * 100)) : 0;
            return (
              <div
                key={camp._id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow group"
              >
                {/* Image & Badges */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={camp.image || sampleImages[0]}
                    alt={camp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold rounded-md capitalize">
                      {camp.category}
                    </span>
                    {camp.isFeatured && (
                      <span className="px-2 py-1 bg-amber-500 text-white text-[11px] font-semibold rounded-md flex items-center gap-1 shadow-sm">
                        <Star className="w-3 h-3 fill-white" /> Featured
                      </span>
                    )}
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-md capitalize shadow-sm ${
                      camp.status === 'active' ? 'bg-emerald-500 text-white' :
                      camp.status === 'upcoming' ? 'bg-blue-500 text-white' :
                      camp.status === 'completed' ? 'bg-gray-800 text-white' :
                      'bg-rose-500 text-white'
                    }`}>
                      {camp.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-gray-900 text-base leading-snug line-clamp-1">
                      {camp.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                      {camp.shortDescription || camp.description}
                    </p>

                    <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {camp.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {new Date(camp.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    {/* Funding Progress Bar */}
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="flex justify-between text-xs font-semibold mb-1.5">
                        <span className="text-emerald-700">₹{(camp.raisedAmount || 0).toLocaleString('en-IN')} raised</span>
                        <span className="text-gray-500">{percent}% of ₹{(camp.goalAmount || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    {/* Volunteers Progress */}
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-primary-600" />
                        Volunteers Joined:
                      </span>
                      <span className="font-semibold text-gray-900">
                        {camp.volunteersJoined || 0} / {camp.volunteersRequired || 0}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <button
                      onClick={() => handleOpenEditModal(camp)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit Campaign
                    </button>
                    <button
                      onClick={() => handleDelete(camp._id, camp.title)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Campaign"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Campaign Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-2xl max-h-[92vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="font-heading font-bold text-lg text-gray-900">
                {editingCampaign ? 'Edit Campaign' : 'Create New NGO Campaign'}
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
                <label className="block text-xs font-semibold text-gray-700 mb-1">Campaign Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clean Water & Sanitation Drive 2026"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="active">Active</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Location / City *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Varanasi, Uttar Pradesh"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Target Goal Amount (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.goalAmount}
                    onChange={(e) => setFormData({ ...formData, goalAmount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Current Raised Amount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.raisedAmount}
                    onChange={(e) => setFormData({ ...formData, raisedAmount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Volunteers Required</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.volunteersRequired}
                    onChange={(e) => setFormData({ ...formData, volunteersRequired: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Volunteers Joined</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.volunteersJoined}
                    onChange={(e) => setFormData({ ...formData, volunteersJoined: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">End Date (Optional)</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Short Summary (max 200 chars) *</label>
                <input
                  type="text"
                  required
                  maxLength={200}
                  placeholder="One sentence summary for campaign cards"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Detailed Description *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Explain the background, beneficiary group, timeline, and measurable impact goals..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                />
                <div className="mt-2 flex items-center gap-2 overflow-x-auto py-1">
                  <span className="text-[11px] text-gray-400 shrink-0">Preset images:</span>
                  {sampleImages.map((img, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setFormData({ ...formData, image: img })}
                      className="w-9 h-7 rounded overflow-hidden border border-gray-200 hover:ring-2 hover:ring-primary-500 shrink-0"
                    >
                      <img src={img} alt="preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
                  Feature this campaign on Homepage & Hero banners
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
                  {isSubmitting ? 'Saving...' : editingCampaign ? 'Update Campaign' : 'Create Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
