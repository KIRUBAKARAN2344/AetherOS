import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch User Info
    api.get("/users/me")
      .then((res) => {
        setUser(res.data);
        // If ADMIN or HR, fetch stats
        if (res.data.role === "ADMIN" || res.data.role === "HR") {
          return api.get("/dashboard/stats");
        }
        return null;
      })
      .then((res) => {
        if (res) setStats(res.data);
      })
      .catch((err) => {
        setError("Failed to load dashboard data");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <DashboardLayout><p>Loading...</p></DashboardLayout>;
  if (error) return <DashboardLayout><p className="text-red-500">{error}</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {user?.full_name} 🚀
        </h1>
        <p className="text-gray-500 mt-2">Your role is: <span className="font-semibold text-blue-600">{user?.role}</span></p>
      </div>

      {/* Enterprise Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-l-4 border-l-blue-500">
            <h3 className="text-gray-500 text-sm font-semibold uppercase">Total Employees</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">{stats.employees}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-l-4 border-l-green-500">
            <h3 className="text-gray-500 text-sm font-semibold uppercase">Departments</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">{stats.departments}</p>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {stats?.recent_activities && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden mt-6">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Recent Activity</h2>
          </div>
          <ul className="divide-y divide-gray-200">
            {stats.recent_activities.length === 0 ? (
              <li className="px-6 py-4 text-gray-500">No recent activities.</li>
            ) : (
              stats.recent_activities.map((log) => (
                <li key={log.id} className="px-6 py-4 hover:bg-gray-50">
                  <p className="text-sm text-gray-800 font-medium">{log.action}</p>
                  <p className="text-xs text-gray-500 mt-1">{log.details}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(log.timestamp).toLocaleString()}</p>
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      {user?.role === "EMPLOYEE" && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">My Profile</h2>
          <p className="text-gray-600">View your attendance and request leave.</p>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Dashboard;