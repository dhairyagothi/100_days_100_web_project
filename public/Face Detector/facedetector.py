import cv2
from random import randrange as r

trained_data=cv2.CascadeClassifier("haarcascade_frontalface_default.xml")

webcam=cv2.VideoCapture(0)

while True:
    success,frame=webcam.read()

    conv_frame=cv2.cvtColor(frame,cv2.COLOR_BGR2GRAY)


    face_cord=trained_data.detectMultiScale(conv_frame)

    for x,y,w,h in face_cord:
        cv2.rectangle(frame,(x,y),(x+w,y+h),(r(0,256),r(0,256),r(0,256)),2)

    cv2.imshow('detector',frame)
    key=cv2.waitKey(1)
    if (key==83 or key==115):
        break

webcam.release()


