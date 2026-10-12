import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Users, Search, Filter, CheckCircle2, Clock, XCircle, 
  Trash2, Mail, Phone, MapPin, Briefcase, Eye, MessageSquare, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { volunteerAPI } from '../../services/api';

export default function AdminVolunteers() {
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedVolunteer, setSelectedVolunteer] = useState<any | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchVolunteers();
  }, [statusFilter]);

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      const res = await volunteerAPI.getAll(params);
      if (res.data.success) {
        setVolunteers(res.data.volunteers || []);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch volunteers');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string, notes?: string) => {
    setIsUpdating(true);
    try {
      const res = await volunteerAPI.update(id, {
        status: newStatus,
        adminNotes: notes !== undefined ? notes : selectedVolunteer?.adminNotes,
      });
      if (res.data.success) {
        toast.success(`Volunteer status updated to ${newStatus}`);
        setVolunteers((prev) =>
          prev.map((v) => (v._id === id ? { ...v, status: newStatus, adminNotes: notes ?? v.adminNotes } : v))
        );
        if (selectedVolunteer?._id === id) {
          setSelectedVolunteer((prev: any) => ({
            ...prev,
            status: newStatus,
            adminNotes: notes ?? prev.adminNotes,
          }));
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this volunteer application? This action cannot be undone.')) {
      return;
    }
    try {
      const res = await volunteerAPI.delete(id);
      if (res.data.success) {
        toast.success('Volunteer application deleted');
        setVolunteers((prev) => prev.filter((v) => v._id !== id));
        if (selectedVolunteer?._id === id) {
          setSelectedVolunteer(null);
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete volunteer');
    }
  };

  const filteredVolunteers = volunteers.filter((v) => {
    const matchesSearch = 
      v.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.phone?.includes(searchTerm) ||
      v.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.occupation?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const stats = {
    total: volunteers.length,
    pending: volunteers.filter((v) => v.status === 'pending').length,
    approved: volunteers.filter((v) => v.status === 'approved').length,
    active: volunteers.filter((v) => v.status === 'active').length,
    rejected: volunteers.filter((v) => v.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Manage Volunteers — NGO Admin Panel</title>
      </Helmet>

      {/* Header & Stats Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-gray-900">Registered Volunteers</h2>
          <p className="text-sm text-gray-600">Review applications, approve team members, and coordinate volunteer outreach.</p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-xl text-left border transition-all ${
            statusFilter === 'all' ? 'bg-primary-50 border-primary-500 shadow-sm' : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <p className="text-xs font-semibold text-gray-500">All Applicants</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </button>
        <button
          onClick={() => setStatusFilter('pending')}
          className={`p-4 rounded-xl text-left border transition-all ${
            statusFilter === 'pending' ? 'bg-yellow-50 border-yellow-500 shadow-sm' : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <p className="text-xs font-semibold text-yellow-700 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Pending
          </p>
          <p className="text-2xl font-bold text-yellow-800 mt-1">{stats.pending}</p>
        </button>
        <button
          onClick={() => setStatusFilter('approved')}
          className={`p-4 rounded-xl text-left border transition-all ${
            statusFilter === 'approved' ? 'bg-emerald-50 border-emerald-500 shadow-sm' : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
          </p>
          <p className="text-2xl font-bold text-emerald-800 mt-1">{stats.approved}</p>
        </button>
        <button
          onClick={() => setStatusFilter('active')}
          className={`p-4 rounded-xl text-left border transition-all ${
            statusFilter === 'active' ? 'bg-blue-50 border-blue-500 shadow-sm' : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <p className="text-xs font-semibold text-blue-700 flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> Active Members
          </p>
          <p className="text-2xl font-bold text-blue-800 mt-1">{stats.active}</p>
        </button>
        <button
          onClick={() => setStatusFilter('rejected')}
          className={`p-4 rounded-xl text-left border transition-all ${
            statusFilter === 'rejected' ? 'bg-rose-50 border-rose-500 shadow-sm' : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <p className="text-xs font-semibold text-rose-700 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </p>
          <p className="text-2xl font-bold text-rose-800 mt-1">{stats.rejected}</p>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, city, occupation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-xs font-medium text-gray-500">Showing {filteredVolunteers.length} results</span>
        </div>
      </div>

      {/* Volunteers Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredVolunteers.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-700">No volunteers found</h3>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your search criteria or filter options.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Applicant</th>
                  <th className="py-3.5 px-4">Contact & Location</th>
                  <th className="py-3.5 px-4">Interests & Availability</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Applied Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredVolunteers.map((vol) => (
                  <tr key={vol._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-semibold text-gray-900">{vol.fullName}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <Briefcase className="w-3 h-3" />
                          {vol.occupation} {vol.age ? `• ${vol.age} yrs` : ''}
                        </p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5 text-xs text-gray-600">
                        <p className="flex items-center gap-1.5 font-mono text-[13px] text-gray-800">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          <a href={`mailto:${vol.email}`} className="hover:text-primary-600 hover:underline">{vol.email}</a>
                        </p>
                        <p className="flex items-center gap-1.5 font-mono text-[13px] text-gray-800">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <a href={`tel:${vol.phone}`} className="hover:text-primary-600">{vol.phone}</a>
                        </p>
                        <p className="flex items-center gap-1.5 text-gray-500">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          {vol.city}
                        </p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {vol.areasOfInterest?.map((area: string) => (
                            <span key={area} className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded-md text-[11px] font-medium">
                              {area}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 capitalize">
                          Availability: <span className="font-medium text-gray-700">{vol.availability}</span>
                        </p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                        vol.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                        vol.status === 'approved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        vol.status === 'active' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                        'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}>
                        {vol.status === 'pending' && <Clock className="w-3 h-3" />}
                        {vol.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                        {vol.status === 'active' && <Users className="w-3 h-3" />}
                        {vol.status === 'rejected' && <XCircle className="w-3 h-3" />}
                        {vol.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-500">
                      {new Date(vol.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedVolunteer(vol);
                            setAdminNotes(vol.adminNotes || '');
                          }}
                          className="p-1.5 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Full Application"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {vol.status !== 'approved' && (
                          <button
                            onClick={() => handleStatusChange(vol._id, 'approved')}
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-xs font-medium transition-colors"
                            title="Approve Volunteer"
                          >
                            Approve
                          </button>
                        )}
                        {vol.status === 'approved' && (
                          <button
                            onClick={() => handleStatusChange(vol._id, 'active')}
                            className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-xs font-medium transition-colors"
                            title="Make Active Member"
                          >
                            Activate
                          </button>
                        )}
                        {vol.status !== 'rejected' && (
                          <button
                            onClick={() => handleStatusChange(vol._id, 'rejected')}
                            className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-xs font-medium transition-colors"
                            title="Reject Volunteer"
                          >
                            Reject
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(vol._id)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Application"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Volunteer Application Detail Modal */}
      {selectedVolunteer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg">
                  {selectedVolunteer.fullName?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-gray-900">{selectedVolunteer.fullName}</h3>
                  <p className="text-xs text-gray-500">Applied on {new Date(selectedVolunteer.createdAt).toLocaleString('en-IN')}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedVolunteer(null)}
                className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status and Quick Action Strip */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                  <span className="text-xs text-gray-500 block">Current Status</span>
                  <span className={`inline-flex items-center gap-1 font-semibold text-sm capitalize ${
                    selectedVolunteer.status === 'pending' ? 'text-yellow-700' :
                    selectedVolunteer.status === 'approved' ? 'text-emerald-700' :
                    selectedVolunteer.status === 'active' ? 'text-blue-700' : 'text-rose-700'
                  }`}>
                    {selectedVolunteer.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusChange(selectedVolunteer._id, 'approved', adminNotes)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusChange(selectedVolunteer._id, 'active', adminNotes)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                  >
                    Set Active
                  </button>
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusChange(selectedVolunteer._id, 'rejected', adminNotes)}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>

              {/* Personal & Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-gray-50 rounded-xl">
                  <span className="text-xs text-gray-500 block">Email Address</span>
                  <a href={`mailto:${selectedVolunteer.email}`} className="text-sm font-medium text-primary-600 hover:underline">
                    {selectedVolunteer.email}
                  </a>
                </div>
                <div className="p-3.5 bg-gray-50 rounded-xl">
                  <span className="text-xs text-gray-500 block">Phone Number</span>
                  <a href={`tel:${selectedVolunteer.phone}`} className="text-sm font-medium text-primary-600 hover:underline">
                    {selectedVolunteer.phone}
                  </a>
                </div>
                <div className="p-3.5 bg-gray-50 rounded-xl">
                  <span className="text-xs text-gray-500 block">City / Location</span>
                  <span className="text-sm font-medium text-gray-900">{selectedVolunteer.city}</span>
                </div>
                <div className="p-3.5 bg-gray-50 rounded-xl">
                  <span className="text-xs text-gray-500 block">Occupation & Age</span>
                  <span className="text-sm font-medium text-gray-900">{selectedVolunteer.occupation} ({selectedVolunteer.age} years)</span>
                </div>
              </div>

              {/* Interests & Availability */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Areas of Interest</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedVolunteer.areasOfInterest?.map((area: string) => (
                    <span key={area} className="px-3 py-1 bg-primary-100 text-primary-800 rounded-lg text-xs font-medium">
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {selectedVolunteer.skills?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Specific Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedVolunteer.skills.map((s: string) => (
                      <span key={s} className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Motivation */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Why they want to volunteer</h4>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-700 leading-relaxed italic">
                  "{selectedVolunteer.motivation}"
                </div>
              </div>

              {/* Admin Internal Notes */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Admin Notes (Internal)</h4>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add internal notes about interview, background check, assigned team, etc..."
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  disabled={isUpdating}
                  onClick={() => handleStatusChange(selectedVolunteer._id, selectedVolunteer.status, adminNotes)}
                  className="mt-2 px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Save Internal Notes
                </button>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between rounded-b-2xl">
              <button
                onClick={() => handleDelete(selectedVolunteer._id)}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Application
              </button>
              <button
                onClick={() => setSelectedVolunteer(null)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
