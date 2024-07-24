import unittest
from flask import url_for
from app import app, db
from models import User, Task, TimeLog

class FlaskAppTests(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://at_test_usr:at_usr_pwd@localhost/at_test_db'
        self.app = app.test_client()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

    def test_register(self):
        response = self.app.post('/register', data=dict(
            username='test_user',
            password='test_password'
        ), follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Registration successful', response.data)

    def test_login(self):
        user = User(username='test_user', password='test_password')
        db.session.add(user)
        db.session.commit()

        response = self.app.post('/login', data=dict(
            username='test_user',
            password='test_password'
        ), follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Logged in successfully', response.data)

    def test_dashboard(self):
        user = User(username='test_user', password='test_password')
        db.session.add(user)
        db.session.commit()

        response = self.app.get('/dashboard', follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Dashboard', response.data)

    def test_add_task(self):
        user = User(username='test_user', password='test_password')
        db.session.add(user)
        db.session.commit()

        response = self.app.post('/add_task', data=dict(
            task_name='Test Task',
            task_description='This is a test task'
        ), follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Task added successfully', response.data)

    def test_update_task(self):
        user = User(username='test_user', password='test_password')
        db.session.add(user)
        db.session.commit()

        task = Task(task_name='Test Task', task_description='This is a test task', user_id=user.id)
        db.session.add(task)
        db.session.commit()

        response = self.app.post(f'/update_task/{task.id}', data=dict(
            task_name='Updated Task',
            task_description='This is an updated task'
        ), follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Task updated successfully', response.data)

    def test_delete_task(self):
        user = User(username='test_user', password='test_password')
        db.session.add(user)
        db.session.commit()

        task = Task(task_name='Test Task', task_description='This is a test task', user_id=user.id)
        db.session.add(task)
        db.session.commit()

        response = self.app.post(f'/delete_task/{task.id}', follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Task deleted successfully', response.data)

if __name__ == '__main__':
    unittest.main()