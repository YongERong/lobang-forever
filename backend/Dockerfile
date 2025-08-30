FROM python:3.13-slim
WORKDIR /app

COPY src/ .
COPY requirements.txt ./requirements.txt
COPY models/ ./models/

RUN pip install --no-cache-dir -r requirements.txt

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]