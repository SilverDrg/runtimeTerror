from tensorflow.keras.models import load_model
from skimage import transform
from skimage import exposure
from skimage import io
from imutils import paths
import numpy as np
import argparse
import imutils
import random
import cv2
import os
import sys

from tensorflow.python.keras.backend import var


#parse the arguments
ap = argparse.ArgumentParser()
# path to the serialized traffic sign recognizer Keras model on disk
ap.add_argument("-m", "--model", required=True, help="path to pre-trained traffic sign recognizer")
# path to a directory of testing images
ap.add_argument("-i", "--images", required=True, help="path to testing directories containing images")
# path to the directory where our annotated output images will be stored.
ap.add_argument("-e", "--examples", required=True, help="path to output examples directory")
args = vars(ap.parse_args())

#load the traffic sign recognizer model
print("[INFO] loading model...")
model = load_model(args["model"])

#load the label names
labelNames = open("signnames.csv").read().strip().split("\n")[1:]
labelNames = [l.split(",")[1] for l in labelNames] #parse the label names

#  and take a sample
print("[INFO] predicting...")
imagePaths = args["images"]
image = io.imread(imagePaths)
image = transform.resize(image, (32,32)) #resize it to 32x32 pixels
image = exposure.equalize_adapthist(image, clip_limit=0.1) #apply Contrast Limited Adaptive Histogram Equalization

# preprocess the image by scaling it to the range [0,1]
image = image.astype("float32") / 255.0
image = np.expand_dims(image, axis=0)

#make predictions using the traffic sign recognizer CNN
preds = model.predict(image)
j = preds.argmax(axis=1)[0]
label = labelNames[j]

image = cv2.imread(imagePaths) #load the image using openCV 
image = imutils.resize(image, width=128) #resize the

sys.stdout.write(label)
sys.stdout.flush()
sys.exit(0)


#cv2.putText(image, label, (5,15), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0,0,255), 2) #draw the label on it

# save the image to disk
#p = os.path.sep.join([args["examples"], "{}.png".format(100000)])
#cv2.imwrite(p, image)

# imagePaths = list(paths.list_images(args["images"])) #take the paths to the input images
# random.shuffle(imagePaths) #shuffle the images
# imagePaths = imagePaths[:25] #take 25 sample images

# #loop over the image paths
# for(i, imagePath) in enumerate(imagePaths):
#     image = io.imread(imagePath) #load the image
#     image = transform.resize(image, (32,32)) #resize it to 32x32 pixels
#     image = exposure.equalize_adapthist(image, clip_limit=0.1) #apply Contrast Limited Adaptive Histogram Equalization

#     #preprocess the image by scaling it to the range [0,1]
#     image = image.astype("float32") / 255.0
#     image = np.expand_dims(image, axis=0)

#     #make predictions using the traffic sign recognizer CNN
#     preds = model.predict(image)
#     j = preds.argmax(axis=1)[0]
#     label = labelNames[j]

#     image = cv2.imread(imagePath) #load the image using openCV 
#     image = imutils.resize(image, width=128) #resize the
#     cv2.putText(image, label, (5,15), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0,0,255), 2) #draw the label on it

#     # save the image to disk
#     p = os.path.sep.join([args["examples"], "{}.png".format(i)])
#     cv2.imwrite(p, image)


