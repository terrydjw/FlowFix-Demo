import os
from dotenv import load_dotenv

# LangChain components
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS

print("Starting vector store creation process...")

# --- PROXY CONFIGURATION FOR PYTHONANYWHERE ---
# Required to make the API call from a PythonAnywhere console
proxy_url = 'http://proxy.server:3128'
os.environ['HTTP_PROXY'] = proxy_url
os.environ['HTTPS_PROXY'] = proxy_url

# --- Load API Key ---
load_dotenv()
if not os.getenv("GOOGLE_API_KEY"):
    raise ValueError("GOOGLE_API_KEY not found in .env file")

# --- Define Paths ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
KNOWLEDGE_BASE_PATH = os.path.join(BASE_DIR, 'knowledge_base.md')
FAISS_INDEX_PATH = os.path.join(BASE_DIR, "faiss_index")

try:
    # 1. Initialize the embeddings model
    print("Initializing Google Generative AI Embeddings...")
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    
    # 2. Load the knowledge base document
    print(f"Loading knowledge base from: {KNOWLEDGE_BASE_PATH}")
    loader = TextLoader(KNOWLEDGE_BASE_PATH)
    documents = loader.load()
    
    # 3. Split the document into chunks
    print("Splitting documents into chunks...")
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    docs = text_splitter.split_documents(documents)
    print(f"Created {len(docs)} document chunks.")
    
    # 4. Create embeddings and the FAISS vector store
    print("Creating FAISS vector store from documents (this may take a moment)...")
    vector_store = FAISS.from_documents(docs, embeddings)
    
    # 5. Save the vector store locally
    print(f"Saving FAISS index to: {FAISS_INDEX_PATH}")
    vector_store.save_local(FAISS_INDEX_PATH)
    
    print("\nSUCCESS: The FAISS vector store has been created and saved successfully.")
    
except Exception as e:
    print(f"\nERROR: An error occurred during the process: {e}")