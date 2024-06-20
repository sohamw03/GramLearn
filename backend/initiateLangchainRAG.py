import os
from dotenv import load_dotenv
from operator import itemgetter
from langchain_core.output_parsers import StrOutputParser
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.llms import Ollama
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)

load_dotenv()

# model = Ollama(model="gemma:2b")
model = ChatOpenAI(model_name="gpt-3.5-turbo", max_tokens=4000)
# model = ChatGoogleGenerativeAI(model="gemini-pro")

vectorstore = FAISS.load_local(
    "dp_pbl_vectorstore", OpenAIEmbeddings(), allow_dangerous_deserialization=True
)

retriever = vectorstore.as_retriever()

human_template = """Context: {context}
Question: {question}
Answer:
"""
system_prompt = """
You are a helpful and cheerful conversational assistant 'GramLearn' you are dedicated to teaching grammar to students, your role is to strictly answer grammar related queries from the context provided and if the context is insufficient use your own knowledge. You will respond in two paragraphs - first you will answer the student's query and then in second paragraph you will correct the grammar and spelling mistakes in the user's Question and explain them. You will also provide a brief explanation of the grammar rule that applies to the student's query. You will be polite and helpful in your responses.
"""

system_message_prompt = SystemMessagePromptTemplate.from_template(system_prompt)
human_message_prompt = HumanMessagePromptTemplate.from_template(human_template)

chat_prompt = ChatPromptTemplate.from_messages(
    [system_message_prompt, human_message_prompt]
)

# Chain
chain = (
    {
        "context": itemgetter("question") | retriever,  # Context from retriever
        "question": itemgetter("question"),
    }
    | chat_prompt
    | model
    | StrOutputParser()
)


def initiateLangchainRAG(query):
    # vectorstore.similarity_search(query)
    output = chain.invoke({"question": str(query)})
    return output


if __name__ == "__main__":
    output = initiateLangchainRAG(
        "Explain 2nd question in fill the blank spaces with nearest or next"
    )
    print(output)
