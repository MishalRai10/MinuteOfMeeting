```
# AI Meeting Minutes (MoM) Tool for Microsoft Teams

## Overview

Microsoft Teams Meetings have become an essential part of daily operations in organizations worldwide. This AI-powered Meeting Minutes (MoM) tool automates the process of capturing, summarizing, and delivering meeting minutes to all participants via email, ensuring accuracy, efficiency, and seamless collaboration.

By streamlining meeting documentation, this tool eliminates manual note-taking, ensures consistency, and accelerates follow-ups — freeing teams to focus on execution and productivity.

---

## Features

- **User Upload**  
  Users can submit meeting files (e.g., transcripts, audio recordings) or text directly through the app.  
  _Result_: Uploaded content is sent to the backend for processing.

- **Text Extraction**  
  The Document Parser converts uploaded files into plain text.  
  _Result_: Raw text is stored temporarily for AI processing.

- **AI Summary**  
  Azure OpenAI GPT-4-o analyzes the extracted text to generate structured meeting minutes including key points, decisions, and action items.  
  _Result_: Polished meeting minutes ready for storage and sharing.

- **Secure Storage**  
  Meeting minutes are saved to a dedicated Minutes Database and linked to the user's profile.  
  _Result_: Data is accessible for future reference or edits.

- **Auto-Sharing**  
  The finalized meeting minutes are automatically sent via email using an Email Service to all participants.  
  _Result_: Participants receive timely notifications.

---

## Benefits

- Eliminates manual note-taking and reduces human error  
- Ensures consistency and completeness in meeting documentation  
- Accelerates follow-ups and improves team productivity  
- Enhances collaboration by promptly sharing actionable meeting outcomes  

---

## Technology Stack

| Technology              | Version    |
|-------------------------|------------|
| Azure OpenAI Service    | --         |
| React.js                | 18.x       |
| Flask                   | 3.1.0      |
| SQLite                  | 3.49.1     |
| GPT-4-o / Custom LLM    | --         |
| Tailwind CSS            | 4.1.3      |
| Python                  | 3.10.x     |
| JWT (JSON Web Tokens)   | --         |
| Mailtrap (Email Service)| --         |

---

## Getting Started

### Prerequisites

- Python 3.10 or higher  
- Node.js and npm  
- Azure subscription with access to Azure OpenAI Service  
- Mailtrap account (for email testing) or any SMTP email service  

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/ai-mom-tool.git
   cd ai-mom-tool
   ```
2. Backend setup (Flask API):

   ```
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   pip install -r requirements.txt
   ```
3. Frontend setup (React + Tailwind CSS):

   ```
   cd ../frontend
   npm install
   npm start
   ```
4. Configure environment variables for Azure OpenAI, Mailtrap SMTP, JWT secret keys, etc.
## Usage

1. Log in or sign up via the frontend interface.  
2. Upload meeting audio, transcript files, or paste text.  
3. The system will automatically parse, summarize, and generate meeting minutes.  
4. Minutes will be stored securely and emailed to participants automatically.  
5. Users can view, edit, and search past meeting minutes from their profile.

---

## Contributing

Contributions are welcome! Please open issues or submit pull requests with improvements, bug fixes, or new features.

---

## Contact

For any questions or support, please contact mishalkulung10@gmail.com.

---

Thank you for using the AI Meeting Minutes Tool!

```
```
