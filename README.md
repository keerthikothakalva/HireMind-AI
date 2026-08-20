# HireMind AI 🤖

### AI-Powered Personalized Interview Preparation Platform

HireMind AI is a **full-stack MERN + Generative AI interview preparation platform** designed to help candidates practice personalized technical interviews based on their **resume, target role, experience level, and optional job description**.

The application combines **Google Gemini, embeddings, RAG, vector retrieval, resume processing, and AI-powered evaluation** to create a personalized interview experience and provide detailed performance analytics.



## 🚀 Live Application

* **Frontend:** "https://hiremind-ai-tawny.vercel.app"
* **Backend:** "https://hiremind-ai-yqdp.onrender.com"


## ✨ Features

### 🔐 Authentication

* User registration
* User login
* Persistent user identification
* User-specific interview history
* Profile management
* Logout functionality

### 📄 Resume Processing

Candidates can upload their resumes during interview setup.

The backend processes the resume through:

* Resume parsing
* Text extraction
* Text chunking
* Embedding generation
* Vector storage
* Relevant-context retrieval

This allows interview questions to be generated using information from the candidate's actual background.


## 🧠 Generative AI + RAG

HireMind AI uses **Google Gemini** as the Generative AI engine.

The application combines Gemini with a retrieval pipeline to provide more personalized interview questions.

### RAG Pipeline


Resume Upload
      ↓
Resume Parsing
      ↓
Text Extraction
      ↓
Text Chunking
      ↓
Embedding Generation
      ↓
Vector Storage
      ↓
Relevant Information Retrieval
      ↓
Retrieved Resume Context
      ↓
Google Gemini
      ↓
Personalized Interview Questions


Instead of generating completely generic interview questions, the system can use relevant information from the candidate's resume together with the selected role and experience level.


## 🎯 Personalized Interview Setup

Candidates can configure an interview using:

* Target role
* Experience level
* Resume
* Optional job description

The generated interview is personalized around the candidate's profile and selected interview requirements.

## 🎤 AI-Powered Interview

Each interview session provides:

* 9 interview questions
* Resume-based questions
* Role-specific questions
* Experience-level-specific questions
* Typed answers
* Browser-based voice input
* Interview progress tracking
* Question-by-question interview flow

The candidate completes the interview before submitting the answers for AI evaluation.



## 🤖 AI-Powered Evaluation

After the interview is completed, the answers are processed using Generative AI.

HireMind AI generates:

* Overall score
* Communication score
* Technical knowledge score
* Problem-solving score
* Confidence score
* Performance summary
* Strengths
* Areas to improve
* Technology/skill information

The evaluation is then stored as part of the candidate's interview history.


## 📊 Dashboard

The dashboard provides a centralized view of interview performance.

### Dashboard statistics

* Total interviews
* Average score
* Best score
* Last interview date

### Interview History

Candidates can view their previous interviews with:

* Interview role
* Experience level
* Interview date
* Overall score
* Previous interview results

Selecting a previous interview opens its corresponding results.


## 👤 Profile Analytics

The profile provides aggregated performance insights across completed interviews.

It includes:

* Candidate name
* Email
* Top skills
* Overall performance
* Communication performance
* Technical knowledge
* Problem solving
* Confidence
* Role-wise performance

This allows candidates to track their development across multiple interview sessions.



## 💾 Persistent Interview History

Completed interviews are persisted in MongoDB.

Stored interview information includes:

User Email
Role
Experience
Resume Text
Questions
Answers
Overall Score
Communication
Technical Knowledge
Problem Solving
Confidence
Technology Stacks
Summary
Strengths
Areas to Improve
Created At


This enables candidates to return later and review their previous interview results.



# 🏗️ System Architecture

┌──────────────────────────────────────────────┐
│              React + Vite Frontend           │
│                                              │
│  Login • Dashboard • Interview • Results     │
│  Profile • Resume Upload • Voice Input       │
└──────────────────────┬───────────────────────┘
                       │
                       │ REST APIs
                       ▼
┌──────────────────────────────────────────────┐
│           Node.js + Express Backend          │
│                                              │
│  Authentication • Interview APIs             │
│  Resume Processing • Evaluation • History    │
└───────────────┬──────────────────────────────┘
                │
       ┌────────┼───────────────┐
       │        │               │
       ▼        ▼               ▼
┌──────────┐ ┌──────────────┐ ┌──────────────┐
│ MongoDB  │ │  Gemini AI   │ │ Resume/RAG   │
│  Atlas   │ │              │ │ Processing   │
│          │ │ Question     │ │              │
│ Users    │ │ Generation   │ │ Resume Parser│
│ Interviews││ Evaluation   │ │ Text Chunker │
│ Embeddings││              │ │ Embeddings   │
└─────┬────┘ └──────────────┘ │ Retrieval    │
      │                        │ Vector Store │
      │                        └──────┬───────┘
      │                               │
      └───────────────────────────────┘
                                      │
                                      ▼
                              Relevant Resume
                                  Context
                                      │
                                      ▼
                                  Gemini AI
                                      │
                           ┌──────────┴──────────┐
                           ▼                     ▼
                   Personalized             AI Interview
                    Questions                Evaluation
                           │                     │
                           └──────────┬──────────┘
                                      ▼
                              Interview Results
                                      │
                                      ▼
                              MongoDB Persistence
                                      │
                                      ▼
                          Dashboard + Profile
