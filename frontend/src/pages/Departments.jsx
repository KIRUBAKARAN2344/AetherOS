import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartments();
  }, []);

  function fetchDepartments() {
    api.get("/departments/")
      .then((res) => {
        setDepartments(res.data);
      })
      .catch((err) => {
        setError("Failed to load departments.");
      })
      .finally(() => setLoading(false));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    setError("");
    api.post("/departments/", { name, description })
      .then(() => {
        setName("");
        setDescription("");
        fetchDepartments();
      })
      .catch((err) => {
        setError(err.response?.data?.detail || "Failed to create department");
      });
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Departments</h1>
        <p className="text-gray-500 mt-2">Manage enterprise departments</p>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Department List</h2>
          </div>
          {loading ? (
            <div className="p-6">Loading...</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {departments.length === 0 ? (
                <li className="px-6 py-4 text-gray-500">No departments found.</li>
              ) : (
                departments.map((dept) => (
                  <li key={dept.id} className="px-6 py-4 hover:bg-gray-50">
                    <p className="text-md font-bold text-gray-800">{dept.name}</p>
                    <p className="text-sm text-gray-500 mt-1">{dept.description}</p>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 h-fit">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Add Department</h2>
          <form onSubmit={handleCreate}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-lg p-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded-lg p-2"
                rows="3"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition"
            >
              Create
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Departments;
