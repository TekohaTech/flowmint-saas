import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        // Token is in httpOnly cookie (set by backend) — store user data for display
        if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            // Server logout failed — cookie may already be cleared
        }
        localStorage.removeItem('user');
        window.location.href = '/login';
    },

    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    getProfile: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch (error) {
            console.error("Failed to parse user data from localStorage", error);
            return null;
        }
    },

    forgotPassword: async (correo) => {
        const response = await api.post('/auth/forgot-password', { correo });
        return response.data;
    },

    resetPassword: async (token, pass) => {
        const response = await api.post('/auth/reset-password', { token, pass });
        return response.data;
    },

    isAuthenticated: () => {
        // Quick local check: user data exists = likely logged in
        // For real validation, use getProfile() which checks the httpOnly cookie
        return localStorage.getItem('user') !== null;
    },
};

// Users API
export const usersAPI = {
    getAll: async () => {
        const response = await api.get('/usuarios');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/usuarios/${id}`);
        return response.data;
    },

    create: async (userData) => {
        const response = await api.post('/usuarios', userData);
        return response.data;
    },

    update: async (id, userData) => {
        const response = await api.patch(`/usuarios/${id}`, userData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/usuarios/${id}`);
        return response.data;
    },
};

// Clients API
export const clientsAPI = {
    getAll: async () => {
        const response = await api.get('/clientes');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/clientes/${id}`);
        return response.data;
    },

    create: async (clientData) => {
        const response = await api.post('/clientes', clientData);
        return response.data;
    },

    update: async (id, clientData) => {
        const response = await api.patch(`/clientes/${id}`, clientData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/clientes/${id}`);
        return response.data;
    },
};

// Employees API
export const employeesAPI = {
    getAll: async () => {
        const response = await api.get('/empleados');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/empleados/${id}`);
        return response.data;
    },

    create: async (employeeData) => {
        const response = await api.post('/empleados', employeeData);
        return response.data;
    },

    update: async (id, employeeData) => {
        const response = await api.patch(`/empleados/${id}`, employeeData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/empleados/${id}`);
        return response.data;
    },
};

// Services API
export const servicesAPI = {
    getAll: async () => {
        const response = await api.get('/servicios');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/servicios/${id}`);
        return response.data;
    },

    create: async (serviceData) => {
        const response = await api.post('/servicios', serviceData);
        return response.data;
    },

    update: async (id, serviceData) => {
        const response = await api.patch(`/servicios/${id}`, serviceData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/servicios/${id}`);
        return response.data;
    },
};

// Comercios API (SuperAdmin Only)
export const comerciosAPI = {
    getAll: async () => {
        const response = await api.get('/comercios');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/comercios/${id}`);
        return response.data;
    },

    create: async (comercioData) => {
        const response = await api.post('/comercios', comercioData);
        return response.data;
    },

    update: async (id, comercioData) => {
        const response = await api.patch(`/comercios/${id}`, comercioData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/comercios/${id}`);
        return response.data;
    },
    
    activar: async (id) => {
        const response = await api.patch(`/comercios/${id}`, { activo: true });
        return response.data;
    },
    
    desactivar: async (id) => {
        const response = await api.patch(`/comercios/${id}`, { activo: false });
        return response.data;
    }
};

// Revenue API
export const revenueAPI = {
    getDaily: async (startDate, endDate) => {
        let url = '/ganancias/diarias';
        const params = [];
        if (startDate) params.push(`startDate=${startDate}`);
        if (endDate) params.push(`endDate=${endDate}`);
        if (params.length > 0) url += '?' + params.join('&');
        const response = await api.get(url);
        return response.data;
    },

    getWeekly: async (startDate, endDate) => {
        let url = '/ganancias/semanales';
        const params = [];
        if (startDate) params.push(`startDate=${startDate}`);
        if (endDate) params.push(`endDate=${endDate}`);
        if (params.length > 0) url += '?' + params.join('&');
        const response = await api.get(url);
        return response.data;
    },

    getMonthly: async (startDate, endDate) => {
        let url = '/ganancias/mensuales';
        const params = [];
        if (startDate) params.push(`startDate=${startDate}`);
        if (endDate) params.push(`endDate=${endDate}`);
        if (params.length > 0) url += '?' + params.join('&');
        const response = await api.get(url);
        return response.data;
    },

    getYearly: async (startDate, endDate) => {
        let url = '/ganancias/anuales';
        const params = [];
        if (startDate) params.push(`startDate=${startDate}`);
        if (endDate) params.push(`endDate=${endDate}`);
        if (params.length > 0) url += '?' + params.join('&');
        const response = await api.get(url);
        return response.data;
    },

    getMonthlyByService: async (startDate, endDate) => {
        let url = '/ganancias/mensuales-por-servicio';
        const params = [];
        if (startDate) params.push(`startDate=${startDate}`);
        if (endDate) params.push(`endDate=${endDate}`);
        if (params.length > 0) url += '?' + params.join('&');
        const response = await api.get(url);
        return response.data;
    },

    getYearlyByService: async (startDate, endDate) => {
        let url = '/ganancias/anuales-por-servicio';
        const params = [];
        if (startDate) params.push(`startDate=${startDate}`);
        if (endDate) params.push(`endDate=${endDate}`);
        if (params.length > 0) url += '?' + params.join('&');
        const response = await api.get(url);
        return response.data;
    },

    getMonthlyByEmployee: async (startDate, endDate) => {
        let url = '/ganancias/mensuales-por-empleado';
        const params = [];
        if (startDate) params.push(`startDate=${startDate}`);
        if (endDate) params.push(`endDate=${endDate}`);
        if (params.length > 0) url += '?' + params.join('&');
        const response = await api.get(url);
        return response.data;
    },

    getYearlyByEmployee: async (startDate, endDate) => {
        let url = '/ganancias/anuales-por-empleado';
        const params = [];
        if (startDate) params.push(`startDate=${startDate}`);
        if (endDate) params.push(`endDate=${endDate}`);
        if (params.length > 0) url += '?' + params.join('&');
        const response = await api.get(url);
        return response.data;
    },

    getSummary: async (startDate, endDate) => {
        let url = '/ganancias/resumen';
        const params = [];
        if (startDate) params.push(`startDate=${startDate}`);
        if (endDate) params.push(`endDate=${endDate}`);
        if (params.length > 0) url += '?' + params.join('&');
        const response = await api.get(url);
        return response.data;
    },
};

// AI API
export const aiAPI = {
    chat: async (message) => {
        const response = await api.post('/ai/chat', { message });
        return response.data;
    },
};

// Notifications API
export const notificationsAPI = {
    create: async (data) => {
        const response = await api.post('/notificaciones', data);
        return response.data;
    },
    getMine: async (unreadOnly = false) => {
        const response = await api.get(`/notificaciones/mine?unread_only=${unreadOnly}`);
        return response.data;
    },
    getUnreadCount: async () => {
        const response = await api.get('/notificaciones/unread-count');
        return response.data;
    },
    markRead: async (id) => {
        const response = await api.patch(`/notificaciones/${id}/read`);
        return response.data;
    },
};

// Export default api instance
export default api;