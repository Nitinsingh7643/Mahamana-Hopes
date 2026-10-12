import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Heart, Search, Filter, IndianRupee, CheckCircle2, Clock, 
  XCircle, Mail, Phone, Calendar, Download, Eye, FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import { donationAPI } from '../../services/api';

export default function AdminDonations() {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [purposeFilter, setPurposeFilter] = useState('all');
  const [selectedDonation, setSelectedDonation] = useState<any | null>(null);

  useEffect(() => {
    fetchDonations();
  }, [statusFilter, purposeFilter]);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const params: any = { limit: 50 };
      if (statusFilter !== 'all') params.status = statusFilter;
      if (purposeFilter !== 'all') params.purpose = purposeFilter;
      const res = await donationAPI.getAll(params);
      if (res.data.success) {
        setDonations(res.data.donations || []);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch donations');
    } finally {
      setLoading(false);
    }
  };

  const filteredDonations = donations.filter((d) => {
    const matchesSearch =
      d.donorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.receiptNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.paymentId?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const successfulDonations = donations.filter((d) => d.status === 'successful');
  const totalRaised = successfulDonations.reduce((acc, d) => acc + (d.amount || 0), 0);
  const avgDonation = successfulDonations.length > 0 ? Math.round(totalRaised / successfulDonations.length) : 0;

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Manage Donations — NGO Admin Panel</title>
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-gray-900">Donations & Contributions</h2>
          <p className="text-sm text-gray-600">Track online donations, generate receipts, and review donor contributions.</p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Total Funds Collected</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">₹{totalRaised.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Successful Donations</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{successfulDonations.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Average Donation</p>
          <p className="text-2xl font-bold text-primary-600 mt-1">₹{avgDonation.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-semibold text-yellow-600">Pending Transactions</p>
          <p className="text-2xl font-bold text-yellow-700 mt-1">
            {donations.filter((d) => d.status === 'pending').length}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by donor name, email, receipt #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Statuses</option>
              <option value="successful">Successful</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500">Cause:</span>
            <select
              value={purposeFilter}
              onChange={(e) => setPurposeFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Causes</option>
              <option value="general">General Support</option>
              <option value="education">Education</option>
              <option value="healthcare">Healthcare</option>
              <option value="environment">Environment</option>
            </select>
          </div>
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredDonations.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-700">No donation records found</h3>
            <p className="text-sm text-gray-500 mt-1">Donation transactions made by users will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Donor Name</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Cause / Purpose</th>
                  <th className="py-3.5 px-4">Receipt / Order ID</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredDonations.map((don) => (
                  <tr key={don._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{don.donorName}</span>
                        {don.isAnonymous && (
                          <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium">
                            Anonymous
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-600">
                      <p className="font-mono text-gray-800">{don.email}</p>
                      {don.phone && <p className="text-gray-500">{don.phone}</p>}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      <span className="text-emerald-700 text-base">₹{don.amount?.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 bg-primary-50 text-primary-700 rounded-md text-xs font-medium capitalize">
                        {don.purpose || 'General'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-gray-600">
                      <p className="font-semibold text-gray-800">{don.receiptNumber || '—'}</p>
                      <p className="text-[11px] text-gray-400">{don.orderId || don.paymentId || ''}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                        don.status === 'successful' ? 'bg-emerald-100 text-emerald-800' :
                        don.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {don.status === 'successful' && <CheckCircle2 className="w-3 h-3" />}
                        {don.status === 'pending' && <Clock className="w-3 h-3" />}
                        {don.status === 'failed' && <XCircle className="w-3 h-3" />}
                        {don.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-500">
                      {new Date(don.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedDonation(don)}
                        className="p-1.5 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Donation Receipt Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Donation Detail Modal */}
      {selectedDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-primary-900 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-green-400 font-bold text-xl">
                  ₹
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg">Donation Details</h3>
                  <p className="text-xs text-white/70">Receipt #{selectedDonation.receiptNumber || 'MHF-TEMP'}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDonation(null)}
                className="w-8 h-8 rounded-lg bg-white/10 text-white hover:bg-white/20 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm">
              <div className="text-center py-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-xs text-emerald-700 font-semibold uppercase">Amount Received</span>
                <p className="text-3xl font-extrabold text-emerald-800 mt-1">₹{selectedDonation.amount?.toLocaleString('en-IN')}</p>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-200 text-emerald-900 capitalize">
                  {selectedDonation.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-400 block mb-1">Donor Name</span>
                  <span className="font-semibold text-gray-900">{selectedDonation.donorName}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-400 block mb-1">Cause / Purpose</span>
                  <span className="font-semibold text-gray-900 capitalize">{selectedDonation.purpose}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-400 block mb-1">Email Address</span>
                  <span className="font-semibold text-gray-900 font-mono">{selectedDonation.email}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-400 block mb-1">Phone Number</span>
                  <span className="font-semibold text-gray-900 font-mono">{selectedDonation.phone || 'N/A'}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-400 block mb-1">Payment ID</span>
                  <span className="font-semibold text-gray-900 font-mono text-[11px] truncate block">
                    {selectedDonation.paymentId || 'N/A'}
                  </span>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-400 block mb-1">Order ID</span>
                  <span className="font-semibold text-gray-900 font-mono text-[11px] truncate block">
                    {selectedDonation.orderId || 'N/A'}
                  </span>
                </div>
              </div>

              {selectedDonation.message && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-400 block mb-1">Donor Message</span>
                  <p className="text-xs text-gray-700 italic">"{selectedDonation.message}"</p>
                </div>
              )}

              <div className="p-3 bg-blue-50 text-blue-800 rounded-lg text-xs leading-relaxed">
                Eligible for tax exemption under Section 80G of the Income Tax Act.
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedDonation(null)}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-semibold hover:bg-black"
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
