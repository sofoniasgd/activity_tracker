import os
from datetime import datetime
from enum import Enum
from flask import Flask, render_template, request, url_for, redirect
from flask_sqlalchemy import SQLAlchemy
import uuid

app = Flask(__name__)

# Configure the MySQL database
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://at_dev_usr:at_dev_pwd@localhost/at_dev_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Create the database connection
db = SQLAlchemy(app)

# Define your Flask routes and other app logic here

# create models for the tables
class User(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), unique=True, nullable=False)
    email = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<User {self.username}>'

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'))
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.Enum('todo', 'in_progress', 'completed'), default='todo')
    due_date = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Task {self.id}>'

class TimeLog(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'))
    task_id = db.Column(db.Integer, db.ForeignKey('task.id'))
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    duration = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    def __repr__(self):
        return f'<Timelog {self.id}>'

# Define Flask routes and other app logic

@app.route('/')
def index():
    Users = User.query.all()
    Tasks = Task.query.all()
    return render_template('index.html', Users=Users, Tasks=Tasks)

#if __name__ == '__main__':
#    app.run()
