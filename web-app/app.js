/**
 * JEBOL Web App - Vanilla JS Frontend
 * Lightweight government administration system
 * API: http://localhost:8000/api (Laravel Sanctum)
 */

class JebolApp {
    constructor() {
        this.apiUrl = 'http://localhost:8000/api';
        this.token = localStorage.getItem('access_token');
        this.user = JSON.parse(localStorage.getItem('user') || '{}');
        this.init();
    }

    init() {
        if (this.token && this.user.id) {
            this.showPage('dashboard');
            this.updateNavUser();
            this.loadDashboard();
        } else {
            this.showPage('login');
        }
    }

    showPage(page) {
        document.querySelectorAll('[data-page]').forEach(el => el.classList.remove('active'));
        const element = document.querySelector(`[data-page="${page}"]`);
        if (element) element.classList.add('active');
    }

    updateNavUser() {
        const userDisplay = document.getElementById('user-display');
        if (this.user && this.user.name) {
            userDisplay.textContent = `${this.user.name} (${this.user.role})`;
        }
        document.getElementById('nav-menu').style.display = this.token ? 'flex' : 'none';
    }

    async handleLogin(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorEl = document.getElementById('login-error');

        try {
            const response = await fetch(`${this.apiUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    password,
                    device_name: 'web-app'
                })
            });

            const data = await response.json();

            if (!response.ok) {
                errorEl.textContent = data.message || 'Login failed';
                return;
            }

            // Store tokens
            this.token = data.access_token;
            this.user = data.user;
            localStorage.setItem('access_token', this.token);
            localStorage.setItem('refresh_token', data.refresh_token);
            localStorage.setItem('user', JSON.stringify(this.user));

            errorEl.textContent = '';
            this.updateNavUser();
            this.loadDashboard();
            this.showPage('dashboard');
        } catch (error) {
            errorEl.textContent = 'Connection error: ' + error.message;
        }
    }

    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        this.token = null;
        this.user = {};
        this.showPage('login');
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    }

    async apiCall(endpoint, method = 'GET', body = null) {
        if (!this.token) {
            this.showPage('login');
            throw new Error('No authentication token');
        }

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        };

        if (body) options.body = JSON.stringify(body);

        try {
            const response = await fetch(`${this.apiUrl}${endpoint}`, options);
            
            if (response.status === 401) {
                this.logout();
                throw new Error('Session expired');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Dashboard
    async loadDashboard() {
        try {
            const ktpData = await this.apiCall('/admin-ktp/submissions');
            const ikdData = await this.apiCall('/admin-ikd/statistics');
            const perkawinanData = await this.apiCall('/admin-perkawinan/records');
            
            console.log('Dashboard data loaded:', { ktpData, ikdData, perkawinanData });
        } catch (error) {
            console.error('Dashboard load error:', error);
        }
    }

    // KTP Management
    async handleKtpSubmit(event) {
        event.preventDefault();
        
        const ktpData = {
            nik: document.getElementById('ktp-nik').value,
            name: document.getElementById('ktp-name').value,
            address: document.getElementById('ktp-address').value,
            status: document.getElementById('ktp-status').value
        };

        try {
            const result = await this.apiCall('/admin-ktp/submit', 'POST', ktpData);
            alert('KTP submitted successfully');
            this.showPage('ktp');
            this.loadKtpList();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }

    async loadKtpList() {
        try {
            const data = await this.apiCall('/admin-ktp/submissions');
            const listEl = document.getElementById('ktp-list');
            
            if (data.data && Array.isArray(data.data)) {
                listEl.innerHTML = data.data.map(ktp => `
                    <div class="bg-white p-4 rounded-lg shadow">
                        <h3 class="font-bold">${ktp.name}</h3>
                        <p class="text-sm text-gray-600">NIK: ${ktp.nik}</p>
                        <p class="text-sm">Status: <span class="font-semibold text-blue-600">${ktp.status}</span></p>
                    </div>
                `).join('');
            } else {
                listEl.innerHTML = '<p class="text-gray-500">No KTP records found</p>';
            }
        } catch (error) {
            console.error('Error loading KTP list:', error);
        }
    }

    // IKD Statistics
    async loadIkdStats() {
        try {
            const data = await this.apiCall('/admin-ikd/statistics');
            const statsEl = document.getElementById('ikd-stats');
            
            if (data.data) {
                statsEl.innerHTML = `
                    <div class="bg-blue-100 p-4 rounded-lg">
                        <h3 class="font-bold text-blue-800">Total Records</h3>
                        <p class="text-3xl font-bold">${data.data.total || 0}</p>
                    </div>
                    <div class="bg-green-100 p-4 rounded-lg">
                        <h3 class="font-bold text-green-800">Active</h3>
                        <p class="text-3xl font-bold">${data.data.active || 0}</p>
                    </div>
                    <div class="bg-yellow-100 p-4 rounded-lg">
                        <h3 class="font-bold text-yellow-800">Pending</h3>
                        <p class="text-3xl font-bold">${data.data.pending || 0}</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error loading IKD stats:', error);
        }
    }

    // Marriage Records
    async handlePerkawinanSubmit(event) {
        event.preventDefault();
        
        const data = {
            groom_name: document.getElementById('perkawinan-groom').value,
            bride_name: document.getElementById('perkawinan-bride').value,
            marriage_date: document.getElementById('perkawinan-date').value,
            location: document.getElementById('perkawinan-location').value
        };

        try {
            const result = await this.apiCall('/admin-perkawinan/submit', 'POST', data);
            alert('Marriage record saved successfully');
            this.showPage('perkawinan');
            this.loadPerkawinanList();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }

    async loadPerkawinanList() {
        try {
            const data = await this.apiCall('/admin-perkawinan/records');
            const listEl = document.getElementById('perkawinan-list');
            
            if (data.data && Array.isArray(data.data)) {
                listEl.innerHTML = data.data.map(record => `
                    <div class="bg-white p-4 rounded-lg shadow">
                        <h3 class="font-bold">${record.groom_name} ♥ ${record.bride_name}</h3>
                        <p class="text-sm text-gray-600">Date: ${new Date(record.marriage_date).toLocaleDateString('id-ID')}</p>
                        <p class="text-sm">Location: ${record.location}</p>
                    </div>
                `).join('');
            } else {
                listEl.innerHTML = '<p class="text-gray-500">No marriage records found</p>';
            }
        } catch (error) {
            console.error('Error loading marriage records:', error);
        }
    }
}

// Initialize app when DOM is ready
const app = new JebolApp();

// Event listeners for navigation
document.addEventListener('click', (e) => {
    if (e.target.dataset.page) {
        app.showPage(e.target.dataset.page);
    }
});

// Load data when switching to pages
document.querySelectorAll('[data-page="ktp"]').forEach(el => {
    el.addEventListener('click', () => {
        setTimeout(() => app.loadKtpList(), 100);
    });
});

document.querySelectorAll('[data-page="ikd"]').forEach(el => {
    el.addEventListener('click', () => {
        setTimeout(() => app.loadIkdStats(), 100);
    });
});

document.querySelectorAll('[data-page="perkawinan"]').forEach(el => {
    el.addEventListener('click', () => {
        setTimeout(() => app.loadPerkawinanList(), 100);
    });
});
