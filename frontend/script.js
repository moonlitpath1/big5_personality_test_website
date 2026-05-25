const questions = [
    { id: 'EXT1', text: 'I am the life of the party.', trait: 'Extraversion', reverse: false },
    { id: 'EXT2', text: "I don't talk a lot.", trait: 'Extraversion', reverse: true },
    { id: 'EXT3', text: 'I feel comfortable around people.', trait: 'Extraversion', reverse: false },
    { id: 'EXT4', text: 'I keep in the background.', trait: 'Extraversion', reverse: true },
    { id: 'EXT5', text: 'I start conversations.', trait: 'Extraversion', reverse: false },
    { id: 'EXT6', text: 'I have little to say.', trait: 'Extraversion', reverse: true },
    { id: 'EXT7', text: 'I talk to a lot of different people at parties.', trait: 'Extraversion', reverse: false },
    { id: 'EXT8', text: "I don't like to draw attention to myself.", trait: 'Extraversion', reverse: true },
    { id: 'EXT9', text: "I don't mind being the center of attention.", trait: 'Extraversion', reverse: false },
    { id: 'EXT10', text: 'I am quiet around strangers.', trait: 'Extraversion', reverse: true },
    
    { id: 'EST1', text: 'I get stressed out easily.', trait: 'Neuroticism', reverse: false },
    { id: 'EST2', text: 'I am relaxed most of the time.', trait: 'Neuroticism', reverse: true },
    { id: 'EST3', text: 'I worry about things.', trait: 'Neuroticism', reverse: false },
    { id: 'EST4', text: 'I seldom feel blue.', trait: 'Neuroticism', reverse: true },
    { id: 'EST5', text: 'I am easily disturbed.', trait: 'Neuroticism', reverse: false },
    { id: 'EST6', text: 'I get upset easily.', trait: 'Neuroticism', reverse: false },
    { id: 'EST7', text: 'I change my mood a lot.', trait: 'Neuroticism', reverse: false },
    { id: 'EST8', text: 'I have frequent mood swings.', trait: 'Neuroticism', reverse: false },
    { id: 'EST9', text: 'I get irritated easily.', trait: 'Neuroticism', reverse: false },
    { id: 'EST10', text: 'I often feel blue.', trait: 'Neuroticism', reverse: false },
    
    { id: 'AGR1', text: 'I feel little concern for others.', trait: 'Agreeableness', reverse: true },
    { id: 'AGR2', text: 'I am interested in people.', trait: 'Agreeableness', reverse: false },
    { id: 'AGR3', text: "I insult people.", trait: 'Agreeableness', reverse: true },
    { id: 'AGR4', text: "I sympathize with others' feelings.", trait: 'Agreeableness', reverse: false },
    { id: 'AGR5', text: "I am not interested in other people's problems.", trait: 'Agreeableness', reverse: true },
    { id: 'AGR6', text: 'I have a soft heart.', trait: 'Agreeableness', reverse: false },
    { id: 'AGR7', text: 'I am not really interested in others.', trait: 'Agreeableness', reverse: true },
    { id: 'AGR8', text: 'I take time out for others.', trait: 'Agreeableness', reverse: false },
    { id: 'AGR9', text: "I feel others' emotions.", trait: 'Agreeableness', reverse: false },
    { id: 'AGR10', text: 'I make people feel at ease.', trait: 'Agreeableness', reverse: false },
    
    { id: 'CSN1', text: 'I am always prepared.', trait: 'Conscientiousness', reverse: false },
    { id: 'CSN2', text: 'I leave my belongings around.', trait: 'Conscientiousness', reverse: true },
    { id: 'CSN3', text: 'I pay attention to details.', trait: 'Conscientiousness', reverse: false },
    { id: 'CSN4', text: 'I make a mess of things.', trait: 'Conscientiousness', reverse: true },
    { id: 'CSN5', text: 'I get chores done right away.', trait: 'Conscientiousness', reverse: false },
    { id: 'CSN6', text: 'I often forget to put things back in their proper place.', trait: 'Conscientiousness', reverse: true },
    { id: 'CSN7', text: 'I like order.', trait: 'Conscientiousness', reverse: false },
    { id: 'CSN8', text: 'I shirk my duties.', trait: 'Conscientiousness', reverse: true },
    { id: 'CSN9', text: 'I follow a schedule.', trait: 'Conscientiousness', reverse: false },
    { id: 'CSN10', text: 'I am exacting in my work.', trait: 'Conscientiousness', reverse: false },
    
    { id: 'OPN1', text: 'I have a rich vocabulary.', trait: 'Openness', reverse: false },
    { id: 'OPN2', text: 'I have difficulty understanding abstract ideas.', trait: 'Openness', reverse: true },
    { id: 'OPN3', text: 'I have a vivid imagination.', trait: 'Openness', reverse: false },
    { id: 'OPN4', text: 'I am not interested in abstract ideas.', trait: 'Openness', reverse: true },
    { id: 'OPN5', text: 'I have excellent ideas.', trait: 'Openness', reverse: false },
    { id: 'OPN6', text: 'I do not have a good imagination.', trait: 'Openness', reverse: true },
    { id: 'OPN7', text: 'I am quick to understand things.', trait: 'Openness', reverse: false },
    { id: 'OPN8', text: 'I use difficult words.', trait: 'Openness', reverse: false },
    { id: 'OPN9', text: 'I spend time reflecting on things.', trait: 'Openness', reverse: false },
    { id: 'OPN10', text: 'I am full of ideas.', trait: 'Openness', reverse: false }
];

