 # Angular Setup
Install NodeJS LTS (Long Term Support) version:
👉 Download NodeJS

1️⃣Navigate to the /angularApp directory.

2️⃣Run the following command in your terminal (you might need to run it as admin):
👉bash
   npm install

3️⃣Install Angular CLI globally by running:
👉bash
   npm install -g @angular/cli
Start the development server with:
👉bash
   ng serve

⚠️ Note: If you're on Windows, you might encounter an "UnauthorizedAccess" issue. In that case, search for the specific error message and follow the suggested fix.

Open your browser and go to:
   👉 http://localhost:4200

💡 You should see the Angular app (although it may not be fully functional yet).

# 🐍 Python Backend Guide
1️⃣ Prerequisites
Make sure you have Python 3 and pip installed.
👉 Download Python

Install MongoDB Community Server:
👉 Download MongoDB

2️⃣ MongoDB Setup
Start MongoDBCompass and create a connection.

(Mac users may need to follow alternative instructions to set it up.)

# Verify MongoDB is working:
Open http://localhost:27017/ in your browser.

Inside MongoDBCompass, click on Databases.
You should see these collections:
admin
config
local
3️⃣ Setting Up the Backend
(Optional) Create and activate a virtual environment:
👉 How to setup virtual environments

If this step causes issues, skip it and use your global Python environment.

Install the required Python packages by running:
bash
   pip install -r requirements.txt

Run the backend server:
bash
   python app.py

# 🐳 Docker Setup
1️⃣ Prerequisite:
Make sure Docker is installed on your system.

👉 Download Docker

2️⃣ Building and Running Docker Containers
Navigate to the directory containing the docker-compose.yml file.

Build the Docker images:
bash
   docker-compose build

Run the containers:
bash
   docker-compose up
Once everything is up and running, open your browser and go to:
👉 http://localhost:4200

# ✅ Final Setup
Make sure the following are running at the same time:

🐍 Python backend:
bash
   python app.py

🌐 Angular development server:
bash
   ng serve

🐳 Docker containers:
bash
   docker-compose up

Now, visit 👉 http://localhost:4200 to access the fully functional application. 🎉