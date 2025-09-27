import os
import json
import datetime
from dotenv import load_dotenv

from flask import Flask, request, jsonify
from flask_cors import CORS

# LangChain components for building an Agent
from langchain_core.prompts import ChatPromptTemplate
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.tools import tool
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.messages import AIMessage

# Our existing components
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain

import calendar_utils

# --- INITIALIZATION ---
load_dotenv()
app = Flask(__name__)
CORS(app)

with open('config.json', 'r') as f:
    config = json.load(f)

# Use a more advanced model that's better at function calling
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.6)
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

# --- KNOWLEDGE BASE (RAG) TOOL ---
# We are now turning our knowledge base into a formal "tool"
try:
    loader = TextLoader("knowledge_base.md")
    documents = loader.load()
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    docs = text_splitter.split_documents(documents)
    vector_store = FAISS.from_documents(docs, embeddings)
    retriever = vector_store.as_retriever(search_kwargs={"k": 3})
    
    rag_prompt = ChatPromptTemplate.from_template("""Answer the user's question based only on the following context. If the context doesn't contain the answer, say you don't have that information.

Context:
{context}

Question: {input}""")
    
    question_answer_chain = create_stuff_documents_chain(llm, rag_prompt)
    rag_chain = create_retrieval_chain(retriever, question_answer_chain)
    print("Knowledge base loaded successfully.")
except Exception as e:
    print(f"Error loading knowledge base: {e}")
    rag_chain = None

# --- AGENT TOOLS DEFINITION ---
# Here we define the functions the AI agent can use.
# The '@tool' decorator and the docstring are crucial.
# The AI reads the docstring to understand what the tool does.

@tool
def get_general_information(query: str) -> str:
    """
    Use this tool to answer general questions about FlowFix Plumbers, such as their services, service area, business hours, or qualifications.
    """
    if not rag_chain:
        return "The knowledge base is not available."
    try:
        response = rag_chain.invoke({"input": query})
        return response['answer']
    except Exception as e:
        return f"Error querying knowledge base: {e}"

@tool
def check_emergency_availability(postcode: str) -> str:
    """
    Checks if a plumber is available for an immediate emergency call-out in a specific postcode. Use this for urgent requests like "burst pipe", "major leak", or "no heating".
    """
    if not any(p in postcode.upper() for p in config["service_area_postcodes"]):
        return f"I'm sorry, you appear to be outside our primary service area of {', '.join(config['service_area_postcodes'])}. We are unable to attend this emergency."

    is_blocked = calendar_utils.check_for_emergency_blocks(hours_to_check=2)
    if is_blocked:
        return "I'm very sorry, but the plumber is currently on another emergency job and is not immediately available. Please try another service."
    else:
        return f"The plumber appears to be available for an emergency call-out. The fee is {config['emergency_info']['fee']}, which includes the first hour of labour. **Please call {config['business_phone_number']} immediately** to confirm and provide your full address. This line is for emergencies only."

@tool
def find_available_appointment_slots(date: str) -> str:
    """
    Finds available appointment slots on a specific date for non-emergency jobs. The date must be in 'YYYY-MM-DD' format.
    """
    try:
        slots = calendar_utils.find_available_slots(date)
        if not slots:
            return f"Sorry, there are no available slots on {date}. Please try another day."
        
        formatted_slots = [datetime.datetime.fromisoformat(s).strftime('%I:%M %p') for s in slots]
        return f"Available slots on {date}: {', '.join(formatted_slots)}"
    except Exception as e:
        return f"There was an error finding slots: {e}"
    

