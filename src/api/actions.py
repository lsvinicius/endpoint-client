"""All external API operations are here"""

import json
import requests
from src.config import API_ADDRESS
from flask_login import current_user

def _check_result(result):
    if not result.get('success'):
        result['success'] = False

def _connect(connect_callback):
    """Function to handle laborious connection tasks"""
    try:
        result = connect_callback()
        if result is None:
            result = {}
            result['message'] = "something went wrong"
        _check_result(result)
        return result
    except requests.exceptions.ConnectionError as exception:
        print(exception)
        return {"success": False, "message": "Connection to external API failed"}
    except requests.exceptions.Timeout as exception:
        print(exception)
        return {"success": False, "message": "Operation timedout"}
    except requests.exceptions.TooManyRedirects as exception:
        print(exception)
        return {"success": False, "message": "Too many redirects"}
    except requests.exceptions.HTTPError as exception:
        print(exception)
        return {"success": False, "message": "Invalid HTTP response"}
    except requests.exceptions.RequestException as exception:
        print(exception)
        return {"success": False, "message": "I don't know what happened"}

def register(form):
    """Call register operation in external API"""
    def connect_callback():
        """Helper callback that do not deal with any kind of errors that might be raised"""
        result = json.loads(requests.post(API_ADDRESS+'/account/register',
                                          json=form).text)
        return result
    return _connect(connect_callback)

def validate_account(form):
    """Call validate_account operation in external API"""
    def connect_callback():
        """Helper callback that do not deal with any kind of errors that might be raised"""
        user = form['username']
        password = form['password']
        result = json.loads(requests.get(API_ADDRESS+'/account/validate',
                                         auth=(user, password)).text)
        return result
    return _connect(connect_callback)

def create_endpoint(form):
    """Create endpoint"""
    def connect_callback():
        """Helper callback that do not deal with any kind of errors that might be raised"""
        user = current_user.username
        password = current_user.password
        f_data = {
            "model": form["model"],
            "serialNumber": form["serialNumber"],
            "name": form["name"],
            "processor": form["processor"],
            "memory": form["memory"],
            "hd": form["hd"],
            "user": user
        }
        result = json.loads(requests.post(API_ADDRESS+'/endpoint/register',
                                          auth=(user, password),
                                          json=f_data).text)
        return result
    return _connect(connect_callback)

def list_endpoints():
    """List all endpoints"""
    def connect_callback():
        """Helper callback that do not deal with any kind of errors that might be raised"""
        user = current_user.username
        password = current_user.password
        result = json.loads(requests.get(API_ADDRESS+'/endpoint/list',
                                         auth=(user, password)).text)
        return result
    return _connect(connect_callback)

def turnon(machine_id):
    """Turn machine on"""
    def connect_callback():
        """Helper callback that do not deal with any kind of errors that might be raised"""
        user = current_user.username
        password = current_user.password
        result = json.loads(requests.patch(API_ADDRESS+'/endpoint/turnon/'+machine_id,
                                           auth=(user, password)).text)
        return result
    return _connect(connect_callback)

def turnoff(machine_id):
    """Turn machine off"""
    def connect_callback():
        """Helper callback that do not deal with any kind of errors that might be raised"""
        user = current_user.username
        password = current_user.password
        result = json.loads(requests.patch(API_ADDRESS+'/endpoint/turnoff/'+machine_id,
                                           auth=(user, password)).text)
        return result
    return _connect(connect_callback)

def remove(machine_id):
    """Remove endpoint"""
    def connect_callback():
        """Helper callback that do not deal with any kind of errors that might be raised"""
        user = current_user.username
        password = current_user.password
        result = json.loads(requests.delete(API_ADDRESS+'/endpoint/remove/'+machine_id,
                                            auth=(user, password)).text)
        return result
    return _connect(connect_callback)

def edit(form):
    """Edit endpoint"""
    def connect_callback():
        """Helper callback that do not deal with any kind of errors that might be raised"""
        user = current_user.username
        password = current_user.password
        f_data = {
            "model": form["model"],
            "serialNumber": form["serialNumber"],
            "name": form["name"],
            "processor": form["processor"],
            "memory": form["memory"],
            "hd": form["hd"],
            "user": user,
            "id": form["id"]
        }
        result = json.loads(requests.patch(API_ADDRESS+'/endpoint/modify',
                                           auth=(user, password),
                                           json=f_data).text)
        return result
    return _connect(connect_callback)
