# [GramLearn](https://dp-nlp.vercel.app) Installation Guide

Welcome to the installation guide for **GramLearn** the **Conversational Grammar and English Learning Chatbot**. This guide will walk you through the steps required to set up the chatbot on your local machine for development and testing purposes.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Python 3.x installed on your system.
- `pip` package manager installed.
- Node.js and npm installed for the frontend setup.
- A compatible operating system (Windows/Linux/macOS).

## Installation Steps

Follow these steps to install and set up the project:

### 1. Clone the Repository

Clone the project repository to your local machine using Git:

```bash
git clone https://github.com/sohamw03/DP_NLP.git
```

### 2. Backend Setup

Navigate to the backend directory and set up the Flask server:

```bash
cd backend
```

Create a virtual environment (optional but recommended):

```bash
python3 -m venv venv
```

Activate the virtual environment:

- **Windows**:
  ```bash
  venv\Scripts\activate
  ```
- **Linux/macOS**:
  ```bash
  source venv/bin/activate
  ```

Install the required Python dependencies:

```bash
pip install -r requirements.txt
```

### 3. Frontend Setup

Navigate to the frontend directory:

```bash
cd ..
```

Install Node.js dependencies:

```bash
yarn install
```

### 4. Configure Environment Variables

Create a `.env` file in the `backend` directory and set the following environment variables:

```plaintext
FLASK_APP=app.py
FLASK_ENV=development
```

### 5. Start the Servers

Start the Flask server:

```bash
flask run
```

Start the Next.js frontend:

```bash
yarn dev
```

### 6. Install and Start Ollama

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

1. Download the gemma:2b model.
```bash
ollama pull gemma:2b
```

Run Ollama

```bash
ollama run path/to/gemma_2b.pt
```

Interact with Model

Use Ollama commands (see docs: [https://github.com/ollama/ollama](https://github.com/ollama/ollama)) for querying and interacting with the model.


### 6. Access the Chatbot

Open your web browser and navigate to `http://localhost:3000` to access the chatbot interface.
