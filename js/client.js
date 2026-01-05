// Client-specific functionality

// Mock data for client cases
const mockClientCases = [
    {
        id: 1,
        number: 'CASE-2024-001',
        type: 'Credit Ipotecar',
        amount: 150000,
        status: 'pending',
        statusText: 'În Așteptare',
        date: '15.01.2024',
        assignedTo: 'Maria Ionescu',
        bank: 'BNR',
        description: 'Anulare credit ipotecar pentru apartament cu 3 camere',
        documents: ['contract.pdf', 'buletin.jpg', 'fluturas.pdf']
    },
    {
        id: 2,
        number: 'CASE-2024-002',
        type: 'Credit de Consum',
        amount: 25000,
        status: 'review',
        statusText: 'În Revizuire',
        date: '10.01.2024',
        assignedTo: 'Andrei Popescu',
        bank: 'BNR',
        description: 'Anulare credit de consum pentru achiziție mobilă',
        documents: ['contract.pdf', 'salariu.pdf']
    },
    {
        id: 3,
        number: 'CASE-2023-125',
        type: 'Credit Auto',
        amount: 45000,
        status: 'approved',
        statusText: 'Aprobat',
        date: '20.12.2023',
        assignedTo: 'Ana Marinescu',
        bank: 'BNR',
        description: 'Anulare credit auto pentru mașină nouă',
        documents: ['contract.pdf', 'carte_auto.pdf']
    }
];

// Mock worker data
const mockWorker = {
    name: 'Maria Ionescu',
    role: 'Specialist Anulări Credit',
    email: 'maria.ionescu@bnr-bank.ro',
    phone: '+40 721 123 456',
    cases: 12,
    rating: 4.8
};

// Load client dashboard data
function loadClientDashboard() {
    const user = JSON.parse(localStorage.getItem('user'));
    const bank = JSON.parse(localStorage.getItem('selectedBank'));
    
    // Update user info
    if (user) {
        document.getElementById('clientName').textContent = user.firstName || 'Client';
        document.getElementById('userName').textContent = 
            user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username;
    }
    
    // Update bank info
    if (bank) {
        document.getElementById('currentBank').textContent = bank.code;
        document.getElementById('footerBankInfo').textContent = bank.name;
    }
    
    // Calculate stats
    const stats = calculateCaseStats();
    updateDashboardStats(stats);
    
    // Load recent cases
    loadRecentCases();
    
    // Load worker info
    loadWorkerInfo();
}

// Calculate case statistics
function calculateCaseStats() {
    const total = mockClientCases.length;
    const pending = mockClientCases.filter(c => c.status === 'pending').length;
    const review = mockClientCases.filter(c => c.status === 'review').length;
    const approved = mockClientCases.filter(c => c.status === 'approved').length;
    
    return { total, pending, review, approved };
}

// Update dashboard statistics
function updateDashboardStats(stats) {
    document.getElementById('totalCases').textContent = stats.total;
    document.getElementById('pendingCases').textContent = stats.pending;
    document.getElementById('reviewCases').textContent = stats.review;
    document.getElementById('approvedCases').textContent = stats.approved;
}

