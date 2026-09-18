import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { financeApi } from "../services/api";

function Finance() {
  const [activeTab, setActiveTab] = useState("expenses");
  
  const [expenses, setExpenses] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [budgets, setBudgets] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form states
  const [expenseForm, setExpenseForm] = useState({ amount: "", category: "", description: "" });
  const [invoiceForm, setInvoiceForm] = useState({ title: "", amount: "", due_date: "" });
  const [budgetForm, setBudgetForm] = useState({ period: "", department_id: "", allocated_amount: "" });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setError("");
    try {
      // Catch errors individually so 403s on restricted endpoints don't break the whole page
      const [expRes, invRes, budRes] = await Promise.allSettled([
        financeApi.getExpenses(),
        financeApi.getInvoices(),
        financeApi.getBudgets()
      ]);
      
      if (expRes.status === "fulfilled") setExpenses(expRes.value.data);
      if (invRes.status === "fulfilled") setInvoices(invRes.value.data);
      if (budRes.status === "fulfilled") setBudgets(budRes.value.data);
      
    } catch (err) {
      setError("Failed to fetch some finance data.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    try {
      await financeApi.createExpense({
        amount: parseFloat(expenseForm.amount),
        category: expenseForm.category,
        description: expenseForm.description || null
      });
      setExpenseForm({ amount: "", category: "", description: "" });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create expense");
    }
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    try {
      await financeApi.createInvoice({
        title: invoiceForm.title,
        amount: parseFloat(invoiceForm.amount),
        due_date: invoiceForm.due_date
      });
      setInvoiceForm({ title: "", amount: "", due_date: "" });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create invoice (Admin/HR only)");
    }
  };

  const handleCreateBudget = async (e) => {
    e.preventDefault();
    try {
      await financeApi.createBudget({
        period: budgetForm.period,
        department_id: parseInt(budgetForm.department_id),
        allocated_amount: parseFloat(budgetForm.allocated_amount)
      });
      setBudgetForm({ period: "", department_id: "", allocated_amount: "" });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create budget (Admin only)");
    }
  };

  const handleUpdateExpenseStatus = async (id, status) => {
    try {
      await financeApi.updateExpenseStatus(id, status);
      fetchData();
    } catch (err) {
      alert("Failed to update status. " + (err.response?.data?.detail || ""));
    }
  };

  const handleUpdateInvoiceStatus = async (id, status) => {
    try {
      await financeApi.updateInvoiceStatus(id, status);
      fetchData();
    } catch (err) {
      alert("Failed to update status. " + (err.response?.data?.detail || ""));
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Finance Module</h1>
        <p className="text-gray-500 mt-2">Manage expenses, invoices, and budgets</p>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-gray-500 text-sm font-semibold">Total Expenses</h3>
          <p className="text-2xl font-bold text-gray-800">${expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-gray-500 text-sm font-semibold">Total Invoices</h3>
          <p className="text-2xl font-bold text-gray-800">${invoices.reduce((sum, i) => sum + i.amount, 0).toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-gray-500 text-sm font-semibold">Total Allocated Budgets</h3>
          <p className="text-2xl font-bold text-gray-800">${budgets.reduce((sum, b) => sum + b.allocated_amount, 0).toFixed(2)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {["expenses", "invoices", "budgets"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {loading ? (
        <div className="text-gray-500">Loading finance data...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800 capitalize">{activeTab} List</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {activeTab === "expenses" && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID / Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category / Desc</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </>
                    )}
                    {activeTab === "invoices" && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </>
                    )}
                    {activeTab === "budgets" && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dept ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* EXPENSES */}
                  {activeTab === "expenses" && expenses.map(e => (
                    <tr key={e.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{e.id}<br/><span className="text-gray-500 text-xs">{e.date || 'N/A'}</span></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{e.category}<br/><span className="text-gray-500 text-xs">{e.description}</span></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${e.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${e.status === 'APPROVED' ? 'bg-green-100 text-green-800' : e.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {e.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleUpdateExpenseStatus(e.id, 'APPROVED')} className="text-green-600 hover:text-green-900 mr-2">Approve</button>
                        <button onClick={() => handleUpdateExpenseStatus(e.id, 'REJECTED')} className="text-red-600 hover:text-red-900">Reject</button>
                      </td>
                    </tr>
                  ))}
                  {activeTab === "expenses" && expenses.length === 0 && (
                    <tr><td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No expenses found</td></tr>
                  )}

                  {/* INVOICES */}
                  {activeTab === "invoices" && invoices.map(i => (
                    <tr key={i.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{i.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${i.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{i.due_date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${i.status === 'PAID' ? 'bg-green-100 text-green-800' : i.status === 'OVERDUE' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {i.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleUpdateInvoiceStatus(i.id, 'PAID')} className="text-green-600 hover:text-green-900">Mark Paid</button>
                      </td>
                    </tr>
                  ))}
                  {activeTab === "invoices" && invoices.length === 0 && (
                    <tr><td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No invoices found</td></tr>
                  )}

                  {/* BUDGETS */}
                  {activeTab === "budgets" && budgets.map(b => (
                    <tr key={b.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{b.period}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{b.department_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${b.allocated_amount}</td>
                    </tr>
                  ))}
                  {activeTab === "budgets" && budgets.length === 0 && (
                    <tr><td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">No budgets found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 h-fit">
            <h2 className="text-lg font-bold text-gray-800 mb-4 capitalize">Add {activeTab.slice(0, -1)}</h2>
            
            {activeTab === "expenses" && (
              <form onSubmit={handleCreateExpense}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                  <input type="number" step="0.01" value={expenseForm.amount} onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})} className="w-full border rounded-lg p-2" required />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input type="text" value={expenseForm.category} onChange={(e) => setExpenseForm({...expenseForm, category: e.target.value})} className="w-full border rounded-lg p-2" required />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea value={expenseForm.description} onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})} className="w-full border rounded-lg p-2" rows="2" />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition">Submit Expense</button>
              </form>
            )}

            {activeTab === "invoices" && (
              <form onSubmit={handleCreateInvoice}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input type="text" value={invoiceForm.title} onChange={(e) => setInvoiceForm({...invoiceForm, title: e.target.value})} className="w-full border rounded-lg p-2" required />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                  <input type="number" step="0.01" value={invoiceForm.amount} onChange={(e) => setInvoiceForm({...invoiceForm, amount: e.target.value})} className="w-full border rounded-lg p-2" required />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input type="date" value={invoiceForm.due_date} onChange={(e) => setInvoiceForm({...invoiceForm, due_date: e.target.value})} className="w-full border rounded-lg p-2" required />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition">Create Invoice</button>
              </form>
            )}

            {activeTab === "budgets" && (
              <form onSubmit={handleCreateBudget}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Period (e.g., Q1 2026)</label>
                  <input type="text" value={budgetForm.period} onChange={(e) => setBudgetForm({...budgetForm, period: e.target.value})} className="w-full border rounded-lg p-2" required />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department ID</label>
                  <input type="number" value={budgetForm.department_id} onChange={(e) => setBudgetForm({...budgetForm, department_id: e.target.value})} className="w-full border rounded-lg p-2" required />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Allocated Amount ($)</label>
                  <input type="number" step="0.01" value={budgetForm.allocated_amount} onChange={(e) => setBudgetForm({...budgetForm, allocated_amount: e.target.value})} className="w-full border rounded-lg p-2" required />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition">Allocate Budget</button>
              </form>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Finance;
