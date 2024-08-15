# Gemini Chatbot Application Setup Guide

This guide will walk you through setting up the Gemini Chatbot application using Visual Studio Code
and Google AI Studio. It is designed to be clear and concise, ensuring that even beginners can
successfully set up and run the application.


Chapter 1: Prerequisites
Before you start, ensure you have the following prerequisites installed on your system:
1. Node.js and npm (Node Package Manager) LINK TO DOWNLOAD THE NODE PACKAGE MANAGER : https://nodejs.org/en/download/prebuilt-installer/current
2. Visual Studio Code (VS Code) LINK TO DOWNLOAD VSCODE : https://code.visualstudio.com/download
3. Git (for cloning the repository) LINK TO INSTALL GIT SO YOU CAN CLONE THE REPOSITORY : https://git-scm.com/download/win
4. A Google account to access Google AI Studio ( Remember to get the google free credits by following steps in this website https://console.cloud.google.com/)

   
Chapter 2: Cloning the Repository
To get started, clone the repository from GitHub using the following command:
`git clone https://github.com/NdumisoButhelezi/gemini_chatbot_javascript.git`
After cloning, navigate into the project directory:
`cd gemini_chatbot_javascript`


Chapter 3: Setting Up Google AI Studio
1. Sign in to your Google account and navigate to Google AI Studio.
   ![image](https://github.com/user-attachments/assets/bb6d40b7-5def-47e0-b503-728e408adde4)

2. Create a new project in Google Cloud Console.
![image](https://github.com/user-attachments/assets/acd0e93e-abc5-41db-a5a2-0ca78d4246c2)

3. Enable the Google Generative AI API for your project.

![image](https://github.com/user-attachments/assets/60fc0444-739f-4519-8b3c-efb5b7344784)

4. Generate an API key and copy it.

![image](https://github.com/user-attachments/assets/307c2dbe-5ddb-44e7-b5ed-9ecec8380cbe)




5. Google offers free credits to new users, which you can use for this project. Make sure to sign up
for the free tier when setting up your billing account. use this link to access the google AI Studio https://ai.google.dev/aistudio

Chapter 4: Creating the .env File
Create a `.env` file in the root directory of your project and add the following line, replacing
`YOUR_API_KEY` with the API key you copied:
`VITE_API_KEY=YOUR_API_KEY`

![image](https://github.com/user-attachments/assets/c61ecf4a-9c64-4976-8de8-d51c8d489fc4)




Chapter 5: Installing Dependencies
Install the necessary dependencies by running:
`npm install`

![image](https://github.com/user-attachments/assets/4fa4615f-fcf5-4a2a-81ea-90884b14b7a8)

This command installs all the required packages listed in the `package.json` file.
![image](https://github.com/user-attachments/assets/276fa7f2-3fa3-44f2-889f-37ff3147bced)


Chapter 6: Running the Application
To start the application in development mode, use the following command:
`npm run dev`
![image](https://github.com/user-attachments/assets/3ae8fb58-5af0-402c-9315-244f2e109052)

This will start a local server, and you can view the application by navigating to `http://localhost:3000`
in your web browser.
![image](https://github.com/user-attachments/assets/12f4216e-9552-4d6b-b927-d227286d93c6)


Chapter 7: Understanding the Application Structure
1. `index.html`: The main HTML file.
2. `main.js`: The JavaScript file that initializes the chatbot and handles communication with the
Google Generative AI.
3. `style.css`: Contains the styling for the chatbot interface.
4. `package.json`: Lists the project's dependencies and scripts.
5. `vite.config.js`: Configuration file for Vite.


Chapter 8: Modifying the Chatbot Responses
You can modify how the chatbot responds by editing the `main.js` file. For example, you can change
the model being used or adjust the prompt templates.
![image](https://github.com/user-attachments/assets/3cbf9d88-276e-4ee0-86f9-699436619d0b)

Conclusion

By following these steps, you should be able to set up and run the Gemini Chatbot application. Feel
free to explore the code and customize the chatbot to suit your needs. Happy coding!



Link to the YouTube video: [Build and deploy your own ChatBot with Gemini (Complete Tutorial)🚀](https://youtu.be/1AJbhLBBPHU)
