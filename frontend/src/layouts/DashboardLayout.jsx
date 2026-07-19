import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function DashboardLayout({ children }) {
  return (
    <div>
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;