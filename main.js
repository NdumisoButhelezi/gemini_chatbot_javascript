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

    const fullName = document.getElementById("fullName").value.trim();
    const contactInfo = document.getElementById("contactInfo").value.trim();
    const cvType = document.getElementById("cvType").value;
    const summary = document.getElementById("summary").value.trim();
    const skills = Array.from(document.getElementById("skills").selectedOptions).map(option => option.value);
    const experience = document.getElementById("experience").value.trim();
    const education = document.getElementById("education").value.trim();
    const certifications = document.getElementById("certifications").value.trim();
    const awards = document.getElementById("awards").value.trim();
    const attributes = document.getElementById("attributes").value.trim();
    const additionalInfo = document.getElementById("additionalInfo").value.trim();

    if (!fullName || !contactInfo || !cvType || !summary || !skills.length || !experience || !education) {
        console.log("Please fill out all required fields.");
        return;
    }

    const prompt = `
    Full Name: ${fullName}
    Contact Information: ${contactInfo}
    CV Type: ${cvType}
    Professional Summary: ${summary}
    Technical Skills: ${skills.join(', ')}
    Work Experience: ${experience}
    Education: ${education}
    Certifications: ${certifications}
    Awards and Recognition: ${awards}
    Personal Attributes: ${attributes}
    Additional Information: ${additionalInfo}
    `;

    console.log("user message", prompt);

    const chatArea = document.getElementById("chat-container");
    chatArea.innerHTML += userDiv(prompt);

    const aiResponse = await getResponse(prompt);
    let md_text = md().render(aiResponse);
    chatArea.innerHTML += aiDiv(md_text);

    history.push({ role: "user", parts: prompt });
    history.push({ role: "model", parts: aiResponse });

    console.log(history);

    // AI-driven job prediction
    const jobPrediction = await getJobRecommendations(skills, experience, education);
    chatArea.innerHTML += aiDiv(`Based on your CV, you might be suited for roles such as: ${jobPrediction}`);
}

async function getJobRecommendations(skills, experience, education) {
    // Use AI model to predict jobs based on CV data
    const jobPrompt = `
    Based on the following skills: ${skills.join(', ')}, experience: ${experience}, and education: ${education},
    suggest suitable job roles.
    `;
    const jobResponse = await getResponse(jobPrompt);
    return jobResponse;
}


// Check authentication status on page load
checkAuth();
