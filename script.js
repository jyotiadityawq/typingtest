const textSamples = {
    easy: "The quick brown fox jumps over the lazy dog. (Repeat as much times possible)",
    medium: "Sphinx of black quartz, judge my vow. The testing is good for developers. Lets test it. Hello (Repeat as much times possible)",
    hard: "Pack my box with five dozen liquor jugs. Random words are text,youtube,google,facebook,instagram , chatgpt. Lets go ! (Repeat as much times possible)"
};

let startTime;
let endTime;
let textToType;
let interval;
let timeLimit;

document.getElementById('startBtn').addEventListener('click', startTest);
document.getElementById('stopBtn').addEventListener('click', stopTest);
document.getElementById('generateCertBtn').addEventListener('click', generateCertificate);
document.getElementById('closePopup').addEventListener('click', closePopup);

function startTest() {
    const difficulty = document.getElementById('difficulty').value;
    textToType = textSamples[difficulty];
    document.getElementById('textToType').textContent = textToType;
    document.getElementById('userInput').value = '';
    document.getElementById('userInput').disabled = false;
    document.getElementById('userInput').focus();
    document.getElementById('wpmDisplay').textContent = 'WPM: 0';
    document.getElementById('timerDisplay').textContent = 'Time: 0s';
    document.getElementById('startBtn').disabled = true;
    document.getElementById('stopBtn').disabled = false;

    switch (difficulty) {
        case 'easy':
            timeLimit = 60; 
            break;
        case 'medium':
            timeLimit = 120; 
            break;
        case 'hard':
            timeLimit = 180; 
            break;
    }

    startTime = new Date().getTime();
    interval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const currentTime = new Date().getTime();
    const timeElapsed = Math.floor((currentTime - startTime) / 1000); // in seconds
    document.getElementById('timerDisplay').textContent = `Time: ${timeElapsed}s`;

    if (timeElapsed >= timeLimit) {
        stopTest();
    } else {
        updateWPM();
    }
}

function updateWPM() {
    const currentTime = new Date().getTime();
    const timeElapsed = (currentTime - startTime) / 1000 / 60; // in minutes
    const wordsTyped = document.getElementById('userInput').value.split(' ').filter(word => word !== "").length;
    const wpm = Math.round(wordsTyped / timeElapsed);
    document.getElementById('wpmDisplay').textContent = `WPM: ${wpm}`;
}

document.getElementById('userInput').addEventListener('input', checkCompletion);

function checkCompletion() {
    const typedText = document.getElementById('userInput').value;
    if (typedText === textToType) {
        stopTest();
    }
}

function stopTest() {
    clearInterval(interval);
    document.getElementById('userInput').disabled = true;
    document.getElementById('startBtn').disabled = false;
    document.getElementById('stopBtn').disabled = true;
}

function generateCertificate() {
    const userName = document.getElementById('userName').value.trim();
    if (!userName) {
        alert('Please enter your name.');
        return;
    }

    const wpm = document.getElementById('wpmDisplay').textContent.split(' ')[1];
    const proficiency = getProficiency(wpm);

    const certificateDisplay = document.getElementById('certificateDisplay');
    certificateDisplay.innerHTML = `
        <h2>Certificate of Achievement</h2>
        <p>This certifies that <strong>${userName}</strong> achieved a typing speed of <strong>${wpm} WPM</strong> (${proficiency}).</p>
    `;

    const popup = document.getElementById('certificatePopup');
    popup.style.display = 'block';

    document.getElementById('downloadCertBtn').addEventListener('click', () => downloadCertificate(userName, wpm, proficiency));
}

function getProficiency(wpm) {
    if (wpm >= 60) {
        return 'Expert';
    } else if (wpm >= 40) {
        return 'Intermediate';
    } else {
        return 'Beginner';
    }
}

function closePopup() {
    const popup = document.getElementById('certificatePopup');
    popup.style.display = 'none';
}

function downloadCertificate(userName, wpm, proficiency) {
    const element = document.createElement('a');
    const certificateContent = document.getElementById('certificateDisplay').innerHTML;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 600;
    canvas.height = 400;

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';

    ctx.fillText('Certificate of Achievement', canvas.width / 2, 80);
    ctx.fillText(`This certifies that ${userName}`, canvas.width / 2, 150);
    ctx.fillText(`achieved a typing speed of ${wpm} WPM (${proficiency}).`, canvas.width / 2, 200);

    canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        element.href = url;
        element.download = `Certificate_${userName}.png`;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
        document.body.removeChild(element);
    });
}
