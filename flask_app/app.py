import os
from datetime import datetime, timedelta
from enum import Enum
from flask import Flask, render_template, request, url_for
from flask import redirect, flash, session
from flask_login import LoginManager, login_user, current_user
from flask_login import login_required, logout_user
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash


app = Flask(__name__)

# Configure the MySQL database
db_uri = 'mysql://at_dev_usr:at_dev_pwd@localhost/at_dev_db'
app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['REMEMBER_COOKIE_DURATION'] = timedelta(minutes=5)
# set random secret key for the session
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
    # since the user_id is just the primary key of our user table,
    # use it in the query for the user
    return User.query.get(id)


# Defining Flask routes and app logic

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        email = request.form['email']

        # check if the user already exists
        user = User.query.filter_by(username=username).first()
        if user:
            flash('User already exists', 'warning')
            return redirect(url_for('register'))

        # generate password hash so as to not store the password in plain text
        # hash method is pbkdf2:sha256
        hash_method = generate_password_hash(password, method='pbkdf2:sha256')
        user = User(username=username, password_hash=hash_method, email=email)
        db.session.add(user)
        db.session.commit()
        flash('User registered successfully', 'success')
        return redirect(url_for('login'))
    return render_template('register.html')


# default route is the login route
@app.route('/')
def landing():
    return redirect(url_for('https://sofoniasgd.github.io/activity_tracker/'))


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password_hash, password):
            flash('Login successful', 'success')
            login_user(user, remember=True)
            return redirect(url_for('dashboard'))
        elif user and not check_password_hash(user.password_hash, password):
            flash('Incorrect password', 'warning')
            return redirect(url_for('login'))
        else:
            flash('Invalid credentials', 'error')
            return redirect(url_for('login'))
    return render_template('login.html')


@app.route('/dashboard')
@login_required
def dashboard():
    username = current_user.username
    user_id = current_user.id
    # order tasks by status first and by due date
    tasks_list = Task.query.filter_by(user_id=user_id).order_by(Task.status, Task.due_date).all()
    timelog_list = TimeLog.query.filter_by(user_id=user_id).all()
    # get a dictionary of task status(count,complete, in progress, todo)
    task_stat = {}
    ct = Task.query.filter_by(user_id=user_id, status='completed').count()
    ip = Task.query.filter_by(user_id=user_id, status='in_progress').count()
    td = Task.query.filter_by(user_id=user_id, status='todo').count()
    total = Task.query.filter_by(user_id=user_id).count()

    task_stat['completed'] = ct
    task_stat['in_progress'] = ip
    task_stat['todo'] = td
    task_stat['count'] = total

    return render_template('dashboard.html', username=username,
                           user_id=user_id, User_Tasks=tasks_list,
                           timelog_list=timelog_list, task_stat=task_stat)


@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Logged out successfully', 'success')
    return redirect(url_for('login'))


# add route to add tasks
@app.route('/add_task', methods=['GET', 'POST'])
@login_required
def add_task():
    if request.method == 'POST':
        title = request.form['title']
        description = request.form['description']
        status = request.form['status']
        start_date = request.form['start_date']
        due_date = request.form['due_date']
        user_id = current_user.id

        task = Task(title=title, description=description, status=status,
                    created_at=datetime.strptime(start_date, '%Y-%m-%dT%H:%M'),
                    due_date=datetime.strptime(due_date, '%Y-%m-%dT%H:%M'),
                    user_id=user_id)
        # convert form dates into datetime objects
        st_date = datetime.strptime(start_date, '%Y-%m-%dT%H:%M')
        d_date = datetime.strptime(due_date, '%Y-%m-%dT%H:%M')
        duration = (d_date - st_date).total_seconds() / 60
        # create a timelog for the task
        timelog = TimeLog(user_id=user_id, task_id=task.id,
                          start_time=st_date, end_time=d_date,
                          duration=duration)
        db.session.add(task)
        db.session.add(timelog)
        db.session.commit()
        flash('Task added successfully', 'success')
        return redirect(url_for('dashboard'))
    return render_template('dashboard.html')


# add route to update tasks
@app.route('/update_task/<int:id>', methods=['GET', 'POST'])
@login_required
def update_task(id):
    task = Task.query.get(id)
    timelog = TimeLog.query.filter_by(task_id=id)
    str = task is None, 'Task does not exist', timelog is None, 'TimeLog does not exist'
    flash(str)
    if request.method == 'POST':
        task.title = request.form['title']
        task.description = request.form['description']
        task.status = request.form['status']
        task.created_at = datetime.strptime(request.form['start_date'], '%Y-%m-%dT%H:%M')
        timelog.start_time =  datetime.strptime(request.form['start_date'], '%Y-%m-%dT%H:%M')
        task.due_date = datetime.strptime(request.form['due_date'], '%Y-%m-%dT%H:%M')
        timelog.end_time = datetime.strptime(request.form['due_date'], '%Y-%m-%dT%H:%M')
        duration = (timelog.end_time - timelog.start_time).total_seconds() / 60
        timelog.duration = duration
        db.session.commit()
        flash('Task updated successfully', 'success')
        return redirect(url_for('dashboard'))
    return redirect(url_for('dashboard'))


# add route to delete tasks
@app.route('/delete_task/<int:id>', methods=['GET', 'POST'])
@login_required
def delete_task(id):

    if request.method == 'POST':
        db.session.delete(Task.query.get(id))
        # db.session.delete(TimeLog.query.filter_by(task_id=id))
        db.session.commit()
        flash('Task deleted successfully', 'success')
        return 'success', 200

    flash('Task NOT deleted', 'error')
    response_data = {'message': 'Task not deleted'}
    return response_data, 404


if __name__ == '__main__':
    app.run()
