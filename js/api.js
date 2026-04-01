const API_BASE_URL = 'http://localhost:5009/api/v1';

class ApiService {
    // ES9 features: async/await, optional chaining, template literals
    static async getHeaders() {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    }

    // Generic Fetch with Promise handling
    static async request(endpoint, method = 'GET', body = null) {
        try {
            const options = {
                method,
                headers: await this.getHeaders()
            };
            if (body) {
                options.body = JSON.stringify(body);
            }

            const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
            
            // Handle HTTP errors cleanly
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("Unauthorized. Please log in.");
                }
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP Error: ${response.status}`);
            }

            return await response.json();
            
        } catch (error) {
            console.error(`API Error on ${endpoint}:`, error);
            throw error;
        }
    }

    // Measurements Endpoints implementation
    static async convert(value, fromUnit, toUnit, type) {
        return this.request('/quantities/convert', 'POST', {
            thisQuantityDTO: { value: value, unitName: fromUnit, measurementType: type },
            targetUnit: toUnit
        });
    }

    static async compare(value1, unit1, value2, unit2, type) {
        return this.request('/quantities/compare', 'POST', {
            thisQuantityDTO: { value: value1, unitName: unit1, measurementType: type },
            thatQuantityDTO: { value: value2, unitName: unit2, measurementType: type }
        });
    }

    static async arithmetic(value1, unit1, value2, unit2, type, resultUnit, operator) {
        let endpoint;
        if (operator === '+') endpoint = '/quantities/add';
        else if (operator === '-') endpoint = '/quantities/subtract';
        else endpoint = '/quantities/divide';
        
        return this.request(endpoint, 'POST', {
            thisQuantityDTO: { value: value1, unitName: unit1, measurementType: type },
            thatQuantityDTO: { value: value2, unitName: unit2, measurementType: type },
            targetUnit: resultUnit
        });
    }

    static async login(username, password) {
        return this.request('/auth/login', 'POST', { username, password });
    }
}
