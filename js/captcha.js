// CAPTCHA functionality

let currentCaptcha = {
    question: '',
    answer: 0
};

// Generate random math CAPTCHA
function generateCaptcha() {
    const operations = [
        { symbol: '+', func: (a, b) => a + b },
        { symbol: '-', func: (a, b) => a - b },
        { symbol: '×', func: (a, b) => a * b }
    ];
    
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let num1, num2;
    
    switch(operation.symbol) {
        case '+':
            num1 = Math.floor(Math.random() * 20) + 1;
            num2 = Math.floor(Math.random() * 20) + 1;
            break;
        case '-':
            num1 = Math.floor(Math.random() * 30) + 10;
            num2 = Math.floor(Math.random() * num1) + 1;
            break;
        case '×':
            num1 = Math.floor(Math.random() * 10) + 2;
            num2 = Math.floor(Math.random() * 10) + 2;
            break;
    }
    
    currentCaptcha = {
        question: `${num1} ${operation.symbol} ${num2}`,
        answer: operation.func(num1, num2)
    };
    
    return currentCaptcha;
}

// Display CAPTCHA
function displayCaptcha(elementId) {
    const captcha = generateCaptcha();
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="captcha-display">
                <h3>${captcha.question} = ?</h3>
            </div>
        `;
    }
    return captcha;
}

// Validate CAPTCHA answer
function validateCaptcha(userAnswer) {
    return parseInt(userAnswer) === currentCaptcha.answer;
}

// Initialize CAPTCHA on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a CAPTCHA page
    const captchaQuestionElement = document.getElementById('captchaQuestion');
    if (captchaQuestionElement) {
        const captcha = generateCaptcha();
        captchaQuestionElement.textContent = `${captcha.question} = ?`;
    }
    
    // Check if we're on login page with CAPTCHA
    const loginCaptchaElement = document.getElementById('loginCaptcha');
    if (loginCaptchaElement) {
        displayCaptcha('loginCaptcha');
    }
});

// CAPTCHA form submission
function handleCaptchaSubmit(event) {
    event.preventDefault();
    
    const answerInput = document.getElementById('captchaAnswer');
    const errorElement = document.getElementById('captchaError');
    
    if (!answerInput || !errorElement) return;
    
    const userAnswer = answerInput.value.trim();
    
    if (!userAnswer) {
        errorElement.textContent = 'Vă rugăm să introduceți răspunsul';
        errorElement.classList.remove('d-none');
        return;
    }
    
    if (!validateCaptcha(userAnswer)) {
        errorElement.textContent = 'Răspuns incorect. Încercați din nou.';
        errorElement.classList.remove('d-none');
        generateCaptcha();
        answerInput.value = '';
        
        // Update CAPTCHA display
        const captchaQuestionElement = document.getElementById('captchaQuestion');
        if (captchaQuestionElement) {
            captchaQuestionElement.textContent = `${currentCaptcha.question} = ?`;
        }
        
        return;
    }
    
    // CAPTCHA passed - proceed with login
    const user = JSON.parse(localStorage.getItem('tempUser'));
    if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.removeItem('tempUser');
        redirectByRole();
    }
}