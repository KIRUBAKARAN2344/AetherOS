function Sidebar() {
  return (
    <aside className="w-64 bg-slate-800 text-white min-h-screen p-5">

      <h2 className="text-xl font-bold mb-6">
        Menu
      </h2>

      <ul className="space-y-4">

        <li>Dashboard</li>

        <li>Employees</li>

        <li>HR</li>

        <li>Finance</li>

        <li>Sales</li>

        <li>AI Agents</li>

        <li>Reports</li>

        <li>Settings</li>

      </ul>

    </aside>
  );
}

export default Sidebar;