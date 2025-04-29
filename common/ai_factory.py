# common/ai_factory.py
from llama_index import ServiceContext, SimpleDirectoryReader, GPTVectorStoreIndex
from llama_index.llms import TogetherLLM
# If using Pinecone, import pinecone or the Pinecone index from llama_index
# from llama_index.vector_stores import PineconeVectorStore

class AIContext:
    """
    Holds references to the LLM, index, embeddings, etc.
    """
    def __init__(self, together_api_key: str = ""):
        # For example, set up a Together LLM:
        self.llm = TogetherLLM(api_key=together_api_key)
        # If you have other providers, you can configure them conditionally

        # Build a service context so we can pass it to LlamaIndex
        self.service_context = ServiceContext.from_defaults(llm=self.llm)

    def build_index_from_directory(self, directory_path: str):
        """
        Example method to create an index from local text files or data.
        In your real code, you might read from PDF or database docs.
        """
        documents = SimpleDirectoryReader(directory_path).load_data()
        index = GPTVectorStoreIndex.from_documents(
            documents, service_context=self.service_context
        )
        return index

    def store_index(self, index):
        """
        Example for storing an index or hooking into a vector store.
        If you’re using Pinecone, you’d do something like:
            pinecone.init(api_key="...", environment="...")
            # store index in pinecone, or use index.set_vector_store(...)
        """
        pass

def get_ai_context(together_api_key: str = "") -> AIContext:
    """
    Returns a reusable AIContext object that can generate embeddings,
    build indexes, etc.
    """
    return AIContext(together_api_key=together_api_key)
