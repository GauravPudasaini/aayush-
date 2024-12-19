from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch

app = FastAPI()

# Allow all origins for development purposes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and tokenizer
device = "cuda" if torch.cuda.is_available() else "cpu"
tokenizer = AutoTokenizer.from_pretrained("facebook/nllb-200-distilled-600M")
model = AutoModelForSeq2SeqLM.from_pretrained("facebook/nllb-200-distilled-600M").to(device)

# Define the request body using Pydantic
class TranslationRequest(BaseModel):
    text: str
    src_lang: str = "eng_Latn"  # Default to English in Latin script
    tgt_lang: str = "zh_CN"     # Default to Simplified Chinese
    a: int = 32
    b: int = 3
    max_input_length: int = 1024
    num_beams: int = 4

# Translation function
def translate(text, src_lang, tgt_lang, a, b, max_input_length, num_beams, **kwargs):
    # Set the tokenizer languages properly
    tokenizer.src_lang = src_lang
    tokenizer.tgt_lang = tgt_lang

    # Tokenize the input text, adding padding and truncating based on max_input_length
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=max_input_length)
    inputs = {k: v.to(device) for k, v in inputs.items()}

    # Ensure inputs contain 'input_ids'
    input_ids = inputs["input_ids"]

    # Generate translation with the model
    model.eval()
    result = model.generate(
        input_ids=input_ids,
        max_new_tokens=int(a + b * input_ids.shape[1]),
        num_beams=num_beams,
        early_stopping=True,  # Add early stopping to avoid infinite generation
        **kwargs
    )

    # Decode the result and handle the output properly
    translated_text = tokenizer.batch_decode(result, skip_special_tokens=True)

    return translated_text


@app.post("/translate/")
def translate_text(request: TranslationRequest):
    result = translate(
        request.text, 
        request.src_lang, 
        request.tgt_lang, 
        request.a, 
        request.b, 
        request.max_input_length, 
        request.num_beams
    )
    return {"translated_text": result}
