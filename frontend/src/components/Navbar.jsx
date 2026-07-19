function Navbar() {
  return (
    <nav className="bg-blue-700 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">AetherOS</h1>

      <div className="flex gap-4">
        <button>Notifications</button>
        <button>Profile</button>
        <button>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;