# 🧠 RAG Architecture

The resume personalization system follows this flow:


                   RESUME
                     │
                     ▼
             Resume Parsing
                     │
                     ▼
              Text Chunking
                     │
                     ▼
             Embeddings
                     │
                     ▼
              Vector Store
                     │
                     ▼
           Retrieval Service
                     │
                     ▼
        Relevant Resume Context
                     │
                     ▼
                Gemini
                     │
                     ▼
        Personalized Questions


### Backend AI Services

The project contains dedicated services for the AI and retrieval pipeline, including:


server/services/

├── embeddingService.js
├── geminiService.js
├── ragService.js
├── resumeParserService.js
├── retrievalService.js
├── textChunker.js
├── vectorStoreService.js
└── ...


This separation keeps resume processing, retrieval, embeddings, vector storage, and Gemini interactions organized into dedicated backend services.



# 🔄 Complete Application Flow

### 1. Authentication

The candidate creates an account or logs into an existing account.

### 2. Interview Setup

The candidate selects:

* Target role
* Experience level
* Resume
* Optional job description

### 3. Resume Processing

The backend extracts the resume content and processes it into usable text.

### 4. Text Chunking

The extracted resume text is divided into smaller chunks for retrieval.

### 5. Embedding Generation

Resume chunks are transformed into embedding representations.

### 6. Vector Storage

The generated information is stored for retrieval.

### 7. Relevant Context Retrieval

The application retrieves relevant resume information for the interview context.

### 8. Question Generation

Relevant resume context is provided to Gemini along with the interview requirements.

Gemini generates personalized interview questions.

### 9. Interview

The candidate answers the generated questions using:

* Text input
* Browser speech recognition

### 10. AI Evaluation

The completed questions and answers are sent to the backend.

Gemini evaluates the candidate's performance.

### 11. Database Persistence

The evaluation results and interview information are saved to MongoDB.

### 12. Results

The candidate receives a detailed performance report.

### 13. Dashboard

The completed interview appears in:

* Interview count
* Average score
* Best score
* Last interview
* Interview history

### 14. Profile

The candidate's accumulated performance is reflected in profile analytics.


# 🛠️ Technology Stack

## Frontend

* React
* Vite
* JavaScript
* React Router
* Bootstrap Icons
* CSS
* Fetch API
* Browser Speech Recognition API

## Backend

* Node.js
* Express.js
* JavaScript
* MongoDB
* Mongoose
* REST APIs
* Multer
* JWT
* dotenv
* CORS

## Generative AI

* Google Gemini
* Generative AI
* Embeddings
* RAG
* Vector retrieval
* AI-powered question generation
* AI-powered interview evaluation

## Database

* MongoDB Atlas
* MongoDB Vector Search / vector storage

## Deployment

* Vercel — Frontend
* Render — Backend
* MongoDB Atlas — Database



# 📁 Project Structure


HireMind AI/
│
├── client/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Interview.jsx
│   │   │   ├── InterviewSetup.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Results.jsx
│   │   │   └── Signup.jsx
│   │   │
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   │
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   │   ├── embeddingService.js
│   │   ├── geminiService.js
│   │   ├── ragService.js
│   │   ├── resumeParserService.js
│   │   ├── retrievalService.js
│   │   ├── textChunker.js
│   │   ├── vectorStoreService.js
│   │   └── ...
│   │
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md


# 🔌 Backend API

The backend exposes REST APIs for authentication, interview generation, evaluation, and interview history.

### Authentication

POST /api/auth/signup
POST /api/auth/login


### Interview Question Generation

POST /api/interview/questions


### Interview Evaluation

POST /api/interview/evaluate

### Interview History

GET /api/interview/history?userEmail=<email>

# 💾 Interview Data Model

A completed interview stores structured information including:


userEmail
role
experience
resumeText
questions
answers
overallScore
communication
technicalKnowledge
problemSolving
confidence
techStacks
summary
strengths
areasToImprove
createdAt

This persistent data powers the dashboard and profile analytics.


# 🚀 Run Locally

## 1. Clone the repository


git clone https://github.com/keerthikothakalva/HireMind-AI.git
cd HireMind-AI


## 2. Install backend dependencies

cd server
npm install

## 3. Configure environment variables

Create:

server/.env

Add the required MongoDB, Gemini, JWT, and server configuration.

## 4. Start the backend

npm run dev

## 5. Install frontend dependencies

Open another terminal:


cd client
npm install


## 6. Start the frontend

npm run dev

Open the Vite URL displayed in the terminal.

# 🌐 Deployment

HireMind AI uses separate deployments for the frontend and backend.