let currentQuestionIndex = 0;
let answers = {};
let chartInstance = null;

function startQuiz() {
    document.getElementById('landing-page').classList.add('hidden');
    document.getElementById('quiz-page').classList.remove('hidden');
    currentQuestionIndex = 0;
    answers = {};
    displayQuestion();
}

function displayQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById('question-text').textContent = question.text;
    
    const radios = document.querySelectorAll('input[name="answer"]');
    radios.forEach(radio => {
        radio.checked = false;
        if (answers[question.id]) {
            if (radio.value == answers[question.id]) {
                radio.checked = true;
            }
        }
    });
    
    updateProgress();
    updateButtons();
}

function updateProgress() {
    const answeredCount = Object.keys(answers).length;
    const percentage = (answeredCount / questions.length) * 100;
    document.getElementById('progress-bar').style.width = percentage + '%';
    document.getElementById('progress-text').textContent = answeredCount;
}

function updateButtons() {
    document.getElementById('prev-btn').disabled = currentQuestionIndex === 0;
    
    const nextBtn = document.getElementById('next-btn');
    if (currentQuestionIndex === questions.length - 1) {
        nextBtn.textContent = 'Submit';
    } else {
        nextBtn.textContent = 'Next';
    }
}

function nextQuestion() {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    
    if (!selectedAnswer) {
        alert('Please select an answer before proceeding.');
        return;
    }
    
    const question = questions[currentQuestionIndex];
    answers[question.id] = parseInt(selectedAnswer.value);
    
    if (currentQuestionIndex === questions.length - 1) {
        if (Object.keys(answers).length === questions.length) {
            submitQuiz();
        } else {
            alert('Please answer all questions before submitting.');
        }
    } else {
        currentQuestionIndex++;
        displayQuestion();
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

function calculateOCEANScores() {
    const scores = {
        Extraversion: 0,
        Neuroticism: 0,
        Agreeableness: 0,
        Conscientiousness: 0,
        Openness: 0
    };
    
    const counts = {
        Extraversion: 0,
        Neuroticism: 0,
        Agreeableness: 0,
        Conscientiousness: 0,
        Openness: 0
    };
    
    questions.forEach(q => {
        const answer = answers[q.id];
        const score = q.reverse ? (6 - answer) : answer;
        scores[q.trait] += score;
        counts[q.trait]++;
    });
    
    Object.keys(scores).forEach(trait => {
        scores[trait] = scores[trait] / counts[trait];
    });
    
    return scores;
}

async function submitQuiz() {
    const oceanScores = calculateOCEANScores();
    
    document.getElementById('loading-spinner').classList.remove('hidden');
    
    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(oceanScores)
        });
        
        const result = await response.json();
        
        document.getElementById('loading-spinner').classList.add('hidden');
        
        if (!response.ok || result.error) {
            alert('Error: ' + (result.error || 'Unable to make prediction. Please ensure model files are loaded.'));
            console.error('Prediction error:', result);
            return;
        }
        
        displayResults(result, oceanScores);
    } catch (error) {
        document.getElementById('loading-spinner').classList.add('hidden');
        alert('Error connecting to the server. Please try again.');
        console.error('Error:', error);
    }
}

function displayResults(prediction, oceanScores) {
    document.getElementById('quiz-page').classList.add('hidden');
    document.getElementById('results-page').classList.remove('hidden');
    
    document.getElementById('personality-type').textContent = prediction.personality_type;
    document.getElementById('personality-description').textContent = prediction.description;
    
    if (chartInstance) {
        chartInstance.destroy();
    }
    
    const ctx = document.getElementById('personality-chart').getContext('2d');
    chartInstance = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism'],
            datasets: [{
                label: 'Your Scores',
                data: [
                    oceanScores.Openness.toFixed(2),
                    oceanScores.Conscientiousness.toFixed(2),
                    oceanScores.Extraversion.toFixed(2),
                    oceanScores.Agreeableness.toFixed(2),
                    oceanScores.Neuroticism.toFixed(2)
                ],
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(99, 102, 241, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(99, 102, 241, 1)'
            }]
        },
        options: {
            scales: {
                r: {
                    beginAtZero: true,
                    max: 5,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function retakeQuiz() {
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }
    document.getElementById('results-page').classList.add('hidden');
    document.getElementById('landing-page').classList.remove('hidden');
    currentQuestionIndex = 0;
    answers = {};
}
