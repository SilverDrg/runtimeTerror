import cv2
import numpy as np
import argparse


# cap = cv2.VideoCapture('monitor.jpg')
# car_cascade = cv2.CascadeClassifier('haarcascade_car.xml')

# while True:
#     ret, frames = cap.read()
#     gray = cv2.cvtColor(frames, cv2.COLOR_BGR2GRAY)
#     cars = car_cascade.detectMultiScale(gray, 1.1, 9)
#     # if str(np.array(cars).shape[0]) == '1':
#     #     i += 1
#     #     continue
#     for (x,y,w,h) in cars:
#         plate = frames[y:y + h, x:x + w]
#         cv2.rectangle(frames,(x,y),(x +w, y +h) ,(51 ,51,255),2)
#         cv2.rectangle(frames, (x, y - 40), (x + w, y), (51,51,255), -2)
#         cv2.putText(frames, 'Car', (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
#         cv2.imshow('car',plate)

#     # lab1 = "Car Count: " + str(i)
#     # cv2.putText(frames, lab1, (40, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (147, 20, 255), 3)
#     frames = cv2.resize(frames,(600,400))
#     cv2.imshow('Car Detection System', frames)
#     # cv2.resizeWindow('Car Detection System', 600, 600)
#     k = cv2.waitKey(30) & 0xff
#     if k == 27:
#         break
# cv2.destroyAllWindows()


#parse the arguments
ap = argparse.ArgumentParser()
# path to image
ap.add_argument("-i", "--image", required=True, help="path to image")
args = vars(ap.parse_args())

image = cv2.imread(args["image"], 0)

car_haarcascade = cv2.CascadeClassifier('haar/haarcascade_car.xml')

detect_car = car_haarcascade.detectMultiScale(image, 1.1, 9)
dim=(850,550)
for(x,y,w,h) in detect_car:
    plate = image[y : y+h, x:x + w]
    cv2.rectangle(image, (x,y), (x+w, y+x), (51,51,255), 2)
    cv2.rectangle(image, (x, y - 40), (x + w, y), (51,51,255), -2)
    cv2.putText(image, 'Car', (x ,y - 10), cv2.FONT_HERSHEY_SIMPLEX,  0.5, (0,0,255), 2)
    resized = cv2.resize(image, dim, interpolation = cv2.INTER_AREA)
    cv2.imshow("Image", resized)

cv2.waitKey(0)
cv2.destroyAllWindows()

