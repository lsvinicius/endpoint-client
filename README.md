# First things first

If you are seeing this project and you did not follow the steps from [here](https://github.com/lsvinicius/endpoint-example), stop right now and follow the instructions from **endpoint-example** project.

In case you already followed those steps, then you might continue reading these instructions and I will start it by saying
# WELCOME
This project is a frontend user interface to manage your cloud machines. Every command is sent to an external REST API server. We do not store anything locally, everything is in the cloud. Our interface allows you to:
##### Features
  - Register yourself
  - Create machines
  - Modify machines info (only some info, not everything)
  - List all cloud machines (Yes, you are able to see other users machines)
  - Delete machines
  - Turn machines of/off

# Set up system environment
Here is a list of programs to have installed:
  - Python 3.5
  - pip3

After you have installed these, you will need to add their executables to your **PATH** environment, in order to be able to run them from the command line.
## Setting virtualenv environment on linux
### Set virtualenv
Type ```pip install virtualenv``` in order to install it in your machine. It might need superuser permission in order to install it. So, if you are in a **Linux** environment use ```sudo pip install virtualenv```. 

### Create your virtualenv
Now that you have virtualenv installed, type the following command ```virtualenv --python=python3.5 venv``` this will generate a directory called ```venv```.

### Activating your virtualenv
Just run ```source venv/bin/activate``` and you will be in your virtual environment.

## I'm a windows user
In case you are a windows user, check for instructions about how to set virtualenv [here](https://docs.python.org/3/library/venv.html).

# Configure before running
Open file ```src/config.py``` and set variable ```API_ADDRESS``` to the address where ```endpoint-example``` server will be running.

# Running the system
Ensure that ```endpoint-example``` server is running and you have **Activated your virtualenv** and cloned our project. Then, go to the root directory of the project and type ```pip install -r requirements.txt```.
After that, just type ```./run_frontend.sh```. If you are on **Windows**, then you will have to set the ```PYTHONPATH``` variable by hand. The ```PYTHONPATH``` environment variable should be set to the root directory of the project. After that, just type ```python -m src.app```. Now, just open your browser, type ```http://localhost:5000``` and **HAVE FUN**.

# NOTES
- Data is fetched from the external server every 5 seconds.
- In order to edit an endpoint info, you need to click on button ```Stop fetching data```. 
- Every time you edit an info, you need to click on button ```Edit```.
- If you edit an info and do not click on button ```Edit``` then the data will be restored to its previous value once data is fetched from the server.
- In order for the system to work properly, you need to have the server up and running, otherwise you will experience some bugs.
- Every time you add a new machine, it will only be shown when the client fetch data from the external server. This means that if you add machines after clicking the button ```Stop fetching data``` then you will only be able to see and operate on those machines when clicking on ```Start fetching data```.
- Turn machines on/off and remove machine is only possible when data is being fetched from the server.
- 
