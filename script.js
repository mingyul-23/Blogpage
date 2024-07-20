const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let savedInfo = {};

// Load saved entries from localStorage when the page loads
window.onload = function() {
    if (localStorage.getItem('savedInfo')) {
        savedInfo = JSON.parse(localStorage.getItem('savedInfo'));
    }
    renderCalendar(currentMonth, currentYear);
    renderSavedEntries();
};

function renderCalendar(month, year) {
    const daysElement = document.getElementById('days');
    const monthNameElement = document.getElementById('monthName');
    daysElement.innerHTML = '';
    monthNameElement.innerHTML = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = 32 - new Date(year, month, 32).getDate();

    // Create blank days for the first week
    for (let i = 0; i < firstDay; i++) {
        const blankDay = document.createElement('div');
        blankDay.classList.add('day');
        daysElement.appendChild(blankDay);
    }

    // Create days of the month
    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.classList.add('day');
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        if (savedInfo[dateKey]) {
            day.classList.add('saved-entry');
        }
        day.textContent = i;
        day.onclick = () => loadBlogPage(i, month, year);
        daysElement.appendChild(day);
    }

    // Automatically select today's date if the current month and year are displayed
    if (month === new Date().getMonth() && year === new Date().getFullYear()) {
        loadBlogPage(new Date().getDate(), month, year);
    }
}

function loadBlogPage(day, month, year) {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const formattedDate = `${monthNames[month]} ${day}, ${year}`;
    document.getElementById('dateInput').value = dateKey;
    document.getElementById('infoInput').innerHTML = savedInfo[dateKey] ? savedInfo[dateKey].info : "";
    document.getElementById('titleInput').value = savedInfo[dateKey] ? savedInfo[dateKey].title : "";
    renderSavedEntries();
}

function saveInfo() {
    const infoInput = document.getElementById('infoInput').innerHTML;
    const titleInput = document.getElementById('titleInput').value;
    const dateInput = document.getElementById('dateInput').value;
    const dateKey = dateInput;
    savedInfo[dateKey] = { title: titleInput, info: infoInput };
    localStorage.setItem('savedInfo', JSON.stringify(savedInfo)); // Save to localStorage
    const [year, month, day] = dateInput.split('-').map(Number);
    renderCalendar(currentMonth, currentYear); // Re-render the calendar to update saved entries
    loadBlogPage(day, month - 1, year); // Reload the current date's blog page
    clearInputs(); // Clear the inputs after saving
}

function clearInputs() {
    document.getElementById('dateInput').value = '';
    document.getElementById('infoInput').innerHTML = '';
    document.getElementById('titleInput').value = '';
}

function renderSavedEntries() {
    const savedEntriesElement = document.getElementById('savedEntries');
    savedEntriesElement.innerHTML = '<h2>Saved Entries</h2>';
    for (const [date, entry] of Object.entries(savedInfo)) {
        const entryElement = document.createElement('div');
        entryElement.classList.add('entry');
        entryElement.textContent = `${date}: ${entry.title}`;
        savedEntriesElement.appendChild(entryElement);
    }
}

function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
}

function toggleDarkMode() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
}

function formatText(command) {
    document.execCommand(command, false, null);
}

function alignText(command) {
    document.execCommand(`justify${command}`, false, null);
}

function changeTextSize(size) {
    document.execCommand("fontSize", false, size);
}

// Initial render
renderCalendar(currentMonth, currentYear);
renderSavedEntries();
