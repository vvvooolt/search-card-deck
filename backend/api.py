
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import uvicorn
import os

app = FastAPI()

class SystemPromptUpdate(BaseModel):
    prompt: str

# ✅ Allow CORS from localhost (React dev server)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://ai.termnh.com/", "https://ai.termnh.com/", "http://localhost:8080/", "http://localhost:5173/"],  # Added Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path to your system prompt file (absolute path)
SYSTEM_PROMPT_FILE = os.path.abspath("/home/volt/Desktop/nasa/testing/keeko/backend/systemprompt.txt")

@app.get("/api/system-prompt")
async def get_system_prompt():
    if not os.path.exists(SYSTEM_PROMPT_FILE):
        return {"error": f"System prompt file '{SYSTEM_PROMPT_FILE}' not found."}
    
    with open(SYSTEM_PROMPT_FILE, "r") as f:
        prompt = f.read()
    
    return {"prompt": prompt}

@app.post("/api/system-prompt")
async def update_system_prompt(data: SystemPromptUpdate):
    try:
        with open(SYSTEM_PROMPT_FILE, "w") as f:
            f.write(data.prompt)
        return {"success": True, "message": "System prompt updated successfully"}
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/summarize")
async def summarize_xml(file: UploadFile = File(...)):
    xml_content = await file.read()
    xml_text = xml_content

    if not os.path.exists(SYSTEM_PROMPT_FILE):
        return {"error": f"System prompt file '{SYSTEM_PROMPT_FILE}' not found."}

    with open(SYSTEM_PROMPT_FILE, "r") as f:
        system_prompt = f.read().strip()

    full_prompt = f"{system_prompt}\n\nSummarize this XML:\n{xml_text}"

    try:
        result = subprocess.run(
            ["ollama", "run", "--think=false", "qwen3:0.6b"],
            input=full_prompt.encode("latin-1"),
            capture_output=True,
            check=True
        )
        summary = result.stdout.decode("latin-1")
        return {"summary": summary}
    except subprocess.CalledProcessError as e:
        return {"error": e.stderr.decode("latin-1")}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3414)
