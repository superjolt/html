document.getElementById('add-todo').addEventListener('click', function() {
    addTask();
});

document.getElementById('settings').addEventListener('click', function() {
    document.getElementById('settings-dialog').style.display = 'block';
});

document.getElementById('save-settings').addEventListener('click', function() {
    const selectedRingtone = document.getElementById('ringtone-select').value;
    document.getElementById('ringtone').src = selectedRingtone;
    document.getElementById('settings-dialog').style.display = 'none';
});

function addTask() {
    const li = document.createElement('li');
    li.innerHTML = `
        <input type="text" class="task-name" placeholder="Task name">
        <div class="timer-options">
            <select class="timer-type">
                <option value="duration">Duration</option>
                <option value="specific-time">Specific Time</option>
            </select>
            <input type="number" class="hours" placeholder="Hours" min="0">
            <input type="number" class="minutes" placeholder="Minutes" min="0" max="59">
            <input type="number" class="seconds" placeholder="Seconds" min="0" max="59">
            <input type="time" class="specific-time-input" style="display: none;">
        </div>
        <div class="task-actions">
            <button class="start-timer">Start</button>
            <button class="delete"><i class="fas fa-trash"></i></button>
        </div>
    `;

    const deleteButton = li.querySelector('.delete');
    deleteButton.addEventListener('click', function() {
        li.remove();
    });

    const timerTypeSelect = li.querySelector('.timer-type');
    const durationInputs = li.querySelectorAll('.hours, .minutes, .seconds');
    const specificTimeInput = li.querySelector('.specific-time-input');

    timerTypeSelect.addEventListener('change', function() {
        if (timerTypeSelect.value === 'duration') {
            durationInputs.forEach(input => input.style.display = 'inline-block');
            specificTimeInput.style.display = 'none';
        } else {
            durationInputs.forEach(input => input.style.display = 'none');
            specificTimeInput.style.display = 'inline-block';
        }
    });

    const startTimerButton = li.querySelector('.start-timer');
    startTimerButton.addEventListener('click', function() {
        const taskName = li.querySelector('.task-name').value;
        const hours = parseInt(li.querySelector('.hours').value) || 0;
        const minutes = parseInt(li.querySelector('.minutes').value) || 0;
        const seconds = parseInt(li.querySelector('.seconds').value) || 0;
        const specificTime = li.querySelector('.specific-time-input').value;

        let timerValue;
        if (timerTypeSelect.value === 'specific-time') {
            const now = new Date();
            const [specificHours, specificMinutes] = specificTime.split(':').map(Number);
            const specificDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), specificHours, specificMinutes, 0);
            timerValue = (specificDate - now) / 1000;
            if (timerValue <= 0) {
                alert('The specified time is in the past. Please choose a future time.');
                return;
            }
        } else {
            timerValue = hours * 3600 + minutes * 60 + seconds;
            if (timerValue <= 0) {
                alert('Please set a valid timer.');
                return;
            }
        }

        const ringtone = document.getElementById('ringtone');
        const playRingtone = () => {
            ringtone.play();
            const dialog = document.createElement('div');
            dialog.className = 'dialog';
            dialog.innerHTML = `
                <h2>Reminder</h2>
                <p>${taskName}</p>
                <button id="stop-ringtone">Ok</button>
            `;
            document.body.appendChild(dialog);
            document.getElementById('stop-ringtone').addEventListener('click', function() {
                ringtone.pause();
                ringtone.currentTime = 0;
                dialog.remove();
            });

            const utterance = new SpeechSynthesisUtterance(`Reminder: ${taskName}`);
            window.speechSynthesis.speak(utterance);
        };

        setTimeout(function() {
            playRingtone();
            ringtone.loop = true;
        }, timerValue * 1000);
    });

    document.getElementById('todo-list').appendChild(li);
}