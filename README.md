# TrustGuard AI

**Real-Time Fraud Detection & Risk Intelligence System with Explainable AI**

---

## Live Demo
https://trustguard-ai-0wmr.onrender.com

---

## Overview

TrustGuard AI is a full-stack system that simulates real-world fraud detection used in fintech platforms.  
It analyzes user behavior in real time, assigns dynamic risk scores, and triggers automated security actions with clear AI-driven explanations.

---

## Features

- 🔢 **Real-Time Risk Scoring** (0–100 based on user behavior)
- 🤖 **Explainable AI Engine** for transparent decision-making
- 🚨 **Automated Actions** (OTP enforcement, transaction blocking)
- 📊 **Live Activity Feed** with anomaly tracking
- 🌐 **Full-Stack Architecture** with REST APIs
- 🔄 **State Synchronization** across reloads

---

## How It Works

1. User actions (login, transaction, etc.) are sent to backend APIs  
2. Backend processes events and updates risk score  
3. Rule-based AI evaluates anomalies and generates explanations  
4. System escalates risk and triggers actions dynamically  
5. Frontend reflects real-time system state  

---

## System Behavior

### Normal State
![Normal](./assets/Screenshot%201.png)

### Medium Risk Escalation
![Medium](./assets/Screenshot%202.png)

### High Risk & Automated Action
![High Risk](./assets/Screenshot%203.png)

---

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Node.js, Express.js  
- **APIs:** REST  
- **Deployment:** Render  

---

## API Endpoints

| Method | Endpoint   | Description |
|--------|------------|------------|
| POST   | `/event`   | Simulate user activity |
| GET    | `/risk`    | Get current risk score |
| GET    | `/logs`    | Retrieve activity logs |
| POST   | `/reset`   | Reset system state |

---

## Run Locally

```bash
git clone https://github.com/Aadit5gupta/trustguard-ai.git
cd trustguard-ai
npm install
node server.js
