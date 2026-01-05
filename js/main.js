// Main JavaScript file for BNR Bank website

// Global variables
let currentUser = null;
let currentBank = null;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    // Load user and bank from localStorage
    currentUser = JSON.parse(localStorage.getItem('user'));
    currentBank = JSON.parse(localStorage.getItem('selectedBank'));
    
    // Update current time on all pages
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    
    // Initialize tooltips
    initTooltips();
    
    // Initialize popovers
    initPopovers();
    
    // Setup form validations
    setupFormValidations();
    
    // Setup file upload handlers
    setupFileUploads();
    
    // Setup navigation
    setupNavigation();
    
    // Setup modals
    setupModals();
    
    // Auto-dismiss alerts
    autoDismissAlerts();
});

// Update current time display
function updateCurrentTime() {
    const timeElements = document.querySelectorAll('#currentTime, .current-time');
    if (timeElements.length > 0) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('ro-RO', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        timeElements.forEach(element => {
            element.textContent = timeString;
        });
    }
}

// Initialize Bootstrap tooltips
function initTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Initialize Bootstrap popovers
function initPopovers() {
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
}

// Setup form validations
function setupFormValidations() {
    const forms = document.querySelectorAll('.needs-validation');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            form.classList.add('was-validated');
        }, false);
    });
}

// Setup file upload handlers
function setupFileUploads() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
        // Preview file name
        input.addEventListener('change', function() {
            const fileName = this.files[0]?.name || 'Niciun fișier selectat';
            const previewElement = this.nextElementSibling?.querySelector('.file-name');
            
            if (previewElement) {
                previewElement.textContent = fileName;
            }
        });
        
        // Drag and drop
        const dropZone = input.closest('.file-upload-area');
        if (dropZone) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, preventDefaults, false);
            });
            
            ['dragenter', 'dragover'].forEach(eventName => {
                dropZone.addEventListener(eventName, highlight, false);
            });
            
            ['dragleave', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, unhighlight, false);
            });
            
            dropZone.addEventListener('drop', handleDrop, false);
        }
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function highlight(e) {
        e.currentTarget.classList.add('dragover');
    }
    
    function unhighlight(e) {
        e.currentTarget.classList.remove('dragover');
    }
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        const input = e.currentTarget.querySelector('input[type="file"]');
        
        if (input && files.length > 0) {
            input.files = files;
            input.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }
}

// Setup navigation
function setupNavigation() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });
    }
}

// Setup modals
function setupModals() {
    // Auto-focus first input in modals
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('shown.bs.modal', function() {
            const input = this.querySelector('input, textarea, select');
            if (input) {
                input.focus();
            }
        });
    });
}

// Auto-dismiss alerts
function autoDismissAlerts() {
    const alerts = document.querySelectorAll('.alert:not(.alert-permanent)');
    alerts.forEach(alert => {
        setTimeout(() => {
            if (alert && alert.parentNode) {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }
        }, 5000);
    });
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('ro-RO', {
        style: 'currency',
        currency: 'RON',
        minimumFractionDigits: 2
    }).format(amount);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ro-RO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Format date time
function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ro-RO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show`;
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const container = document.querySelector('.notification-container') || document.body;
    container.insertBefore(notification, container.firstChild);
    
    setTimeout(() => {
        if (notification.parentNode) {
            const bsAlert = new bootstrap.Alert(notification);
            bsAlert.close();
        }
    }, 5000);
}

// Confirm dialog
function confirmDialog(message, callback) {
    if (confirm(message)) {
        if (typeof callback === 'function') {
            callback();
        }
        return true;
    }
    return false;
}

// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
        
        // Save state to localStorage
        const isCollapsed = sidebar.classList.contains('collapsed');
        localStorage.setItem('sidebarCollapsed', isCollapsed);
    }
}

// Load sidebar state
function loadSidebarState() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        if (isCollapsed) {
            sidebar.classList.add('collapsed');
        }
    }
}

// Initialize sidebar
document.addEventListener('DOMContentLoaded', loadSidebarState);

// Check authentication
function checkAuth(requiredRole = null) {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
        window.location.href = '../auth/login.html';
        return false;
    }
    
    if (requiredRole) {
        if (requiredRole === 'admin' && !(user.role === 'admin' || user.role === 'super_admin')) {
            window.location.href = '../auth/login.html';
            return false;
        }
        
        if (user.role !== requiredRole) {
            window.location.href = '../auth/login.html';
            return false;
        }
    }
    
    return true;
}

// Logout function
function logout() {
    if (confirmDialog('Sigur doriți să vă deconectați?')) {
        localStorage.removeItem('user');
        localStorage.removeItem('selectedBank');
        localStorage.removeItem('selectedBankId');
        window.location.href = '../auth/login.html';
    }
}

// Get current user
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
}

// Get current bank
function getCurrentBank() {
    return JSON.parse(localStorage.getItem('selectedBank'));
}

// API request helper
async function apiRequest(endpoint, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    };
    
    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(`/api/${endpoint}`, options);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        showNotification('Eroare la comunicarea cu serverul', 'danger');
        throw error;
    }
}

// Debounce function for search inputs
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export functions for use in other files
window.bnrBank = {
    formatCurrency,
    formatDate,
    formatDateTime,
    showNotification,
    confirmDialog,
    checkAuth,
    logout,
    getCurrentUser,
    getCurrentBank,
    apiRequest,
    debounce,
    throttle
};