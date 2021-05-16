import cv2
from matplotlib import pyplot as plt
import numpy as np
import imutils
import pytesseract as tess
tess.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'


#reading haar cascade xml file
lic_data = cv2.CascadeClassifier('haarcascade_plate_number.xml')

def detect_cars(frame):
    cars = lic_data.detectMultiScale(frame, 1.15, 4)
    for (x, y, w, h) in cars:
        cv2.rectangle(frame, (x, y), (x+w,y+h), color=(0, 255, 0), thickness=2)
    return frame

def Simulator():
#    #CarVideo = cv2.VideoCapture(url)
#    #while CarVideo.isOpened():
#    #ret, frame = CarVideo.read()
    frame = cv2.imread('traffic_cars.jpg')  
    controlkey = cv2.waitKey(1)
#    #if ret:        
    cars_frame = detect_cars(frame)
    cv2.imshow('frame', cars_frame)
#    #else:
#    #    break
#    #if controlkey == ord('q'):
#    #    break
def detect_number(img):
    temp = img
    gray = cv2.cvtColor(temp, cv2.COLOR_BGR2GRAY)
    number = lic_data.detectMultiScale(img,1.2)
    print("number plate detected:"+str(len(number)))
    for numbers in number:
        (x,y,w,h) = numbers
        roi_gray = gray[y:y+h, x:x+w]
        roi_color = img[y:y+h, x:x+h]
        cv2.rectangle(temp, (x,y), (x+w,y+h), (0,255,0), 3)
        
    cv2.imshow("Detected license plate", temp)

def erode_image(img):
    kernel = np.ones((5,5),np.uint8)
    erosion = cv2.erode(img,kernel,iterations = 1)

    return erosion

Simulator()

img = cv2.imread("lambo_lp.png") #read image 

detect_number(img) #detect license plate number

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) #convert image to grayscale


eroded = erode_image(img) #apply morphological operation erosion on the image
#cv2.imshow("Eroded image", eroded)


image = img
ratio = image.shape[0] / 500.0
orig = image.copy()
image = imutils.resize(image, height = 500)
 
# convert the image to grayscale, blur it, and find edges
# in the image
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
gray = cv2.GaussianBlur(gray, (5, 5), 0)
edged = cv2.Canny(gray, 75, 200)
 
# show the original image and the edge detected image
print("STEP 1: Edge Detection")
#cv2.imshow("Original", image)
#cv2.imshow("Edged image", edged)


img = cv2.resize(img, (620,480) )
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) #convert to grey scale

gray = cv2.bilateralFilter(gray, 13, 15, 15)

edged = cv2.Canny(gray, 30, 200) #Perform Edge detection
#cv2.imshow("Edged2", edged)

contours=cv2.findContours(edged.copy(),cv2.RETR_TREE,
                                            cv2.CHAIN_APPROX_SIMPLE)
contours = imutils.grab_contours(contours)
contours = sorted(contours,key=cv2.contourArea, reverse = True)[:10]
screenCnt = None

for c in contours:
    # approximate the contour
    peri = cv2.arcLength(c, True)
    approx = cv2.approxPolyDP(c, 0.018 * peri, True)
    # if our approximated contour has four points, then
    # we can assume that we have found our screen
    if len(approx) == 4:
        screenCnt = approx
        break

if screenCnt is None:
    detected = 0
    print ("No contour detected")
else:
     detected = 1

if detected == 1:
    cv2.drawContours(img, [screenCnt], -1, (0, 0, 255), 3)

# Masking the part other than the number plate
mask = np.zeros(gray.shape,np.uint8)
new_image = cv2.drawContours(mask,[screenCnt],0,255,-1,)
new_image = cv2.bitwise_and(img,img,mask=mask)
#cv2.imshow("New image", new_image)

# Now crop
(x, y) = np.where(mask == 255)
(topx, topy) = (np.min(x), np.min(y))
(bottomx, bottomy) = (np.max(x), np.max(y))
Cropped = gray[topx:bottomx+1, topy:bottomy+1]

#cv2.imshow("Cropped", Cropped)

#Read the number plate
text = tess.image_to_string(Cropped, config='--psm 11')
print("Detected license plate Number is:",text)


cv2.waitKey(0)