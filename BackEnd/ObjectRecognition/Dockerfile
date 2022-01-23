FROM tensorflow/tensorflow:2.5.0
RUN pip install opencv-python opencv-python-headless Numpy Cvlib Requests Imutils Pytesseract matplotlib scikit-image fastapi uvicorn==0.16.0
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--reload"]