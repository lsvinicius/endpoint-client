"""Simple user model"""

from flask_login import UserMixin

class User(UserMixin):
    """Used to know who is the current authenticated user"""
    def __init__(self, username, password):
        self.username = username
        self.password = password
        self.id = username+':'+password #needed for Flask-Login

def create_user(credentials):
    """Retrieve a user object given a username and password"""
    (username, password) = credentials.split(':')
    return User(username, password)
