
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import uvicorn
import os
import xml.etree.ElementTree as ET
import re

app = FastAPI()

class SystemPromptUpdate(BaseModel):
    prompt: str

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SYSTEM_PROMPT_FILE = os.path.abspath("./backend/systemprompt.txt")

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

def clean_text(text):
    """Clean and normalize text"""
    if not text:
        return ""
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'[^\w\s.,;:!?()\-]', '', text)
    return text.strip()

def extract_text_from_xml(xml_bytes):
    """Parse XML and extract structured text content"""
    try:
        root = ET.fromstring(xml_bytes)
        
        sections = {}
        
        title = root.find('.//article-title')
        if title is not None:
            sections['Title'] = clean_text(''.join(title.itertext()))
        
        abstract = root.find('.//abstract')
        if abstract is not None:
            abstract_text = ' '.join(p.strip() for p in abstract.itertext() if p.strip())
            sections['Abstract'] = clean_text(abstract_text)
        
        authors = []
        for contrib in root.findall('.//contrib[@contrib-type="author"]'):
            given = contrib.find('.//given-names')
            surname = contrib.find('.//surname')
            if given is not None and surname is not None:
                authors.append(f"{given.text} {surname.text}")
        if authors:
            sections['Authors'] = ', '.join(authors[:5])  # Limit to first 5 authors
        
        body = root.find('.//body')
        if body is not None:
            body_sections = []
            for sec in body.findall('.//sec'):
                title_elem = sec.find('.//title')
                sec_title = clean_text(''.join(title_elem.itertext())) if title_elem is not None else "Section"
                
                paragraphs = []
                for p in sec.findall('.//p'):
                    p_text = ''.join(p.itertext()).strip()
                    if p_text:
                        paragraphs.append(clean_text(p_text))
                
                if paragraphs:
                    body_sections.append(f"{sec_title}: {' '.join(paragraphs[:3])}")  # Limit paragraphs per section
            
            if body_sections:
                sections['Body'] = '\n\n'.join(body_sections[:5])  # Limit to 5 sections
        
        conclusions = root.findall('.//sec[@sec-type="conclusions"]')
        if conclusions:
            conclusion_texts = []
            for conclusion in conclusions:
                for p in conclusion.findall('.//p'):
                    p_text = ''.join(p.itertext()).strip()
                    if p_text:
                        conclusion_texts.append(clean_text(p_text))
            if conclusion_texts:
                sections['Conclusions'] = ' '.join(conclusion_texts)
        
        formatted_text = ""
        for section_name, content in sections.items():
            formatted_text += f"\n## {section_name}\n{content}\n"
        
        return formatted_text.strip()
    
    except ET.ParseError as e:
        return f"XML parsing error: {str(e)}"
    except Exception as e:
        return f"Error extracting text: {str(e)}"

@app.post("/api/summarize")
async def summarize_xml(file: UploadFile = File(...)):
    xml_content = await file.read()

    if not os.path.exists(SYSTEM_PROMPT_FILE):
        return {"error": f"System prompt file '{SYSTEM_PROMPT_FILE}' not found."}

    with open(SYSTEM_PROMPT_FILE, "r") as f:
        system_prompt = f.read().strip()

    extracted_text = extract_text_from_xml(xml_content)
    
    full_prompt = f"{system_prompt}\n\nSummarize this research paper:\n\n{extracted_text}"

    try:
        result = subprocess.run(
            ["ollama", "run", "--think=false", "qwen3:4b-instruct-2507-q8_0"],
            input=full_prompt.encode("utf-8"),
            capture_output=True,
            check=True
        )
        summary = result.stdout.decode("utf-8")
        return {"summary": summary}
    except subprocess.CalledProcessError as e:
        return {"error": e.stderr.decode("utf-8")}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3414)
