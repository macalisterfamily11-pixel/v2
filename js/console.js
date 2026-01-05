// Console-specific functionality

// Mock data for console
const consoleData = {
    currentWorker: {
        id: 1,
        name: 'Мария Ионеску',
        role: 'Специалист по аннуляции',
        email: 'maria@bnr.ro',
        phone: '+40722123456',
        casesAssigned: 12,
        performance: 94
    },
    workload: {
        assigned: 12,
        inProgress: 4,
        completedToday: 3,
        overdue: 1
    },
    recentActions: [
        {id:1,action:'Начал проверку',case:'CASE-2024-014',time:'10:30'},
        {id:2,action:'Запросил документы',case:'CASE-2024-013',time:'11:15'},
        {id:3,action:'Добавил заметку',case:'CASE-2024-011',time:'12:45'},
        {id:4,action:'Отправил отчет',case:'CASE-2024-010',time:'14:20'}
    ]
};

// Initialize console dashboard
function initConsoleDashboard() {
    updateWorkerInfo();
    updateWorkloadStats();
    loadRecentActions();
    initCaseProgress();
}

// Update worker information
function updateWorkerInfo() {
    const worker = consoleData.currentWorker;
    
    document.getElementById('workerName').textContent = worker.name;
    document.getElementById('workerRole').textContent = worker.role;
    document.getElementById('workerEmail').textContent = worker.email;
    document.getElementById('workerPhone').textContent = worker.phone;
    document.getElementById('assignedCases').textContent = worker.casesAssigned;
    document.getElementById('performanceScore').textContent = `${worker.performance}%`;
}

// Update workload statistics
function updateWorkloadStats() {
    const workload = consoleData.workload;
    
    document.getElementById('workloadAssigned').textContent = workload.assigned;
    document.getElementById('workloadInProgress').textContent = workload.inProgress;
    document.getElementById('workloadCompleted').textContent = workload.completedToday;
    document.getElementById('workloadOverdue').textContent = workload.overdue;
    
    // Update progress bars
    const assignedProgress = (workload.assigned / 20) * 100; // Assuming max 20 cases
    const progressProgress = (workload.inProgress / workload.assigned) * 100;
    
    document.getElementById('assignedProgress').style.width = `${assignedProgress}%`;
    document.getElementById('inProgressBar').style.width = `${progressProgress}%`;
}

// Load recent actions
function loadRecentActions() {
    const actionsList = document.getElementById('recentActions');
    if (!actionsList) return;
    
    let actionsHTML = '';
    consoleData.recentActions.forEach(action => {
        actionsHTML += `
            <div class="action-item">
                <div class="action-icon">
                    <i class="fas fa-${getActionIcon(action.action)}"></i>
                </div>
                <div class="action-content">
                    <div class="action-text">
                        ${action.action} 
                        <span class="action-case">${action.case}</span>
                    </div>
                    <div class="action-time">${action.time}</div>
                </div>
            </div>
        `;
    });
    
    actionsList.innerHTML = actionsHTML;
}

// Get action icon
function getActionIcon(action) {
    const iconMap = {
        'Начал проверку': 'search',
        'Запросил документы': 'file-import',
        'Добавил заметку': 'sticky-note',
        'Отправил отчет': 'paper-plane',
        'default': 'check-circle'
    };
    
    for (const [key, icon] of Object.entries(iconMap)) {
        if (action.includes(key)) return icon;
    }
    return iconMap.default;
}

// Initialize case progress tracker
function initCaseProgress() {
    const steps = document.querySelectorAll('.progress-step');
    const currentStep = 2; // Assuming we're on step 2
    
    steps.forEach((step, index) => {
        if (index < currentStep) {
            step.classList.add('completed');
        } else if (index === currentStep) {
            step.classList.add('current');
        }
    });
}

// Take a new case
function takeNewCase() {
    showLoading('Поиск нового дела...');
    
    setTimeout(() => {
        hideLoading();
        
        // Simulate available cases
        const availableCases = [
            {id: 1, number: 'CASE-2024-016', client: 'Александру Василеску', type: 'Ипотечный', priority: 'medium'},
            {id: 2, number: 'CASE-2024-017', client: 'Кристина Попеску', type: 'Автокредит', priority: 'low'},
            {id: 3, number: 'CASE-2024-018', client: 'Раду Йонеску', type: 'Потребительский', priority: 'urgent'}
        ];
        
        showCaseSelection(availableCases);
    }, 1500);
}

// Show case selection modal
function showCaseSelection(cases) {
    const modalHTML = `
        <div class="modal fade" id="caseSelectionModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Выберите дело для работы</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Выбрать</th>
                                        <th>Номер дела</th>
                                        <th>Клиент</th>
                                        <th>Тип кредита</th>
                                        <th>Приоритет</th>
                                        <th>Дата создания</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${cases.map(caseItem => `
                                        <tr>
                                            <td><input type="radio" name="selectedCase" value="${caseItem.id}"></td>
                                            <td><strong>${caseItem.number}</strong></td>
                                            <td>${caseItem.client}</td>
                                            <td>${caseItem.type}</td>
                                            <td><span class="badge bg-${getPriorityColor(caseItem.priority)}">${caseItem.priority}</span></td>
                                            <td>${new Date().toLocaleDateString('ru-RU')}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                        <button type="button" class="btn btn-primary" onclick="confirmCaseSelection()">Взять выбранное</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('caseSelectionModal'));
    modal.show();
    
    // Remove modal after hide
    modal._element.addEventListener('hidden.bs.modal', function() {
        document.getElementById('caseSelectionModal').remove();
    });
}

