from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from langchain.schema.document import Document
from langchain_core.vectorstores import VectorStoreRetriever
from langchain.vectorstores import Qdrant
from qdrant_client import QdrantClient
from langchain.prompts import PromptTemplate
from langchain.embeddings import HuggingFaceInferenceAPIEmbeddings
from langchain.chains import RetrievalQA
from langchain.llms import VLLM
from typing import List

GENERATE_MODEL_NAME="Viet-Mistral/Vistral-7B-Chat"
EMBEDDINGS_MODEL_NAME="minhquan6203/paraphrase-vietnamese-law"
QDRANT_COLLECTION_NAME = "luatvn"
HUGGINGFACE_API_KEY = ""
QDRANT_API_KEY = ""
QDRANT_URL = ""
HUGGINGFACE_API_KEY= ""

class DocRetriever(VectorStoreRetriever):
    vectorstore: VectorStoreRetriever
    def get_relevant_documents(self, query: str) -> List[Document]:
        docs = self.vectorstore.get_relevant_documents(query=query)
        return docs
    
class LLMServe:
    def __init__(self) -> None:
        self.embeddings = self.load_embeddings()
        self.retriever = self.load_retriever(embeddings=self.embeddings)
        self.pipe = self.load_model_pipeline(max_new_tokens=300)
        self.prompt = self.load_prompt_template()
        self.rag_pipeline = self.load_rag_pipeline(llm=self.pipe,
                                                   retriever=self.retriever,
                                                   prompt=self.prompt)
    def load_embeddings(self):
        embeddings = HuggingFaceInferenceAPIEmbeddings(
            model_name=EMBEDDINGS_MODEL_NAME,
            api_key=HUGGINGFACE_API_KEY,
            model_kwargs={'device': "auto"}
        )
        return embeddings

    def load_retriever(self, embeddings):
        client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY, prefer_grpc=False)
        db = Qdrant(client=client, embeddings=embeddings, collection_name=QDRANT_COLLECTION_NAME)
        retriever = DocRetriever(vectorstore=db.as_retriever(search_kwargs={"k": 2}))
        return retriever

    def load_model_pipeline(self, max_new_tokens=100):
        llm = VLLM(
            model=GENERATE_MODEL_NAME,
            trust_remote_code=True,  # mandatory for hf models
            max_new_tokens=max_new_tokens,
            top_k=10,
            top_p=0.95,
            temperature=0.4,
            dtype="half",
        )
        return llm

    def load_prompt_template(self):
        query_template = "Bạn là một chatbot thông minh trả lời câu hỏi dựa trên ngữ cảnh (context).\nContext:{context} \nHuman: {question}\nAssistant:"
        prompt = PromptTemplate(template=query_template, input_variables=["context", "question"])
        return prompt

    def load_rag_pipeline(self, llm, retriever, prompt):
        rag_pipeline = RetrievalQA.from_chain_type(
            llm=llm, chain_type='stuff',
            retriever=retriever,
            chain_type_kwargs={
                "prompt": prompt
            },
            return_source_documents=True)
        return rag_pipeline

    def rag(self):
        return self.rag_pipeline


# Initialize Flask app
app = Flask(__name__, static_url_path='', static_folder='static')
CORS(app, resources={r"/*": {"origins": "*"}})

# Initialize LLMServe
llm_serve = LLMServe()

@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message")
    if not user_input:
        return jsonify({"error": "No message provided"}), 400

    try:
        response = llm_serve.rag()(user_input)
        response_text = response["result"]
        retriever_info = llm_serve.retriever.get_relevant_documents(user_input)
        retriever_texts = [doc.page_content for doc in retriever_info]
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify({"response": response_text, "retriever": retriever_texts})

@app.route("/")
def index():
    return send_from_directory('static', 'index.html')


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)