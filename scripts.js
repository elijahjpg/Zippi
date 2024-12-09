document.addEventListener('DOMContentLoaded', () => {
    const postCommentButton = document.getElementById('post-comment');
    const commentNameInput = document.getElementById('comment-name');
    const commentMessageInput = document.getElementById('comment-message');
    const commentsDisplay = document.getElementById('comments-display');
    const errorMessage = document.getElementById('error-message');

    postCommentButton.addEventListener('click', () => {
        const name = commentNameInput.value.trim();
        const message = commentMessageInput.value.trim();

        if (!name || !message) {
            errorMessage.textContent = "Both fields are required!";
            return;
        }

        errorMessage.textContent = "";

        // Create a new comment card
        const commentCard = document.createElement('div');
        commentCard.classList.add('comment-card');

        const commentHeader = document.createElement('h4');
        commentHeader.textContent = name;

        const commentBody = document.createElement('p');
        commentBody.textContent = message;

        commentCard.appendChild(commentHeader);
        commentCard.appendChild(commentBody);

        // Add the comment to the display section
        commentsDisplay.prepend(commentCard);

    });
});

function addComment(event) {
    event.preventDefault();

    const author = document.getElementById('author').value;
    const comment = document.getElementById('comment').value;

    const commentList = document.getElementById('commentList');
    const newComment = document.createElement('li');
    newComment.innerHTML = `
        <span class="comment-author">${author}</span>
        <p class="comment-text">${comment}</p>
    `;
    commentList.appendChild(newComment);

    // Clear form fields
    document.getElementById('author').value = '';
    document.getElementById('comment').value = '';

}
function addComment(event) {
    event.preventDefault(); // Prevent page refresh

    // Get values from input fields
    const author = document.getElementById('author').value.trim();
    const comment = document.getElementById('comment').value.trim();

    // Validation: Check if fields are empty
    if (!author || !comment) {
        displayErrorMessage('Both fields are required!');
        return;
    }

    // Clear any previous error messages
    clearErrorMessage();

    // Create new comment element
    const newComment = document.createElement('li');
    newComment.innerHTML = `
        <span class="comment-author">${author}</span>
        <p class="comment-text">${comment}</p>
    `;

    // Append new comment to comment list
    document.getElementById('commentList').appendChild(newComment);

    // Clear input fields
    document.getElementById('author').value = '';
    document.getElementById('comment').value = '';
}

// Function to display error messages
function displayErrorMessage(message) {
    let errorDiv = document.getElementById('error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'error-message';
        errorDiv.style.color = 'red';
        errorDiv.style.marginTop = '10px';
        document.querySelector('.comment-section').insertBefore(errorDiv, document.querySelector('.comment-form'));
    }
    errorDiv.textContent = message;
}