// Get priority color
function getPriorityColor(priority) {
    const colorMap = {
        'urgent': 'danger',
        'high': 'warning',
        'medium': 'info',
        'low': 'success'
    };
    return colorMap[priority] || 'secondary';
}

// Confirm case selection
function confirmCaseSelection() {
    const selected = document.querySelector('input[name="selectedCase"]:checked');
    
    if (!selected) {
        alert('Выберите дело для работы');
        return;
    }
    
    showLoading('Назначение дела...');
    
    setTimeout(() => {
        hideLoading();
        bootstrap.Modal.getInstance(document.getElementById('caseSelectionModal')).hide();
        
        // Update workload
        consoleData.workload.assigned++;
        consoleData.workload.inProgress++;
        updateWorkloadStats();
        
        alert('Дело успешно назначено вам!');
    }, 1000);
}

// Process case
function processCase(caseId) {
    showLoading('Загрузка дела...');
    
    setTimeout(() => {
        hideLoading();
        // In real app, redirect to case processing page
        alert(`Открытие дела ${caseId} для обработки`);
    }, 1000);
}

// Add case note
function addCaseNote(caseId) {
    const note = prompt('Введите заметку к делу:');
    if (note && note.trim()) {
        showLoading('Сохранение заметки...');
        
        setTimeout(() => {
            hideLoading();
            
            // Add to recent actions
            consoleData.recentActions.unshift({
                id: consoleData.recentActions.length + 1,
                action: 'Добавил заметку',
                case: `CASE-${caseId}`,
                time: new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})
            });
            
            loadRecentActions();
            alert('Заметка сохранена');
        }, 800);
    }
}

// Request documents
function requestDocuments(caseId) {
    const docTypes = prompt('Укажите типы документов через запятую:\n(паспорт, договор, справка о доходах и т.д.)');
    
    if (docTypes && docTypes.trim()) {
        showLoading('Отправка запроса...');
        
        setTimeout(() => {
            hideLoading();
            
            // Add to recent actions
            consoleData.recentActions.unshift({
                id: consoleData.recentActions.length + 1,
                action: 'Запросил документы',
                case: `CASE-${caseId}`,
                time: new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})
            });
            
            loadRecentActions();
            alert(`Запрос документов отправлен клиенту: ${docTypes}`);
        }, 1000);
    }
}

// Show loading overlay
function showLoading(message = 'Загрузка...') {
    let overlay = document.getElementById('loadingOverlay');
    
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'loadingOverlay';
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-content">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <div class="loading-message mt-3">${message}</div>
            </div>
        `;
        document.body.appendChild(overlay);
    }
}

// Hide loading overlay
function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.remove();
    }
}

// Update case status
function updateCaseStatus(caseId, status) {
    const statusText = {
        'pending': 'В ожидании',
        'review': 'На проверке',
        'approved': 'Одобрено',
        'rejected': 'Отклонено'
    }[status] || status;
    
    showLoading('Обновление статуса...');
    
    setTimeout(() => {
        hideLoading();
        
        // Add to recent actions
        consoleData.recentActions.unshift({
            id: consoleData.recentActions.length + 1,
            action: 'Обновил статус',
            case: `CASE-${caseId}`,
            time: new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})
        });
        
        loadRecentActions();
        
        // Update workload if completed
        if (status === 'approved' || status === 'rejected') {
            consoleData.workload.inProgress = Math.max(0, consoleData.workload.inProgress - 1);
            consoleData.workload.completedToday++;
            updateWorkloadStats();
        }
        
        alert(`Статус дела обновлен на: ${statusText}`);
    }, 800);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on console page
    if (window.location.pathname.includes('/console/')) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'console') {
            window.location.href = '../auth/login.html';
            return;
        }
        
        // Initialize console functions
        if (typeof initConsoleDashboard === 'function') {
            initConsoleDashboard();
        }
        
        // Set up event listeners
        setupConsoleEventListeners();
    }
});

// Setup event listeners
function setupConsoleEventListeners() {
    // Quick action buttons
    const quickActions = {
        'takeCaseBtn': takeNewCase,
        'addNoteBtn': () => addCaseNote('new'),
        'requestDocsBtn': () => requestDocuments('new'),
        'generateReportBtn': generateReport
    };
    
    Object.entries(quickActions).forEach(([id, handler]) => {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', handler);
        }
    });
    
    // Case status selectors
    const statusSelectors = document.querySelectorAll('.status-selector .status-option');
    statusSelectors.forEach(selector => {
        selector.addEventListener('click', function() {
            const status = this.dataset.status;
            const caseId = this.closest('.case-card')?.dataset.caseId || 'current';
            if (status) {
                updateCaseStatus(caseId, status);
            }
        });
    });
}

// Generate report
function generateReport() {
    showLoading('Генерация отчета...');
    
    setTimeout(() => {
        hideLoading();
        
        const reportData = {
            worker: consoleData.currentWorker.name,
            date: new Date().toLocaleDateString('ru-RU'),
            assigned: consoleData.workload.assigned,
            completed: consoleData.workload.completedToday,
            inProgress: consoleData.workload.inProgress,
            overdue: consoleData.workload.overdue
        };
        
        const reportText = `
Отчет оператора
===============
Оператор: ${reportData.worker}
Дата: ${reportData.date}
Статистика:
- Назначено дел: ${reportData.assigned}
- Завершено сегодня: ${reportData.completed}
- В процессе: ${reportData.inProgress}
- Просрочено: ${reportData.overdue}
        `.trim();
        
        alert('Отчет сгенерирован:\n\n' + reportText);
    }, 1500);
}