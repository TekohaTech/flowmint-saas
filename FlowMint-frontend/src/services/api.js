import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

console.log('[API] Base URL:', API_BASE_URL);

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log('[API Request]', config.method?.toUpperCase(), config.url, 'Token:', token ? 'YES' : 'NO');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        console.log('[API Response]', response.config.method?.toUpperCase(), response.config.url, response.status);
        return response;
    },
    (error) => {
        console.error('[API Error]', error.config?.method?.toUpperCase(), error.config?.url, error.response?.status, error.message);
        if (error.response?.status === 401) {
            console.log('[API] Token expired, clearing storage');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('isLoggedIn');
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        // Ensure both token and user object exist
        if (response.data.access_token && response.data.user) {
            localStorage.setItem('token', response.data.access_token);
            // Safely stringify user object
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('isLoggedIn', 'true');
        }
        return response.data;
    },

    logout: async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error("Logout failed at server, clearing local storage anyway", error);
        }
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
        window.location.href = '/login';
    },

    getProfile: async () => {
        const response = await api.get('/auth/profile');
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

    isAuthenticated: () => {
        // Now checking 'isLoggedIn' because token is in HttpOnly cookie
        return localStorage.getItem('isLoggedIn') === 'true';
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

// Roles API
export const rolesAPI = {
    getAll: async () => {
        const response = await api.get('/roles');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/roles/${id}`);
        return response.data;
    },

    create: async (roleData) => {
        const response = await api.post('/roles', roleData);
        return response.data;
    },

    update: async (id, roleData) => {
        const response = await api.patch(`/roles/${id}`, roleData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/roles/${id}`);
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

// Appointments API
export const appointmentsAPI = {
    getAll: async () => {
        const response = await api.get('/turnos');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/turnos/${id}`);
        return response.data;
    },

    create: async (appointmentData) => {
        const response = await api.post('/turnos', appointmentData);
        return response.data;
    },

    update: async (id, appointmentData) => {
        const response = await api.patch(`/turnos/${id}`, appointmentData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/turnos/${id}`);
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

// Export default api instance
export default api;