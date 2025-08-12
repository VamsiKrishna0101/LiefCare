# TakeCare – Healthcare Worker Shift Management

TakeCare is a web-based application designed for healthcare organizations (e.g., hospitals) to manage care workers’ shifts.  
It allows managers to monitor staff attendance, track clock-in/clock-out times, and view productivity metrics, while care workers can log their shifts securely — even with **face recognition**

![image_alt](https://github.com/VamsiKrishna0101/LiefCare/blob/67c5d2c13b002ca87cf96d0077234a7559fc02fe/home-1.png)

## 🚀 Features

### 1. **User Authentication**
- Secure login and registration using **JWT authentication** (with email/password).
- Roles: **Manager** and **Care Worker** with role-based access.
- Only authorized users like manager can access dashboard and add users and set location permiters users/workers  can clock-in and clock-out and regster face and clock-in-out using face.
- ![image_alt](https://github.com/VamsiKrishna0101/LiefCare/blob/b871fd10db7f34a46a76b07ea8514f55a22cedd8/login.png)

- ### 2. **Geofenced Clock-In/Clock-Out**
- Managers set a **perimeter(lat, long)  radius** (e.g., 2 km) for shift logging.
- Care workers can only clock in/out when within the allowed perimeter.If workers are inside the permiter a notification will pops up saying to clock-in in live when workers are outside notigication will pops to      clock-out
- If outside the perimeter, the app notifies them as outside permiter and prevents logging if there is no shift(clock-in) app prevents to clock-out.
- Also They can add an optional Note while clock-in or clock-out
- ![image_alt](https://github.com/VamsiKrishna0101/LiefCare/blob/db817429eeb21bc82ca58d423c8db05d7a483c62/wrk-2.png)

- ### 3. **Face Recognition Shift Logging**
- Care workers can clock in/out using ** face recognition**.
- Face descriptors are stored securely for identity verification in the usermodel.
- For This first User needs to Register their face first and the landmarks stored in user's collection as facedescriptor

- ### 4. **Manager Dashboard**
- View a live table of all staff currently clocked in.
- Access detailed history: clock-in/out times and locations for each employee.
-Can Register the new Workers And Can set the Centre location and permiter
![image_alt](https://github.com/VamsiKrishna0101/LiefCare/blob/c928c6809e6635e141e4e8113771ad2ccc8db6c4/setlc.png)
  **Analytics & Reports**
- **Average hours** worked per day.
- **Number of clock-ins** each day.
- **Total hours** per staff over the past week.
![image_alt](https://github.com/VamsiKrishna0101/LiefCare/blob/e087c75444bd555e0a1530feab5fef57d945c822/admin-1.png)
![image_alt](https://github.com/VamsiKrishna0101/LiefCare/blob/e087c75444bd555e0a1530feab5fef57d945c822/admin-2.png)
## 🛠 Tech Stack
**Frontend:** Vite + React, Tailwind CSS, React Context API, face-api.js  
**Backend:** Node.js, Express.js, MongoDB (Atlas), Mongoose, MVC Architecture  
**Authentication:** JWT (JSON Web Token)  
**Maps & Geofencing:** HTML5 Geolocation API + Haversine formula  
**Face Recognition:** face-api.js for browser-based recognition  


## ⚙️ Installation & Setup

# Clone repository
https://github.com/VamsiKrishna0101/LiefCare.git
cd LiefCare

# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd ../Frontend
npm install

# Start backend
npm run dev

# Start frontend
npm run dev

Note: I have used My database please connect to your db

Demo Video
Here I didn't showed the face clocl-in clock-out but it works sir😅

https://drive.google.com/file/d/1KQgnkJYQg9S-aECmhXGCPzdABCuejbth/view?usp=sharing