// Load recent cases
function loadRecentCases() {
    const recentCasesDiv = document.getElementById('recentCases');
    if (!recentCasesDiv) return;
    
    const casesToShow = mockClientCases.slice(0, 3);
    
    if (casesToShow.length === 0) {
        recentCasesDiv.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-folder-open fa-3x text-muted mb-3"></i>
                <h5>Nu există cereri</h5>
                <p class="text-muted">Începeți prin a depune prima cerere de anulare</p>
                <a href="new-case.html" class="btn btn-primary">
                    <i class="fas fa-plus me-1"></i> Cerere Nouă
                </a>
            </div>
        `;
        return;
    }
    
    let casesHTML = '';
    casesToShow.forEach(caseItem => {
        const statusClass = getStatusClass(caseItem.status);
        const statusText = caseItem.statusText;
        
        casesHTML += `
            <a href="case-details.html?id=${caseItem.id}" class="case-item ${statusClass} d-block text-decoration-none text-dark">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 class="mb-1">${caseItem.number}</h6>
                        <small class="text-muted">
                            <i class="fas fa-money-bill-wave me-1"></i>
                            ${caseItem.amount.toLocaleString('ro-RO')} RON • 
                            <i class="fas fa-tag me-1"></i>
                            ${caseItem.type}
                        </small>
                    </div>
                    <div class="text-end">
                        <span class="badge ${statusClass}">
                            ${statusText}
                        </span>
                        <div>
                            <small class="text-muted">${caseItem.date}</small>
                        </div>
                    </div>
                </div>
                ${caseItem.assignedTo ? `
                    <small class="text-primary">
                        <i class="fas fa-user-tie me-1"></i>
                        Asignat: ${caseItem.assignedTo}
                    </small>
                ` : ''}
            </a>
        `;
    });
    
    recentCasesDiv.innerHTML = casesHTML;
}

// Get status CSS class
function getStatusClass(status) {
    switch(status) {
        case 'pending': return 'status-pending';
        case 'review': return 'status-review';
        case 'approved': return 'status-approved';
        case 'rejected': return 'status-rejected';
        default: return 'status-pending';
    }
}

// Load worker information
function loadWorkerInfo() {
    const hasAssignedCases = mockClientCases.some(c => c.assignedTo);
    
    if (hasAssignedCases) {
        document.getElementById('workerName').textContent = mockWorker.name;
        document.getElementById('workerRole').textContent = mockWorker.role;
        document.getElementById('workerEmail').textContent = mockWorker.email;
        document.getElementById('workerPhone').textContent = mockWorker.phone;
        document.getElementById('workerContact').style.display = 'block';
        document.getElementById('messageWorker').disabled = false;
    }
}

// Handle new case submission
function handleNewCaseSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Validate required files
    const contractFile = formData.get('contract_file');
    const identityFile = formData.get('identity_file');
    
    if (!contractFile || contractFile.size === 0) {
        alert('Vă rugăm să încărcați contractul de credit');
        return;
    }
    
    if (!identityFile || identityFile.size === 0) {
        alert('Vă rugăm să încărcați documentul de identitate');
        return;
    }
    
    // Create new case object
    const newCase = {
        id: mockClientCases.length + 1,
        number: `CASE-${new Date().getFullYear()}-${(mockClientCases.length + 1).toString().padStart(3, '0')}`,
        type: formData.get('loan_type'),
        amount: parseFloat(formData.get('loan_amount')),
        status: 'pending',
        statusText: 'În Așteptare',
        date: new Date().toLocaleDateString('ro-RO'),
        assignedTo: null,
        bank: JSON.parse(localStorage.getItem('selectedBank')).code,
        description: formData.get('description'),
        documents: ['contract.pdf', 'buletin.jpg']
    };
    
    // In a real app, this would be an API call
    mockClientCases.unshift(newCase);
    
    // Show success message
    alert('Cererea a fost depusă cu succes! Număr caz: ' + newCase.number);
    
    // Redirect to cases page
    window.location.href = 'cases.html';
}

// Load all cases for cases page
function loadAllCases() {
    const casesTable = document.getElementById('casesTable');
    if (!casesTable) return;
    
    let casesHTML = '';
    
    mockClientCases.forEach(caseItem => {
        const statusClass = getStatusClass(caseItem.status);
        const statusText = caseItem.statusText;
        
        casesHTML += `
            <tr>
                <td>
                    <strong>${caseItem.number}</strong><br>
                    <small class="text-muted">${caseItem.bank}</small>
                </td>
                <td>${caseItem.type}</td>
                <td>${caseItem.amount.toLocaleString('ro-RO')} RON</td>
                <td>
                    <span class="case-card-status ${statusClass}">
                        ${statusText}
                    </span>
                </td>
                <td>${caseItem.date}</td>
                <td>
                    ${caseItem.assignedTo ? `
                        <small>
                            <i class="fas fa-user-tie me-1"></i>
                            ${caseItem.assignedTo}
                        </small>
                    ` : 'Nu este asignat'}
                </td>
                <td class="action-buttons">
                    <a href="case-details.html?id=${caseItem.id}" class="btn btn-sm btn-outline-primary">
                        <i class="fas fa-eye"></i>
                    </a>
                    <button class="btn btn-sm btn-outline-secondary" onclick="downloadCase(${caseItem.id})">
                        <i class="fas fa-download"></i>
                    </button>
                    ${caseItem.status === 'pending' ? `
                        <button class="btn btn-sm btn-outline-danger" onclick="cancelCase(${caseItem.id})">
                            <i class="fas fa-times"></i>
                        </button>
                    ` : ''}
                </td>
            </tr>
        `;
    });
    
    casesTable.innerHTML = casesHTML;
    document.getElementById('casesCount').textContent = mockClientCases.length;
}

// Download case documents
function downloadCase(caseId) {
    const caseItem = mockClientCases.find(c => c.id === caseId);
    if (caseItem) {
        alert(`Se descarcă documentele pentru cazul ${caseItem.number}`);
        // In real app, this would trigger file download
    }
}

// Cancel case
function cancelCase(caseId) {
    if (confirm('Sigur doriți să anulați această cerere?')) {
        const caseItem = mockClientCases.find(c => c.id === caseId);
        if (caseItem) {
            caseItem.status = 'cancelled';
            caseItem.statusText = 'Anulat';
            alert(`Cererea ${caseItem.number} a fost anulată`);
            loadAllCases();
        }
    }
}

// Initialize client pages
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'client') {
        window.location.href = '../auth/login.html';
        return;
    }
    
    // Page-specific initialization
    const path = window.location.pathname;
    
    if (path.includes('dashboard.html')) {
        loadClientDashboard();
    } else if (path.includes('cases.html')) {
        loadAllCases();
    } else if (path.includes('new-case.html')) {
        const form = document.getElementById('newCaseForm');
        if (form) {
            form.addEventListener('submit', handleNewCaseSubmit);
        }
        
        // File upload preview
        setupFileUploadPreview();
    }
});

// Setup file upload preview
function setupFileUploadPreview() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const previewId = this.id + 'Preview';
                let previewElement = document.getElementById(previewId);
                
                if (!previewElement) {
                    previewElement = document.createElement('div');
                    previewElement.id = previewId;
                    previewElement.className = 'file-preview mt-2';
                    this.parentNode.appendChild(previewElement);
                }
                
                const fileSize = formatFileSize(file.size);
                previewElement.innerHTML = `
                    <div class="alert alert-info py-2">
                        <i class="fas fa-file me-2"></i>
                        ${file.name} (${fileSize})
                    </div>
                `;
            }
        });
    });
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}