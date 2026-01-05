// Authentication functions

// Check if user is logged in
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = '../auth/login.html';
        return false;
    }
    return user;
}

// Logout function
function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('selectedBank');
    localStorage.removeItem('selectedBankId');
    window.location.href = '../auth/login.html';
}

// Get current user
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
}

// Check user role
function hasRole(role) {
    const user = getCurrentUser();
    if (!user) return false;
    
    if (role === 'admin') {
        return user.role === 'admin' || user.role === 'super_admin';
    }
    
    return user.role === role;
}

// Redirect based on role
function redirectByRole() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = '../auth/login.html';
        return;
    }
    
    switch(user.role) {
        case 'client':
            window.location.href = '../client/dashboard.html';
            break;
        case 'admin':
        case 'super_admin':
            window.location.href = '../admin/dashboard.html';
            break;
        case 'console':
            window.location.href = '../console/dashboard.html';
            break;
        default:
            window.location.href = '../auth/login.html';
    }
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on an auth page
    const isAuthPage = window.location.pathname.includes('/auth/');
    
    if (!isAuthPage) {
        const user = checkAuth();
        if (user) {
            // Set user info in navbar if element exists
            const userNameElement = document.getElementById('userName');
            if (userNameElement) {
                userNameElement.textContent = 
                    user.firstName && user.lastName 
                        ? `${user.firstName} ${user.lastName}`
                        : user.username;
            }
            
            // Set role badge if element exists
            const userRoleElement = document.getElementById('userRole');
            if (userRoleElement) {
                userRoleElement.textContent = user.role === 'super_admin' ? 'Super Admin' : 
                                            user.role === 'admin' ? 'Administrator' :
                                            user.role === 'console' ? 'Operator' : 'Client';
            }
        }
    }
});