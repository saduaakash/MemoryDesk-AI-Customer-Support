# MemoryDesk – AI-Powered Customer Support Agent

**MemoryDesk** is an AI-powered customer support application that uses **Hindsight Memory** and **Groq LLM** to provide personalized customer support. It remembers important details from previous conversations and uses them to deliver more relevant responses.

## 🚀 Features

- **AI-Powered Support:** Provides intelligent responses to customer queries.
- **Long-Term Memory:** Uses Hindsight to retain and recall useful customer information.
- **Personalized Conversations:** Remembers customer details, order numbers, and communication preferences.
- **Customer Isolation:** Keeps individual customer memories separate using Customer IDs.
- **Memory Insights:** Allows users to explore recalled customer information.
- **Interactive Dashboard:** Provides a modern interface for managing support conversations.
- **Real-Time Responses:** Connects to Groq LLM for AI-generated answers.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Frontend structure |
| CSS3 | UI styling |
| JavaScript | Frontend functionality |
| Node.js | Backend runtime |
| Express.js | Backend framework |
| Groq API | AI-powered responses |
| Hindsight | Persistent memory and recall |

## 🏗️ System Architecture

1. Customer enters a message through the MemoryDesk interface.
2. The frontend sends the message and Customer ID to the Express.js backend.
3. Hindsight retrieves relevant information from previous conversations.
4. Groq LLM generates a personalized response using the available context.
5. The conversation is processed for memory retention.
6. The customer can ask questions about previous interactions.

## 📂 Project Structure

```text
MemoryDesk/
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/saduaakash/MemoryDesk-AI-Customer-Support.git
```

### 2. Navigate to the project folder

```bash
cd MemoryDesk-AI-Customer-Support
```

If the project files are inside the nested `MemoryDesk` directory, run:

```bash
cd MemoryDesk
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file by copying `.env.example`.

On Windows Command Prompt:

```cmd
copy .env.example .env
```

Add your API credentials to `.env`:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-120b

HINDSIGHT_BASE_URL=your_hindsight_base_url
HINDSIGHT_API_KEY=your_hindsight_api_key
HINDSIGHT_BANK_ID=memorydesk-support
```

**Important:** Never upload your `.env` file or expose your API keys publicly.

### 5. Start the application

```bash
npm run dev
```

### 6. Open the application

Visit:

```text
http://localhost:3000
```

## 🧪 Example Test

**First conversation:**

Customer:
> My name is Rahul. My order number is 7842. My order was delayed. I prefer email updates.

**Follow-up conversation:**

Customer:
> Do you remember my previous order number and preferred communication method?

Expected result:
- Customer name: Rahul
- Order number: 7842
- Preferred communication: Email

MemoryDesk uses Hindsight to retrieve relevant information from the customer's previous interaction.

## 🔐 Privacy and Customer Isolation

MemoryDesk uses separate Customer IDs to prevent one customer's conversation memories from being used in another customer's session.

For example:
- `rahul-01` – Rahul's customer memory.
- `customer-02` – A separate customer's memory.

## 🎯 Project Objective

The main objective of MemoryDesk is to improve customer support by building an AI agent that learns from previous interactions, remembers important customer information, and provides personalized assistance.

## 🔮 Future Enhancements

- Integration with email and messaging platforms.
- Customer ticket management.
- Order tracking integration.
- Multi-language customer support.
- Advanced analytics and support dashboards.
- Improved memory management and customer privacy controls.

## 👨‍💻 Developer

**Sadu Aakash**

GitHub: [@saduaakash](https://github.com/saduaakash)

## 📄 License

This project is developed for educational and hackathon purposes.