@tool
def book_appointment(date: str, time: str, service_needed: str, customer_name: str, customer_phone: str) -> str:
    """
    Books a non-emergency plumbing appointment in the calendar. You MUST have the exact date (in 'YYYY-MM-DD' format), time (in 'HH:MM AM/PM' or 'HH:MM' 24-hour format), a description of the service needed, the customer's full name, and their phone number before using this tool. If you are missing any of this information, you must ask the user for it.
    """
    try:
        # Attempt to parse time in AM/PM format
        start_datetime_obj = datetime.datetime.strptime(f"{date} {time}", "%Y-%m-%d %I:%M %p")
    except ValueError:
        # If that fails, try 24-hour format
        try:
            start_datetime_obj = datetime.datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M")
        except ValueError:
            return "Invalid date or time format. Please confirm the time with the user and provide it in 'HH:MM AM/PM' or 'HH:MM' (24-hour) format."

    # Assume a 1-hour appointment duration
    end_datetime_obj = start_datetime_obj + datetime.timedelta(hours=1)
    
    start_time_iso = start_datetime_obj.isoformat()
    end_time_iso = end_datetime_obj.isoformat()

    summary = f"Plumbing: {service_needed} for {customer_name}"
    description = f"Service: {service_needed} for {customer_name} ({customer_phone})."

    # Call the function from calendar_utils to create the event
    result = calendar_utils.create_appointment(
        summary=summary,
        description=description,
        start_time_str=start_time_iso,
        end_time_str=end_time_iso,
        customer_name=customer_name,
        customer_phone=customer_phone
    )
    return result

# Combine all our tools into a list
tools = [
    get_general_information,
    check_emergency_availability,
    find_available_appointment_slots,
    book_appointment
]

# --- AGENT SETUP ---
# This is the "brain" of our new agent.
agent_prompt = ChatPromptTemplate.from_messages([
    # This is the new, more forceful prompt
    ("system", """
    Your Persona: You are Vern, a helpful and friendly AI assistant for FlowFix Plumbers.
    
    Your Goal: Help users get information, check availability, and book appointments. Be conversational and clear.
    
     Interaction Rules:
    1.  **One Question at a Time:** When you need information from a user (like their name, phone number, or a date), you MUST ask for only ONE piece of information at a time. Do not ask multiple questions in a single message. However approaching each question with conversational aspects in encouraged.
    2.  **Confirm Before Action:** Before you use the `book_appointment` tool, you MUST first state what service you believe the user wants. Then, you MUST summarize all the other details (date, time, name, phone number) and ask the user for a final confirmation, like "Does all of that look correct?". Only proceed with the booking after the user confirms.
    3.  **No Repeat Introductions:** You MUST introduce yourself in your very first message. In all subsequent messages, you MUST NOT introduce yourself or mention that you are an AI. Get straight to the point.
    4. **All Natural Language Responses:** All responses you give to the user must be in natural language format, ie no asterics (*) to be inclued in your answers.
    """),
    ("placeholder", "{chat_history}"),
    ("human", "{input}"),
    ("placeholder", "{agent_scratchpad}"),
])

# Create the agent itself
agent = create_tool_calling_agent(llm, tools, agent_prompt)

# This creates the executor that runs the agent, tools, and manages the process
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

# This is our conversational memory. We'll store one conversation for the demo.
# For a real app, you would have a dictionary of histories keyed by a user/session ID.
demo_chat_history = ChatMessageHistory()

initial_message = "Hi! I am Vern, the FlowFix AI assistant. How can I help with your plumbing today?"
demo_chat_history.add_message(AIMessage(content=initial_message))

# This wraps our agent executor and connects it to the chat history
conversational_agent = RunnableWithMessageHistory(
    agent_executor,
    lambda session_id: demo_chat_history, # Function to get the history
    input_messages_key="input",
    history_messages_key="chat_history",
)

# --- FLASK API ENDPOINT ---
@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message")
    
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    # Invoke the conversational agent. The session_id is a placeholder for this demo.
    response = conversational_agent.invoke(
        {"input": user_message},
        config={"configurable": {"session_id": "demo_session"}}
    )
    
    ai_response = response['output']
    return jsonify({"response": ai_response})


if __name__ == "__main__":
    app.run(port=5000, debug=True)