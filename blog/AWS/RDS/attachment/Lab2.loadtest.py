import mysql.connector
import socket
import time
import thread
import random
import threading
import sys

# Global Variables
start_time = time.time()
query_count = 0
lock = threading.Lock()

def thread_func(host_endpoint, username, password, schema, max_id):
    # Specify that query_count is a global variable
    global query_count

    # Loop Indefinitely
    while True:
        try:
            # Resolve the endpoint
            host_name = socket.gethostbyname(host_endpoint)

            # Generate a random number to use as the lookup value
            key_value = str(random.randrange(1, max_id))

            # Create the SQL query to execute
            sql_command = "select * from sbtest1 where id={0};".format(key_value)

            # Connect to the reader endpoint
            conn = mysql.connector.connect(host=host_name, user=username, passwd=password, database=schema, autocommit=True)

            # Execute query
            conn.cmd_query(sql_command)

            # Close the connection
            conn.close()

            # Increment the executed query count
            with lock:
                query_count += 1
        except:
            # Display any exception information
            print(sys.exc_info()[1])


def progress():
    # Loop indefinitely
    while True:
        # Format an output string
        output = "{0}\r".format(int(query_count / (time.time()-start_time)))

        # Write to STDOUT and flush
        sys.stdout.write(output)
        sys.stdout.flush()

        # Sleep this thread for 1 second
        time.sleep(1)

# Entry Point
host_endpoint = sys.argv[1]
username = 'masteruser'
password = 'Password1'
schema = 'mylab'
max_id = 2500000
thread_count = 25

# Start progress thread
thread.start_new_thread(progress, ())

# Start readers
for thread_id in range(thread_count):
        thread.start_new_thread(thread_func, (host_endpoint, username, password, schema, max_id,))

# Loop indefinitely to prevent application exit
while 1:
        pass