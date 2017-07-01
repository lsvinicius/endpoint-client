"""Main application"""

import os
from flask import Flask
from flask_login import LoginManager
from src.views.views import site_views
from src.user import create_user

APP = Flask(__name__)

APP.register_blueprint(site_views)

# login_manager initialization
LOGIN_MANAGER = LoginManager()
LOGIN_MANAGER.setup_app(APP)
LOGIN_MANAGER.login_view = 'site_views.login'

@LOGIN_MANAGER.user_loader
def load_user(credentials):
    """Find user"""
    return create_user(credentials)

if __name__ == '__main__':
    APP.secret_key = os.urandom(24)
    APP.run(debug=True, port=5000)
