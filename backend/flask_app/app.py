import os
from datetime import datetime, timedelta
from enum import Enum
from flask import Flask, render_template, request, url_for, redirect, flash, session
from flask_login import LoginManager, login_user, current_user, login_required, logout_user
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash


app = Flask(__name__)

# Configure the MySQL database
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://at_dev_usr:at_dev_pwd@localhost/at_dev_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['REMEMBER_COOKIE_DURATION'] = timedelta(minutes=5)
#set secret key
app.secret_key = os.urandom(24)

# Create the database connection
db = SQLAlchemy(app)

# Create the login manager
login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.init_app(app)

# import models for the tables
from .models import User, Task, TimeLog

# load the user login manager
@login_manager.user_loader
def load_user(id):
    # since the user_id is just the primary key of our user table, use it in the query for the user
    return User.query.get(id)

# Define your Flask routes and other app logic here

# Define Flask routes and other app logic

@app.route('/')
def index():
    Users = User.query.all()
    Tasks = Task.query.all()
    return render_template('index.html', Users=Users, Tasks=Tasks)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        email = request.form['email']

        # check if the user already exists
        user = User.query.filter_by(username=username).first()
        if user:
            flash('User already exists')
            return redirect(url_for('register'))

        user = User(username=username, password_hash=generate_password_hash(password, method='pbkdf2:sha256'), email=email)
        db.session.add(user)
        db.session.commit()
        flash('User registered successfully')
        return redirect(url_for('login'))
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password_hash, password):
            flash('Login successful')
            login_user(user, remember=True)
            return redirect(url_for('dashboard'))
        elif user and not check_password_hash(user.password_hash, password):
            flash('Incorrect password')
            return redirect(url_for('login'))
        else:
            flash('Invalid credentials')
            return redirect(url_for('login'))
    return render_template('login.html')

@app.route('/dashboard')
@login_required
def dashboard():
    username = current_user.username
    user_id = current_user.id
    Tasks_list = Task.query.filter_by(user_id=user_id).all()
    return render_template('dashboard.html', username=username, user_id=user_id, User_Tasks=Tasks_list)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

# add route to add tasks
@app.route('/add_task', methods=['GET', 'POST'])
@login_required
def add_task():
    if request.method == 'POST':
        title = request.form['title']
        description = request.form['description']
        # !!! add functionality later !!!!
        # status = request.form['status']
        status = 'todo'
        due_date = request.form['due_date']
        user_id = current_user.id

        task = Task(title=title, description=description, status=status, due_date=due_date, user_id=user_id)
        db.session.add(task)
        db.session.commit()
        flash('Task added successfully')
        return redirect(url_for('dashboard'))
    return render_template('dashboard.html')

# add route to update tasks
@app.route('/update_task/<int:id>', methods=['GET', 'POST'])
@login_required
def update_task(id):
    task = Task.query.get(id)
    if request.method == 'POST':
        task.title = request.form['title']
        task.description = request.form['description']
        # task.status = request.form['status']
        task.due_date = request.form['due_date']
        db.session.commit()
        flash('Task updated successfully')
        return redirect(url_for('dashboard'))
    return render_template('dashboard.html')

# add route to delete tasks
@app.route('/delete_task/<int:id>', methods=['GET', 'POST'])
@login_required
def delete_task(id):
    task = Task.query.get(id)
    db.session.delete(task)
    db.session.commit()
    flash('Task deleted successfully')
    return redirect(url_for('dashboard'))

if __name__ == '__main__':
    app.run(debug=True)
