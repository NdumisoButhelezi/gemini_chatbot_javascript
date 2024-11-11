import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import md from "markdown-it";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB7hLo7WRCJ4UHTeGib-51fdulxMwAw-iQ",
    authDomain: "ai-mentor-app-1441c.firebaseapp.com",
    projectId: "ai-mentor-app-1441c",
    storageBucket: "ai-mentor-app-1441c.firebasestorage.app",
    messagingSenderId: "336345816193",
    appId: "1:336345816193:web:dacc65d9995dfa0735c180",
    measurementId: "G-6SFV263PSY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize the model
const genAI = new GoogleGenerativeAI(`${import.meta.env.VITE_API_KEY}`);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

let history = [];

// Function to check if user is authenticated
function checkAuth() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("User is logged in:", user);
            // User is logged in, allow access to chatbot
            initializeChatbot();
        } else {
            console.log("User is not logged in. Redirecting to login page.");
            // User is not logged in, redirect to login page
            window.location.href = 'register.html';
        }
    });
}

// Function to initialize chatbot functionality
function initializeChatbot() {
    const chatForm = document.getElementById("chat-form");
    chatForm.addEventListener("submit", handleSubmit);

    chatForm.addEventListener("keyup", (event) => {
        if (event.keyCode === 13) handleSubmit(event);
    });
}

async function getResponse(prompt) {
    try {
        const chat = await model.startChat({ history: history });
        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const text = response.text();

        console.log(text);
        return text;
    } catch (error) {
        console.error("Error in getResponse:", error);
        return "Sorry, there was an error processing your request.";
    }
}

// User chat div
export const userDiv = (data) => {
    return `
    <!-- User Chat -->
            <div class="flex items-center gap-2 justify-start">
                <img
                src="user.jpg"
                alt="user icon"
                class="w-10 h-10 rounded-full"
                />
                <p class="bg-gemDeep text-white p-1 rounded-md shadow-md  ">
                ${data}
                </p>
            </div>
    `;
};

// AI Chat div
export const aiDiv = (data) => {
    return `
    <!-- AI Chat -->
            <div class="flex gap-2 justify-end">
                <pre class="bg-gemRegular/40 text-gemDeep p-1 rounded-md shadow-md whitespace-pre-wrap">
                ${data}
                </pre>
                <img
                src="chat-bot.jpg"
                alt="user icon"
                class="w-10 h-10 rounded-full"
                />
            </div>
    `;
};

async function handleSubmit(event) {
    event.preventDefault();

    // Collect form data
    const formData = {
        fullName: document.getElementById("fullName").value.trim(),
        contactInfo: document.getElementById("contactInfo").value.trim(), 
        cvType: document.getElementById("cvType").value,
        summary: document.getElementById("summary").value.trim(),
        skills: Array.from(document.getElementById("skills").selectedOptions).map(o => o.value),
        experience: document.getElementById("experience").value.trim(),
        education: document.getElementById("education").value.trim(),
        certifications: document.getElementById("certifications").value.trim(),
        awards: document.getElementById("awards").value.trim(),
        attributes: document.getElementById("attributes").value.trim(),
        additionalInfo: document.getElementById("additionalInfo").value.trim()
    };

    // Create prompt from form data
    const prompt = `Generate a professional CV using this information:
        Name: ${formData.fullName}
        Contact: ${formData.contactInfo}
        Type: ${formData.cvType}
        Summary: ${formData.summary}
        Skills: ${formData.skills.join(', ')}
        Experience: ${formData.experience}
        Education: ${formData.education}
        Certifications: ${formData.certifications}
        Awards: ${formData.awards}
        Attributes: ${formData.attributes}
        Additional: ${formData.additionalInfo}`;

    // Get AI response
    const response = await getResponse(prompt);
    console.log('AI Response:', response);

    // Store the AI response in local storage
    localStorage.setItem('aiResponse', response);

    // Display the AI response
    displayResponse(response);

    // Show the generate CV button
    const generateCVButton = document.getElementById('generate-cv-button');
    generateCVButton.style.display = 'block';
}

// Function to display the AI response
function displayResponse(response) {
    const aiResponseDiv = document.getElementById('ai-response');
    aiResponseDiv.innerHTML = `<pre>${response}</pre>`;
}

// Add a function to generate CV from AI response
async function generateCVFromAIResponse() {
    const aiResponse = localStorage.getItem('aiResponse');
    const parsedResponse = parseAIResponse(aiResponse);

    // Store the parsed CV data in local storage
    localStorage.setItem('cvData', JSON.stringify(parsedResponse));

    // Redirect to the CV page to display the data
    window.location.href = 'cv.html';
}

// Function to parse AI response
function parseAIResponse(aiResponse) {
    // Implement logic to parse the AI response and extract relevant information
    // This is a placeholder function. You'll need to implement the actual parsing logic
    return {
        fullName: extractValue(aiResponse, "Full Name"),
        contactInfo: extractValue(aiResponse, "Contact Information"),
        cvType: extractValue(aiResponse, "CV Type"),
        summary: extractValue(aiResponse, "Summary"),
        skills: extractArray(aiResponse, "Skills"),
        experience: extractValue(aiResponse, "Experience"),
        education: extractValue(aiResponse, "Education"),
        certifications: extractValue(aiResponse, "Certifications"),
        awards: extractValue(aiResponse, "Awards"),
        attributes: extractValue(aiResponse, "Personal Attributes"),
        additionalInfo: extractValue(aiResponse, "Additional Information"),
        jobRecommendations: [
            "Senior Software Engineer at Tech Solutions",
            "Lead Data Analyst at Global Analytics",
            "Full Stack Developer at Bright Future"
        ]
    };
}

// Helper functions to extract values from the AI response
function extractValue(response, key) {
    const regex = new RegExp(`${key}:\\s*(.+?)(?:\\n|$)`, 'i');
    const match = response.match(regex);
    return match ? match[1].trim() : '';
}

function extractArray(response, key) {
    const regex = new RegExp(`${key}:\\s*(.+?)(?:\\n|$)`, 'i');
    const match = response.match(regex);
    if (match) {
        const arrayString = match[1].trim();
        return arrayString.split(',').map(item => item.trim());
    }
    return [];
}


// Helper function to extract experience information
function extractExperience(response) {
    const regex = /Experience:\s*(.+?)(?:\n\n|$)/s;
    const match = response.match(regex);
    if (match) {
        const experienceString = match[1].trim();
        return experienceString.split('\n\n').map(experience => {
            const [company, position, dates] = experience.split('\n');
            return {
                company: company.replace('Company:', '').trim(),
                position: position.replace('Position:', '').trim(),
                dates: dates.replace('Dates:', '').trim(),
                achievements: extractArray(experience, 'Achievements')
            };
        });
    }
    return [];
}

// Helper function to extract education information
function extractEducation(response) {
    const regex = /Education:\s*(.+?)(?:\n\n|$)/s;
    const match = response.match(regex);
    if (match) {
        const educationString = match[1].trim();
        return educationString.split('\n\n').map(education => {
            const [institution, degree, dates] = education.split('\n');
            return {
                institution: institution.replace('Institution:', '').trim(),
                degree: degree.replace('Degree:', '').trim(),
                dates: dates.replace('Dates:', '').trim()
            };
        });
    }
    return [];
}
// Check authentication status on page load
checkAuth();

// Add event listener to the generate CV button
document.getElementById('generate-cv-button').addEventListener('click', generateCVFromAIResponse);
