# 💬 Easy Chat
Made by Mateo Fernández Rivera, student of Web Application Development in C.P.R. Liceo La Paz (A Coruña, Spain).

## 📜 DESCRICIÓN
Easy Chat is the name of an **instant messaging web application**, developed and designed by MFR.
It is based on other instant messaging applications, such as Facebook Messenger, Microsoft Teams, WhatsApp, Telegram... Users can receive messages and chat updates **in real time!!** thanks to the implementation of websockets in frontend and backend.

## ⭐ FEATURES
- Users can *create* an account and *login* into the platform.
- Create a chat, either a *private or a group*.
- Set and change *name and description of groups*.
- Group members with special permissions based on a *hierarchy of roles*.
- Send and receive messages in a chat *instantly* without refreshing the page.
- *Deleting and updating* messages in real time.
- Manage a group by *adding or removing members* in real time.
- Manage DB manually with *adminer* by going to `localhost:8080` and typing
    - HOST: *mysql*
    - USER: *root*
    - PASSWORD: *root*
    - DATABASE: *easychatdb*

## ✅ REQUIREMENTS AND INSTRUCTIONS TO DEPLOY
Below are the **steps and requirements needed** to deploy this application on a local machine.

### 💽 Requirements
1. OS: Ubuntu 22.04+ / Debian / Windows 10 or 11 / macOS
2. Hardware:
    - 2-core CPU.
    - 4GB (8GB recommended)
    - 5GB free of storage
    - Having ports 3000, 3306, 5173 and 8080 (optional) in localhost available

### 📁 Programs needed
1. **Docker Compose.** Needed to containerize and deploy backend and database services.
Download [here.](https://www.docker.com/products/docker-desktop/)

2. **Node.js** Needed to execute the frontend.
Download [here.](https://nodejs.org/en)

### ⚡️ Instructions to execute Easy Chat in a local machine
1. *Clone repository* in your machine
> `git clone https://github.com/mateonation/ProxectoFinalDeCiclo-MFR.git`

2. Go to the root of the directory and execute the command below to create *docker containers*
> `docker-compose up --build -d`

3. Go to the root of *frontend*
> `cd frontend`

4. Install *node modules* of the project
> `npm install`

5. Run the project in *vite* server
> `npm run dev`

6. You have initialised the app successfully!! You can now *enter in the site*
> `http://localhost:5173/register`