### Frontend

The React/Vite application is deployed on **Vercel**.

### Backend

The Node.js/Express API is deployed on **Render**.

### Database

**MongoDB Atlas** provides persistent application data storage and supports the project's vector-search functionality.


# 🧪 End-to-End Application Flow

Signup
   ↓
Login
   ↓
Dashboard
   ↓
Start New Interview
   ↓
Upload Resume
   ↓
Select Role + Experience
   ↓
Generate Questions
   ↓
Answer 9 Questions
   ↓
Submit Interview
   ↓
Gemini AI Evaluation
   ↓
Save Interview to MongoDB
   ↓
Results Page
   ↓
Dashboard Interview History
   ↓
Profile Performance
   ↓
Open Previous Results

# 🧩 Key Technical Challenges Solved

## Resume-Based Personalization

Built a resume-processing pipeline that extracts candidate information and prepares it for semantic retrieval before interview-question generation.

## Embedding and Retrieval Pipeline

Implemented dedicated services for embeddings, retrieval, text chunking, and vector storage to support semantic resume-based context retrieval.

## AI Question Generation

Combined:

Candidate Resume
+
Target Role
+
Experience
+
Optional Job Description
+
Retrieved Context

to generate personalized interview questions using Gemini.

## AI Interview Evaluation

Built an evaluation pipeline that processes all interview questions and candidate answers and produces structured performance metrics.

## Persistent Interview History

Connected completed interviews to MongoDB so candidates can access previous interview results across sessions.

## User-Specific Data

Interview history and profile analytics are associated with the logged-in user's information, ensuring candidates see their own interview data.

## Frontend–Backend Integration

Connected the React frontend with the Express REST API for authentication, interview generation, evaluation, history retrieval, and profile analytics.

## Deployment

Deployed the frontend and backend independently and configured communication between the production environments.


# 📊 Dashboard Analytics

The dashboard calculates:

### Interview Count

Total number of completed interviews.

### Average Score

Average overall score across completed interviews.

### Best Score

Highest overall score achieved.

### Last Interview

Date of the most recently completed interview.

### Interview History

Previous interviews with their:

* Role
* Experience
* Date
* Score
* Results

# 👤 Profile Analytics

The profile aggregates performance across completed interviews.

Overall Performance
        │
        ├── Communication
        ├── Technical Knowledge
        ├── Problem Solving
        └── Confidence

The profile also provides:

* Top skills
* Role-wise performance
* Overall performance trends across completed interviews

# 🔒 Security

The application incorporates several security practices:

* Environment variables for sensitive configuration
* `.gitignore` for secret files
* Server-side API processing
* User-specific interview history
* CORS configuration
* Backend password handling
* JWT-based authentication infrastructure

# 🎯 Why HireMind AI?

Traditional interview preparation platforms often provide the same questions to every candidate.

HireMind AI focuses on **candidate-specific interview preparation**.

### Traditional approach


Target Role
     ↓
Generic Questions

### HireMind AI approach

Candidate Resume
       +
Target Role
       +
Experience
       +
Optional Job Description
       ↓
Resume Processing
       ↓
Embeddings + Retrieval
       ↓
Relevant Candidate Context
       ↓
Google Gemini
       ↓
Personalized Interview
       ↓
AI Evaluation
       ↓
Performance Analytics

The result is a more personalized practice experience based on the candidate's actual background.

# 🚀 Future Enhancements

Potential future improvements include:

* Real-time conversational AI interviews
* Dynamic follow-up questions based on candidate answers
* Job-description matching
* Resume improvement suggestions
* Interview difficulty selection
* Company-specific interview modes
* Interview performance comparison
* Long-term performance trends
* HTTP-only cookie authentication
* Automated frontend and backend testing
* CI/CD pipeline
* AI-powered personalized study recommendations

# 👨‍💻 Author

## Keerthi Kothakalva

**Full-Stack MERN Developer | Generative AI Enthusiast**

B.Tech 

### GitHub

**keerthikothakalva**

# ⭐ Project Highlights

HireMind AI demonstrates practical experience with:

* Full-stack MERN development
* React and Vite
* Node.js and Express
* REST API development
* MongoDB and Mongoose
* MongoDB Atlas
* MongoDB Vector Search
* Google Gemini
* Generative AI
* Embeddings
* RAG architecture
* Semantic retrieval
* Resume processing
* AI-powered interview generation
* AI-powered interview evaluation
* Browser Speech Recognition
* Persistent interview analytics
* User-specific data management
* Vercel deployment
* Render deployment


# 📌 Project Summary

**HireMind AI** is a full-stack AI-powered interview preparation platform that combines **MERN development, Google Gemini, embeddings, RAG, vector retrieval, resume processing, and persistent performance analytics**.

The platform transforms a candidate's resume and interview requirements into personalized interview questions, evaluates their responses using Generative AI, stores their performance history, and provides actionable insights through dashboard and profile analytics.

> **Practice smarter. Interview better. 🚀**
