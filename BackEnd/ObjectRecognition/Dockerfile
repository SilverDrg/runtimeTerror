FROM tensorflow/tensorflow:2.5.0
RUN pip install Opencv-python==4.5.1.48 Numpy==1.19.5 Cvlib==0.2.6 Requests==2.25.1 Imutils==0.5.4 Pytesseract==0.3.7 matplotlib==3.3.4 scikit-image==0.17.2 fastapi==0.72.0 uvicorn[standard]
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--reload"]