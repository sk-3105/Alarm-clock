const alarmButton = document.getElementById('add-alarm-button');
const alarmEntryBlock = document.getElementById('alarm-entry-block');
const alarmSetButton = document.getElementById('alarm-set-button');
const cancelButton = document.getElementById('cancel-button');
const alarmDisplay = document.getElementById('alarm-display');
const activeIndicator = document.getElementById('active-indicator');
const countdownDisplay = document.getElementById('countdown');  
const snoozeButton = document.getElementById('snooze-button');
let timeoutId = null;
let intervalId = null;
let playCount;
let alarmStopped;
let alarmSnoozed;

alarmButton.onclick = function () {
    alarmButton.style.display = 'none';
    alarmEntryBlock.style.display = 'block';
}

alarmSetButton.onclick = function () {
    const alarmInput = document.getElementById('alarm-input').value;
    const currentTimeObj = new Date();
    const alarmTimeObj = new Date();

    const [alarmHour, alarmMinutes] = [...alarmInput.split(':')];

    alarmTimeObj.setHours(parseInt(alarmHour));
    alarmTimeObj.setMinutes(parseInt(alarmMinutes));
    alarmTimeObj.setSeconds(0);
    
    const localTime = alarmTimeObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true })
    
    alarmEntryBlock.style.display = 'none'

    if (alarmTimeObj <= currentTimeObj) {
        alarmTimeObj.setDate(alarmTimeObj.getDate() + 1);
    }
    
    document.getElementById('alarm-details').textContent = `Alarm Set for ${localTime}`;
    let timeDifference = alarmTimeObj - currentTimeObj;

    /*  */
    intervalId = setInterval(updateTimer, 1000)
    
    function updateTimer() {
        timeDifference -= 1000;
        const hours = Math.floor(timeDifference / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
        const timer = `${hours.toString()}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        countdownDisplay.textContent = `Time Left ${timer}`;
      }
    /*  */

    alarmDisplay.style.display = 'flex';

    timeoutId = setTimeout(() => {
        activateAlarm();
    }, timeDifference);
}

cancelButton.onclick = function () {
    alarmButton.style.display = 'block';
    alarmEntryBlock.style.display = 'none';
}

function activateAlarm() {
    alarmStopped = false

    alarmDisplay.style.display = 'none';
    document.getElementById('alarm-running-block').style.display = 'block';

    playCount = 0;

    playAlarm();
}

function playAlarm() {
    const alarmAudio = new Audio('./Alarm Clock.mp3');
    alarmAudio.play();
    playCount++;
    activeIndicator.textContent = 'Alarm Active';
    snoozeButton.style.display = 'inline';

    alarmAudio.onended = () => {
        if (playCount < 20 && !alarmStopped && !alarmSnoozed) {
            playAlarm();
        } else if (alarmSnoozed) {
            alarmSnoozed = false;
        } else {
            document.getElementById('alarm-running-block').style.display = 'none';
            alarmButton.style.display = 'block'
            alarmStopped = false;
        }
    }
}

document.getElementById('delete-alarm-button').onclick = function () {
    countdownDisplay.textContent = 'Time Left 0:00:00'
    alarmDisplay.style.display = 'none';
    alarmButton.style.display = 'block';
    if (timeoutId !== null) {
        clearTimeout(timeoutId);
        clearInterval(intervalId);
    }
}

document.getElementById('stop-button').onclick = () => {
    alarmStopped = true;
    clearInterval(intervalId);
}
snoozeButton.onclick = function () {
    activeIndicator.textContent = `Snooze`;
    alarmSnoozed = true;
    snoozeButton.style.display = 'none'
    setTimeout(playAlarm, 5000)
}