from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import message_routes

# Create FastAPI app
app = FastAPI(title="AutoCareers Messaging API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development only. Configure properly in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include message routes
app.include_router(message_routes.router, prefix="/api", tags=["messages"])

@app.get("/")
async def root():
    return {"message": "Welcome to the AutoCareers Messaging API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 