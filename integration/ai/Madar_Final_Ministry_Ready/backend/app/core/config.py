from pydantic_settings import BaseSettings,SettingsConfigDict
class Settings(BaseSettings):
 app_env:str="development";frontend_origin:str="http://localhost:3000";database_url:str="";openai_api_key:str="";openai_chat_model:str="gpt-5-mini";openai_embedding_model:str="text-embedding-3-small";official_ifta_url:str="https://alifta.gov.sa/";use_vector_rag:bool=False
 model_config=SettingsConfigDict(env_file=".env",extra="ignore")
settings=Settings()
