const cameraFeed = document.getElementById('cameraFeed');

if (cameraFeed) {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user' }, audio: false })
      .then((stream) => {
        cameraFeed.srcObject = stream;
        cameraFeed.play().catch(() => {});
      })
      .catch(() => {
        const screen = document.querySelector('.camera-screen');
        if (screen) {
          const fallback = document.createElement('div');
          fallback.className = 'camera-emoji';
          fallback.textContent = '📷';
          screen.appendChild(fallback);
        }
      });
  } else {
    const screen = document.querySelector('.camera-screen');
    if (screen) {
      const fallback = document.createElement('div');
      fallback.className = 'camera-emoji';
      fallback.textContent = '📷';
      screen.appendChild(fallback);
    }
  }
}

const cameraButton = document.querySelector('.capture-btn');
const questionPopup = document.getElementById('questionPopup');
const popupButtons = document.querySelectorAll('.popup-options .mini-btn');
const capturedPreview = document.getElementById('capturedPreview');

const absurdQuestions = [
  'does your toothpaste contain himalayan salt?',
  'have you ever felt emotionally close to a cucumber?',
  'is your tea currently making decisions for you?',
  'do you personally believe the moon is a suspiciously calm manager?'
];

if (questionPopup) {
  popupButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (button.classList.contains('go-back-btn')) {
        window.location.href = 'index.html';
        return;
      }

      window.location.href = 'result.html';
    });
  });
}

if (cameraButton) {
  const states = [
    { selector: '.buffering', delay: 1000 },
    { selector: '.ouiii', delay: 1300 },
    { selector: '.processing', delay: 1500 },
    { selector: '.thinking', delay: 1700 }
  ];

  const showQuestion = () => {
    if (!questionPopup) return;
    const randomQuestion = absurdQuestions[Math.floor(Math.random() * absurdQuestions.length)];
    questionPopup.querySelector('.question-text').textContent = randomQuestion;
    questionPopup.classList.remove('hidden');
  };

  const showStep = (index) => {
    if (index >= states.length) {
      setTimeout(() => {
        showQuestion();
      }, 300);
      return;
    }

    document.querySelectorAll('.status-line').forEach((line) => line.classList.add('hidden'));
    const step = states[index];
    const el = document.querySelector(step.selector);
    if (el) {
      el.classList.remove('hidden');
    }

    setTimeout(() => showStep(index + 1), step.delay);
  };

  cameraButton.addEventListener('click', () => {
    if (cameraButton.disabled) return;

    try {
      if (cameraFeed && cameraFeed.readyState >= 2 && cameraFeed.videoWidth && cameraFeed.videoHeight) {
        const canvas = document.createElement('canvas');
        canvas.width = cameraFeed.videoWidth;
        canvas.height = cameraFeed.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(cameraFeed, 0, 0, canvas.width, canvas.height);
        const snapshot = canvas.toDataURL('image/png');
        sessionStorage.setItem('ith-thengayalla-snapshot', snapshot);
      } else {
        sessionStorage.setItem('ith-thengayalla-snapshot', 'fallback');
      }
    } catch (error) {
      sessionStorage.setItem('ith-thengayalla-snapshot', 'fallback');
    }

    showStep(0);
    cameraButton.disabled = true;
    cameraButton.textContent = 'capturing...';
  });
}

const resultTitle = document.getElementById('resultTitle');

if (resultTitle) {
  const resultStyles = [
    'wobble',
    'mango',
    'teapot',
    'noodle',
    'cucumber',
    'chaos',
    'marble',
    'bloop',
    'scooter',
    'moonbeam'
  ];

  const chosen = resultStyles[Math.floor(Math.random() * resultStyles.length)];
  resultTitle.textContent = chosen;

  if (capturedPreview) {
    const snapshot = sessionStorage.getItem('ith-thengayalla-snapshot');
    if (snapshot && snapshot !== 'fallback') {
      capturedPreview.src = snapshot;
      capturedPreview.style.display = 'block';
    } else {
      capturedPreview.src = '';
      capturedPreview.style.display = 'none';
    }
  }
}
