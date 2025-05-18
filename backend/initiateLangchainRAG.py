from operator import itemgetter

from dotenv import load_dotenv

# from langchain_openai import OpenAIEmbeddings, ChatOpenAI
# from langchain_community.llms import Ollama
from langchain_community.vectorstores import FAISS
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
    MessagesPlaceholder,  # Added import
)
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_core.messages import HumanMessage, AIMessage  # Added import


load_dotenv()

# model = Ollama(model="gemma:2b")
# model = ChatOpenAI(model_name="gpt-4o", max_tokens=4000)
model = ChatGoogleGenerativeAI(model="gemini-2.0-flash-exp")
# embedding = OpenAIEmbeddings()
embedding = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")

vectorstore = FAISS.load_local(
    "dp_pbl_vectorstore", embedding, allow_dangerous_deserialization=True
)

retriever = vectorstore.as_retriever()

human_template = """{question}"""
context_template = """Context: {context}"""
system_prompt = """
You are 'GramLearn', a helpful and cheerful conversational assistant dedicated to teaching grammar.
Your goal is to assist students with their grammar questions, drawing from the conversation history and provided context.

Instructions for responding:
1.  **Understand the Conversation:** Refer to the conversation history to understand the flow of discussion and maintain context from previous turns.
2.  **Answer the Query:** Address the student's current grammar-related question.
    *   Use the "Context" (retrieved based on their latest question) if it's relevant and helpful.
    *   If the retrieved "Context" is insufficient or the question is more general, use your broader knowledge of grammar.
3.  **Response Structure (Two Paragraphs):**
    *   **Paragraph 1:** Provide a clear answer to the student's current query.
    *   **Paragraph 2:** Review the student's *latest* question for any grammar or spelling mistakes. If you find any, politely point them out and explain the corrections.
4.  **Grammar Rule Explanation:** Briefly explain the main grammar rule that applies to the student's current query.
5.  **Tone:** Maintain a polite, helpful, and encouraging tone throughout the conversation.
"""

system_message_prompt = SystemMessagePromptTemplate.from_template(system_prompt)
human_message_prompt = HumanMessagePromptTemplate.from_template(human_template)
context_message_prompt = HumanMessagePromptTemplate.from_template(context_template)

chat_prompt = ChatPromptTemplate.from_messages(
    [
        system_message_prompt,
        MessagesPlaceholder(variable_name="history"),
        human_message_prompt,
        context_message_prompt,
    ]
)


def debug_print(x):
    print("Input to model:", x)
    return x


# Chain
chain = (
    {
        "context": itemgetter("question") | retriever,
        "question": itemgetter("question"),
        "history": itemgetter("history"),
    }
    | chat_prompt
    # | debug_print
    | model
    | StrOutputParser()
)


def initiateLangchainRAG(query, history=[]):
    # vectorstore.similarity_search(query)

    # Convert input history to Langchain Message objects
    chat_history_messages = []
    for c in history:
        if c["sender"] == "User":
            chat_history_messages.append(HumanMessage(content=c["text"]))
        else:  # Assuming the other sender is the AI/model
            chat_history_messages.append(AIMessage(content=c["text"]))

    def generate():
        stream = chain.stream(
            {
                "question": str(query),
                "history": chat_history_messages,  # Pass the converted history
            }
        )
        for chunk in stream:
            if chunk is not None:
                yield (chunk)

    return generate()


if __name__ == "__main__":
    output = initiateLangchainRAG(
        "Explain 2nd question in fill the blank spaces with nearest or next"
    )
    print(output)