// Function to clear error messages
function clearErrorMessage() {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");

    // Select the toggle button by its ID
    const toggleButton = document.getElementById('darkModeToggle');
    if (!toggleButton) {
        console.error("Dark mode toggle button not found!");
        return; // Stop execution if the button is not found
    }

    // Retrieve the user's saved theme preference
    const darkModePreference = localStorage.getItem('dark-mode');

    // If dark mode is enabled in localStorage, apply it
    if (darkModePreference === 'enabled') {
        console.log("Dark mode enabled from localStorage");
        document.documentElement.classList.add('dark-mode');
        toggleButton.textContent = '☀️'; // Show sun icon to switch to light mode
    } else if (darkModePreference === 'disabled' || darkModePreference === null) {
        console.log("No dark mode preference saved or it's disabled, using light mode");
        toggleButton.textContent = '🌙'; // Show moon icon to switch to dark mode
    }

    // Add event listener for the button click to toggle dark mode
    toggleButton.addEventListener('click', () => {
        const isDarkModeEnabled = document.documentElement.classList.toggle('dark-mode');

        // Update localStorage and button text based on the toggle state
        if (isDarkModeEnabled) {
            localStorage.setItem('dark-mode', 'enabled');
            toggleButton.textContent = '☀️'; // Sun icon for light mode
        } else {
            localStorage.setItem('dark-mode', 'disabled');
            toggleButton.textContent = '🌙'; // Moon icon for dark mode
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('darkModeToggle');
    const quizButtons = document.querySelectorAll('.start-quiz');
    const quizContainer = document.getElementById('quiz-container');
    const quizTitle = document.getElementById('quiz-title');
    const quizQuestion = document.getElementById('quiz-question');
    const quizOptions = document.getElementById('quiz-options');
    const nextButton = document.getElementById('next-question');
    const submitButton = document.getElementById('submit-quiz');
    const quizResult = document.getElementById('quiz-result');
    const nameInputContainer = document.getElementById('name-input-container');
    const userNameInput = document.getElementById('userName');
    const submitNameButton = document.getElementById('submit-name');

    if (!quizContainer) {
        console.log("Quiz section not found. Skipping quiz logic.");
        return; // Exit if the quiz section doesn't exist
    }

    let currentQuiz = null;
    let currentQuestionIndex = 0;
    let score = 0;

    // Define quizzes and their questions
    const quizzes = {
        1: {
            title: "News of the Week Quiz",
            questions: [
                {
                    question: "What is the latest news in tech?",
                    options: ["AI breakthroughs", "SpaceX launch", "New iPhone release"],
                    correct: 0
                },
                {
                    question: "Who won the 2024 Academy Award for Best Picture?",
                    options: ["Movie A", "Movie B", "Movie C"],
                    correct: 1
                }
            ]
        },
        2: {
            title: "Tech Trivia",
            questions: [
                {
                    question: "What does AI stand for?",
                    options: ["Artificial Intelligence", "Automatic Integration", "Advanced Internet"],
                    correct: 0
                },
                {
                    question: "Who is the founder of SpaceX?",
                    options: ["Elon Musk", "Jeff Bezos", "Bill Gates"],
                    correct: 0
                }
            ]
        },
        3: {
            title: "Pop Culture Quiz",
            questions: [
                {
                    question: "Who played the lead role in the movie 'Avengers'?",
                    options: ["Chris Hemsworth", "Robert Downey Jr.", "Mark Ruffalo"],
                    correct: 1
                },
                {
                    question: "Which artist released 'Bad Bunny' album?",
                    options: ["Bad Bunny", "Drake", "Kanye West"],
                    correct: 0
                }
            ]
        }
    };

    // Start quiz
    quizButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            currentQuiz = quizzes[event.target.dataset.quiz];
            currentQuestionIndex = 0;
            score = 0;
            loadQuestion();
            quizContainer.style.display = 'block';
        });
    });

    // Load a question and options
    function loadQuestion() {
        const questionData = currentQuiz.questions[currentQuestionIndex];
        quizTitle.textContent = currentQuiz.title;
        quizQuestion.textContent = questionData.question;

        quizOptions.innerHTML = '';
        questionData.options.forEach((option, index) => {
            const optionButton = document.createElement('button');
            optionButton.textContent = option;
            optionButton.classList.add('quiz-option-button');
            optionButton.addEventListener('click', () => checkAnswer(index));
            quizOptions.appendChild(optionButton);
        });

        nextButton.style.display = 'none';
        submitButton.style.display = 'none';
    }

    // Check if the answer is correct
    function checkAnswer(selectedIndex) {
        const questionData = currentQuiz.questions[currentQuestionIndex];
        if (selectedIndex === questionData.correct) {
            score++;
        }

        nextButton.style.display = 'inline-block';
    }

    // Go to the next question
    if (!nextButton) {
        console.error("Next Question button not found!");
        return;
    }
    nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < currentQuiz.questions.length) {
            loadQuestion();
        } else {
            quizResult.textContent = `You scored ${score} out of ${currentQuiz.questions.length}`;
            nextButton.style.display = 'none';
            submitButton.style.display = 'inline-block';
            nameInputContainer.style.display = 'block'; // Show the name input field
        }
    });

    // Handle name submission when user clicks "Submit Name"
    submitNameButton.addEventListener('click', () => {
        const userName = userNameInput.value.trim();
        if (userName) {
            updateLeaderboard(userName, score); // Save user name and score
            quizContainer.style.display = 'none'; // Hide quiz content
            displayLeaderboard(); // Display updated leaderboard
        } else {
            alert("Please enter your name."); // If name is empty, prompt the user
        }
    });

    // Submit the quiz and update the leaderboard
    submitButton.addEventListener('click', () => {
        updateLeaderboard(score);
        quizContainer.style.display = 'none';
    });

    // Update the leaderboard with name and score
    function updateLeaderboard(userName, userScore) {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        leaderboard.push({ name: userName, points: userScore });
        leaderboard.sort((a, b) => b.points - a.points); // Sort leaderboard by points in descending order
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    }

    // Display the leaderboard
    function displayLeaderboard() {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        const leaderboardList = document.getElementById('leaderboard-list');
        leaderboardList.innerHTML = '';

        leaderboard.forEach((entry, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${entry.name} - ${entry.points} points`;
            leaderboardList.appendChild(li);
        });
    }
});