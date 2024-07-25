# Activity tracker
#### Introduction  
Welcome to the Productivity Tracker, a web application designed to help users manage their tasks and track the time spent on various activities. This project aims to provide an intuitive platform where users can create, update, and monitor their productivity efficiently. The key features include user authentication, task management, time logging, and a dynamic dashboard for visualizing task progress.  
#### Links  
Deployed Site: 🚧👷‍♂️ comming soon 👷‍♂️🚧  
Final Project Blog Article: 🚧👷‍♂️ comming soon 👷‍♂️🚧  
Author's LinkedIn: <a href="https://www.linkedin.com/in/sofonias-gashaw-dubale">
    <img src="https://img.shields.io/badge/LinkedIn-blue?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn Badge"/>
  </a>  
### Installation  
To get a local copy up and running, follow these steps:
#### Prerequisites
Ensure you have the following installed:  
- Python 3.8.10  
- MySQL Ver 8.0.37-0ubuntu0.20.04.3 for Linux on x86_64 ((Ubuntu))  
- pip (Python package installer) 24.1.1
### Setup  
Clone this repository:  
```
git clone https://github.com/sofoniasgd/activity_tracker.git
cd productivity-tracker
```
Create and activate a virtual environment:  
```
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```
Install required packages:  
```
pip install -r requirements.txt
```
Set up the MySQL database:  
```
mysql -u root -p
CREATE DATABASE at_dev_db;
CREATE DATABASE at_test_db;
```
Configure the database in app.py:  
Update the database URI in app.py with your MySQL credentials:  
```
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://your-username:your-password@localhost/at_dev_db'
```
Initialize the database:  
```
flask db init
flask db migrate -m "Initial migration."
flask db upgrade
```
Run the application:  
```
flask run
```
### Usage  
Visit the Home Page:  
Open your browser and go to http://127.0.0.1:5000/.
- Register and Login:
Create a new account or log in with your credentials.  
- Dashboard:
Access your dashboard to view and manage your tasks.  
- Manage Tasks:
Add new tasks, update their status, and log time spent on each task. The dashboard will dynamically update to reflect your productivity.
### Screenshots

### Contributing  
Contributions are welcome! To contribute:  
> Fork the repository.   
> Create your feature branch (git checkout -b feature/AmazingFeature).  
> Commit your changes (git commit -m 'Add some AmazingFeature').  
> Push to the branch (git push origin feature/AmazingFeature).  
> Open a Pull Request.  
Please make sure to update tests as appropriate.  
### Related Projects
- [Todoist](https://todoist.com/)
- [Trello](https://trello.com/)
- [Asana](https://asana.com/)
These projects offer similar task management features and can provide additional inspiration and functionality ideas.
### Licensing  
Distributed under the MIT License. See LICENSE for more information.

  
