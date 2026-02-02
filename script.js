// Using Local Storage

const STORAGE_KEY = 'studentsResults';

function getStoredResults() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveResults(results) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
}

// DOM

const studentForm = document.getElementById('studentForm');
const rollNoInput = document.getElementById('rollNo');
const nameInput = document.getElementById('name');
const dobInput = document.getElementById('dob');
const scoreInput = document.getElementById('score');
const viewAllBtn = document.getElementById('viewAllBtn');
const backBtn = document.getElementById('backBtn');
const addFormView = document.getElementById('addFormView');
const viewAllView = document.getElementById('viewAllView');
const resultsTableBody = document.getElementById('resultsTableBody');
const noResultsMessage = document.getElementById('noResultsMessage');

//Validation

function validateRollNo(rollNo) {
    const rollNoValue = rollNo.value.trim();

    if (!rollNoValue) {
        rollNo.setCustomValidity('Roll number is required');
        return false;
    }

    const rollNoNum = parseInt(rollNoValue);
    if (isNaN(rollNoNum) || rollNoNum <= 0) {
        rollNo.setCustomValidity('Roll number must be a positive number');
        return false;
    }

    const existingResults = getStoredResults();

    if (existingResults.some(result => result.rollNo === rollNoNum)) {
        rollNo.setCustomValidity('This roll number already exists');
        return false;
    }

    rollNo.setCustomValidity('');
    return true;
}

function validateName(name) {
    const nameValue = name.value.trim();

    if (!nameValue) {
        name.setCustomValidity('Name is required.');
        return false;
    }

    if (nameValue.length < 2) {
        name.setCustomValidity('Name must be at least 2 characters long.');
        return false;
    }

    name.setCustomValidity('');
    return true;
}

function validateDOB(dob) {
    const dobValue = dob.value.trim();

    if (!dobValue) {
        dob.setCustomValidity('Date of birth is required.');
        return false;
    }

    // Check format: dd/mm/yyyy
    const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!datePattern.test(dobValue)) {
        dob.setCustomValidity('Date must be in dd/mm/yyyy format.');
        return false;
    }

    const [, day, month, year] = dobValue.match(datePattern);
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    if (monthNum < 1 || monthNum > 12) {
        dob.setCustomValidity('Invalid month. Month must be between 01 and 12.');
        return false;
    }

    if (dayNum < 1 || dayNum > 31) {
        dob.setCustomValidity('Invalid day. Day must be between 01 and 31.');
        return false;
    }

    const dateObj = new Date(yearNum, monthNum - 1, dayNum);
    if (dateObj.getDate() !== dayNum || 
        dateObj.getMonth() !== monthNum - 1 || 
        dateObj.getFullYear() !== yearNum) {
        dob.setCustomValidity('Invalid date. Please check the day, month, and year.');
        return false;
    }
    
    // Check if date is not in the future
    const today = new Date();
    if (dateObj > today) {
        dob.setCustomValidity('Date of birth cannot be in the future.');
        return false;
    }
    
    dob.setCustomValidity('');
    return true;
}

// Validate Score
function validateScore(score) {
    const scoreValue = score.value.trim();
    
    if (!scoreValue) {
        score.setCustomValidity('Score is required.');
        return false;
    }
    
    const scoreNum = parseFloat(scoreValue);
    if (isNaN(scoreNum)) {
        score.setCustomValidity('Score must be a number.');
        return false;
    }
    
    if (scoreNum < 0 || scoreNum > 100) {
        score.setCustomValidity('Score must be between 0 and 100.');
        return false;
    }
    
    score.setCustomValidity('');
    return true;
}

rollNoInput.addEventListener('input', () => {
    validateRollNo(rollNoInput);
    rollNoInput.reportValidity();
});

nameInput.addEventListener('input', () => {
    validateName(nameInput);
    nameInput.reportValidity();
});

dobInput.addEventListener('input', () => {
    validateDOB(dobInput);
    dobInput.reportValidity();
});

scoreInput.addEventListener('input', () => {
    validateScore(scoreInput);
    scoreInput.reportValidity();
});

// FORM SUBMISSION HANDLER

studentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const isRollNoValid = validateRollNo(rollNoInput);
    const isNameValid = validateName(nameInput);
    const isDobValid = validateDOB(dobInput);
    const isScoreValid = validateScore(scoreInput);

    rollNoInput.reportValidity();
    nameInput.reportValidity();
    dobInput.reportValidity();
    scoreInput.reportValidity();

    if (isRollNoValid && isNameValid && isDobValid && isScoreValid) {
        // Create student data object
        const studentData = {
            rollNo: parseInt(rollNoInput.value.trim()),
            name: nameInput.value.trim(),
            dob: dobInput.value.trim(),
            score: parseFloat(scoreInput.value.trim())
        };

        // Get existing results and add new one
        const results = getStoredResults();
        results.push(studentData);
        saveResults(results);

        // Reset form
        studentForm.reset();
        studentForm.classList.remove('was-validated');

        alert(`Student result added successfully!\nRoll No: ${studentData.rollNo}\nName: ${studentData.name}\nScore: ${studentData.score}`);
    } else {
        studentForm.classList.add('was-validated');
    }
});

// DISPLAY RESULTS FUNCTION

function displayResults() {
    const results = getStoredResults();
    
    if (results.length === 0) {
        resultsTableBody.innerHTML = '';
        noResultsMessage.style.display = 'block';
        return;
    }

    noResultsMessage.style.display = 'none';
    
    const sortedResults = [...results].sort((a, b) => a.rollNo - b.rollNo);
    
    resultsTableBody.innerHTML = '';
    
    sortedResults.forEach((student) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.rollNo}</td>
            <td>${student.name}</td>
            <td>${student.dob}</td>
            <td>${student.score}</td>
        `;
        resultsTableBody.appendChild(row);
    });
}

// NAVIGATION FUNCTIONS

function showAddFormView() {
    addFormView.style.display = 'block';
    viewAllView.style.display = 'none';
    backBtn.style.display = 'none';
}

function showViewAllView() {
    addFormView.style.display = 'none';
    viewAllView.style.display = 'block';
    backBtn.style.display = 'block';
    displayResults();
}

// EVENT LISTENERS FOR NAVIGATION

viewAllBtn.addEventListener('click', () => {
    showViewAllView();
});

backBtn.addEventListener('click', () => {
    showAddFormView();
});

// INITIALIZE - Show add form view on page load

showAddFormView();