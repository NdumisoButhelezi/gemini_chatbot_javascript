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

// Add gender equity focus configurations
const GENDER_EQUITY_THEMES = {
    discrimination: {
        keywords: ["leadership", "advocacy", "equality", "empowerment", "inclusion"],
        achievements: ["breaking barriers", "promoting equality", "mentoring women"]
    },
    safety: {
        keywords: ["security", "protection", "advocacy", "support", "awareness"],
        achievements: ["creating safe spaces", "implementing safeguards", "education"]
    },
    healthcare: {
        keywords: ["wellness", "health advocacy", "care access", "support"],
        achievements: ["improving access", "health education", "community support"]
    },
    economic: {
        keywords: ["financial empowerment", "leadership", "entrepreneurship"],
        achievements: ["economic initiatives", "business development", "mentorship"]
    }
};


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

// First, fix the getResponse function
// Fix the getResponse and handleSubmit functions
async function getResponse(prompt) {
    try {
        if (!prompt) {
            throw new Error('Empty prompt');
        }

        const chat = await model.startChat();
        const result = await chat.sendMessage(prompt);
        
        if (!result || !result.response) {
            throw new Error('Invalid AI response');
        }

        const response = result.response.text();
        
        // Store the response immediately
        localStorage.setItem('aiResponse', response);

        // Add response to chat history
        const chatContainer = document.getElementById('chat-container');
        if (chatContainer) {
            chatContainer.innerHTML += aiDiv(response);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }

        // Show the generate CV button
        const generateButton = document.getElementById('generate-cv-button');
        if (generateButton) {
            generateButton.style.display = 'block';
            generateButton.disabled = false;
        }

        return response;
    } catch (error) {
        console.error("Error in getResponse:", error);
        alert('Error generating CV. Please try again.');
        return null;
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
    `;}



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

    try {
        // Validate form data first
        const formData = validateAndGetFormData();
        if (!formData) {
            throw new Error('Invalid form data');
        }

        // Create prompt
        const prompt = createPrompt(formData);
        
        // Get AI response
        const response = await getResponse(prompt);
        if (!response) {
            throw new Error('No response from AI');
        }

        // Store and display response
        localStorage.setItem('cvData', JSON.stringify(formData));
        displayResponse(response);

    } catch (error) {
        console.error('Error:', error);
        alert('Error generating CV. Please try again.');
    }
}

// Add helper functions
function validateAndGetFormData() {
    const formData = {
        fullName: document.getElementById("fullName")?.value?.trim(),
        contactInfo: document.getElementById("contactInfo")?.value?.trim(),
        cvType: document.getElementById("cvType")?.value,
        summary: document.getElementById("summary")?.value?.trim(),
        skills: Array.from(document.getElementById("skills")?.selectedOptions || []).map(o => o.value),
        experience: document.getElementById("experience")?.value?.trim(),
        education: document.getElementById("education")?.value?.trim(),
        certifications: document.getElementById("certifications")?.value?.trim(),
        awards: document.getElementById("awards")?.value?.trim(),
        attributes: document.getElementById("attributes")?.value?.trim(),
        additionalInfo: document.getElementById("additionalInfo")?.value?.trim()
    };

    // Validate required fields
    if (!formData.fullName || !formData.contactInfo) {
        alert('Please fill in required fields');
        return null;
    }

    return formData;
}
// Replace your existing createPrompt function
function createPrompt(formData) {
    return `Generate a professional CV that emphasizes gender equity and women's empowerment:

STYLE REQUIREMENTS:
- Use empowering and confident language
- Highlight leadership and impact
- Focus on breaking gender barriers
- Emphasize measurable achievements
- Format in markdown with ** for headers

CONTENT STRUCTURE:
**${formData.fullName}**
${formData.contactInfo}

**Summary:**
Create an empowering summary that:
- Highlights leadership in gender equity initiatives
- Emphasizes breaking barriers in ${formData.skills.join(', ')}
- Shows impact on women's empowerment
${formData.summary}

**Skills:**
- Transform technical skills into impact statements
- Emphasize leadership and mentorship abilities
- Highlight skills that advance gender equity
${formData.skills.join(', ')}

**Experience:**
- Focus on initiatives supporting women
- Highlight mentorship of other women
- Emphasize leadership achievements
- Include quantifiable impact metrics
${formData.experience}

**Education:**
${formData.education}

${formData.certifications ? `**Certifications:**\n${formData.certifications}` : ''}
${formData.awards ? `**Awards:**\n${formData.awards}` : ''}
${formData.attributes ? `**Attributes:**\n${formData.attributes}` : ''}
${formData.additionalInfo ? `**Additional:**\n${formData.additionalInfo}` : ''}

FORMAT GUIDELINES:
- Use bullet points (*) for achievements
- Emphasize gender equity contributions
- Focus on leadership impact
- Highlight mentorship roles
- Include diversity initiatives`;
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
// Update the generate CV button handler
document.getElementById('generate-cv-button')?.addEventListener('click', () => {
    const response = localStorage.getItem('aiResponse');
    if (response) {
        window.location.href = 'cv.html';
    } else {
        alert('Please generate a CV first');
    }
});
