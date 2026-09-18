import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export const financeApi = {
  getExpenses: () => api.get("/finance/expenses/"),
  createExpense: (data) => api.post("/finance/expenses/", data),
  updateExpenseStatus: (id, status) => api.patch(`/finance/expenses/${id}/status`, { status }),
  getInvoices: () => api.get("/finance/invoices/"),
  createInvoice: (data) => api.post("/finance/invoices/", data),
  updateInvoiceStatus: (id, status) => api.patch(`/finance/invoices/${id}/status`, { status }),
  getBudgets: () => api.get("/finance/budgets/"),
  createBudget: (data) => api.post("/finance/budgets/", data),
};

export default api;