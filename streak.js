const addFormButton = document.getElementById('addFormButton');
const formContainer = document.getElementById('popup');
const streakForm = document.getElementById('streakForm');
const message = document.getElementById('message');
const activitiesDiv = document.getElementById('activities');
const noActivities = document.getElementById('noActivities');

let activities = [];

addFormButton.addEventListener('click', () => {
    formContainer.style.display = 'flex';
});

function closePopup() {
    formContainer.style.display = 'none';
}

function showMessage(text, isError = false) {
    message.textContent = text;
    message.style.color = isError ? 'red' : 'green';
    message.style.display = 'block';
    setTimeout(() => {
        message.style.display = 'none';
    }, 5000);
}

function viewStreak(index) {
    const activity = activities[index];
    const { days, months, years } = calculateDateDifference(activity.startDate);

    const detailedViewHTML = `
        <div class="modal-content">
            <h3>Streak Details</h3>
            <p><strong>Name:</strong> ${activity.name}</p>
            <p><strong>Start Date:</strong> ${activity.startDate}</p>
            <p><strong>Days Active:</strong> ${days} days</p>
            <p><strong>Months Active:</strong> ${months} months</p>
            <p><strong>Years Active:</strong> ${years} years</p>
            <img src="${activity.image}" alt="Image of ${activity.name}" style="max-width: 30%; height: auto; border-radius: 10px;">
            <button id="modal-close-btn" onclick="closeDetailedView()">Close</button>
        </div>
    `;
    
    const detailedViewModal = document.getElementById('detailedViewModal');
    detailedViewModal.innerHTML = detailedViewHTML;
    detailedViewModal.style.display = 'flex'; 
}

function closeDetailedView() {
    const detailedViewModal = document.getElementById('detailedViewModal');
    detailedViewModal.style.display = 'none'; 
}


function updateUI() {
    activitiesDiv.innerHTML = '';
    noActivities.style.display = activities.length === 0 ? 'block' : 'none';

    activities.forEach((activity, index) => {
        const activityHTML = `
            <div class="task">
                <img src="${activity.image}" alt="Image of ${activity.name}">
                <p><strong>${activity.name}</strong></p>
                <p>Start Date: ${activity.startDate}</p>
                <div>
                    <button class="view-btn" data-index="${index}">View</button>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                </div>
            </div>`;
        activitiesDiv.innerHTML += activityHTML;
    });
}


streakForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const image = document.getElementById('image').value.trim();
    const startDate = document.getElementById('startDate').value.trim();

    if (!name || !image || !startDate) {
        showMessage('All fields are required!', true);
        return;
    }

    const newActivity = { name, image, startDate };
    activities.push(newActivity);

    updateUI();
    streakForm.reset();
    closePopup();
    showMessage('Activity added successfully!');
});

activitiesDiv.addEventListener('click', (event) => {
    const index = event.target.dataset.index;
    if (event.target.matches('.view-btn')) {
        viewStreak(index);
    } else if (event.target.matches('.delete-btn')) {
        deleteStreak(index);
    }
});

function deleteStreak(index) {
    if (confirm('Are you sure you want to delete this activity?')) {
        activities.splice(index, 1);
        updateUI();
        showMessage('Activity deleted successfully!');
    }
}

function calculateDateDifference(startDate) {
    const start = new Date(startDate);
    const current = new Date();
    
    const diffInMilliseconds = current - start;
    
    const days = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);  
    const years = Math.floor(months / 12); 

    return { days, months, years };
}