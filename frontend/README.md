# 🏨 School Vaccination Portal

A full-stack internal web tool designed for school coordinators to manage student vaccination efforts efficiently. Built using **React**, **Node.js**, **Express**, and **MongoDB**.

---

## 📉 Features Implemented

* ✅ **Student Management**

  * Add/Edit/Delete individual student records
  * Bulk upload students via CSV
  * Sort/filter students by name, class, or vaccination status

* ✅ **Vaccination Drive Management**

  * Schedule new drives with vaccine name, date, doses, and applicable classes
  * Enforces 15-day future date logic
  * Edit/delete existing drives (edit disabled for past dates)

* ✅ **Vaccination Records**

  * Record vaccination for students under a specific drive
  * Prevent duplicate vaccination for same vaccine
  * Export vaccination records to CSV/PDF
  * Pagination supported

* ✅ **Summary Dashboard**

  * Total students, vaccinated/pending count
  * Vaccination rate percentage
  * Upcoming drives (next 30 days only)
  * Filter & sort upcoming drives

* ✅ **(Simulated) Authentication**

  * Directs user to dashboard post-login (UI only, no backend auth logic)

---

## 📊 Tech Stack

| Layer       | Technology                    |
| ----------- | ----------------------------- |
| Frontend    | React, Axios, jsPDF, HTML/CSS |
| Backend     | Node.js, Express.js           |
| Database    | MongoDB (Mongoose ODM)        |
| File Upload | Multer + CSV-Parser           |

---

## 🚀 Setup Instructions (Local Development)

### ▶️ Prerequisites

* Node.js & npm installed
* MongoDB running locally or via Atlas

### ▶️ 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/school-vaccination-portal.git
cd school-vaccination-portal
```

### ▶️ 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### ▶️ 3. Run Backend Server

```bash
node server.js
# or with nodemon if installed
dev: nodemon server.js
```

### ▶️ 4. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### ▶️ 5. Run Frontend

```bash
npm start
```

Frontend runs on: `http://localhost:3000`
Backend runs on: `http://localhost:5000`

---

## 🔄 API Overview

### Student APIs (URL: `/students`)

* `GET /students` → fetch all
* `POST /students` → create new student
* `PUT /students/:id` → edit
* `DELETE /students/:id` → delete

### Drive APIs (URL: `/drives`)

* `GET /drives` → all drives
* `POST /drives` → create
* `PUT /drives/:id` → update
* `DELETE /drives/:id` → delete

### Vaccination APIs (URL: `/vaccination/records`)

* `GET /records` → list vaccination records (optional filter by vaccineName)
* `POST /records` → create record
* `DELETE /records/:id` → delete record

### Summary & Report (URL: `/report`)

* `GET /summary` → total students, vaccinated count, percentage, drives
* `GET /upcoming-drives` → next 30 days only

---

## 🔄 Database Schema Overview

### Student

```js
{
  studentId: String,
  name: String,
  age: Number,
  studentClass: String,
  vaccinated: Boolean
}
```

### Drive

```js
{
  vaccineName: String,
  date: Date,
  doses: Number,
  classes: [String]
}
```

### VaccinationRecord

```js
{
  studentId: String,
  studentName: String,
  vaccineName: String,
  vaccinationDate: Date
}
```

## 📄 License

This project is for academic purposes under BITS Pilani WILP Full Stack Development course.

---
