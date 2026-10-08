import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { adminAPI } from '../../services/api';
import { Heart, Users, Megaphone, MessageSquare, TrendingUp, IndianRupee } from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await adminAPI.getDashboard();
        if (res.data.success) {
          setData(res.data.dashboard);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-full"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const statCards = [
    { title: 'Total Donations', value: `₹${(data?.totalAmountRaised || 0).toLocaleString()}`, icon: IndianRupee, color: 'bg-green-100 text-green-600' },
    { title: 'Total Donors', value: data?.totalDonations || 0, icon: Heart, color: 'bg-red-100 text-red-600' },
    { title: 'Total Volunteers', value: data?.totalVolunteers || 0, icon: Users, color: 'bg-blue-100 text-blue-600' },
    { title: 'Active Campaigns', value: data?.activeCampaigns || 0, icon: Megaphone, color: 'bg-orange-100 text-orange-600' },
    { title: 'Pending Volunteers', value: data?.pendingVolunteers || 0, icon: TrendingUp, color: 'bg-purple-100 text-purple-600' },
    { title: 'Unread Messages', value: data?.unreadMessages || 0, icon: MessageSquare, color: 'bg-yellow-100 text-yellow-600' },
  ];

  return (
    <div>
      <Helmet>
        <title>Dashboard — Admin Panel</title>
      </Helmet>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.color}`}>
                <Icon className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Donations */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-heading font-bold text-gray-800">Recent Donations</h3>
          </div>
          <div className="flex-1 p-0">
            {data?.recentDonations?.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {data.recentDonations.map((donation: any) => (
                  <li key={donation._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-900">{donation.donorName}</p>
                      <p className="text-xs text-gray-500 capitalize">{donation.purpose} • {new Date(donation.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="font-bold text-green-600">
                      +₹{donation.amount}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center text-gray-500 text-sm">No recent donations</div>
            )}
          </div>
        </div>

        {/* Recent Volunteers */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-heading font-bold text-gray-800">Recent Volunteers</h3>
          </div>
          <div className="flex-1 p-0">
            {data?.recentVolunteers?.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {data.recentVolunteers.map((volunteer: any) => (
                  <li key={volunteer._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-900">{volunteer.fullName}</p>
                      <p className="text-xs text-gray-500">{volunteer.city} • {volunteer.occupation}</p>
                    </div>
                    <div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                        volunteer.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        volunteer.status === 'approved' ? 'bg-green-100 text-green-800' :
                        volunteer.status === 'active' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {volunteer.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center text-gray-500 text-sm">No recent volunteer applications</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
