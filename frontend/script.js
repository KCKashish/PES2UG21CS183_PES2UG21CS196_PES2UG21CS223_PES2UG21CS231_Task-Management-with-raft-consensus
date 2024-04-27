// Function to fetch tasks from the server and render them
function fetchTasks() {
    fetch('/api/tasks')
        .then(response => response.json())
        .then(tasks => {
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = ''; // Clear existing tasks
            tasks.forEach(task => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<strong>${task.Description}</strong> - Status: ${task.Status}
                <button class="updateTaskBtn" data-id="${task.ID}">Update</button>
                <button class="deleteTaskBtn" data-id="${task.ID}">Delete</button>`;
                taskList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching tasks:', error));
}

document.addEventListener('DOMContentLoaded', function () {
    // Get the modal
    const modal = document.getElementById('updateTaskModal');

    // Get the button that opens the modal
    const updateTaskBtn = document.getElementById('updateTaskBtn');

    // Get the <span> element that closes the modal
    const closeBtn = document.querySelector('.close');

    // When the user clicks on the button, open the modal
    updateTaskBtn.addEventListener('click', function () {
        modal.style.display = 'block';
    });

    // When the user clicks on <span> (x), close the modal
    closeBtn.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener('click', function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    // Event listener for updating task
    document.getElementById('taskList').addEventListener('click', function (event) {
        if (event.target.classList.contains('updateTaskBtn')) {
            const taskId = event.target.dataset.id;

            // Open the modal
            modal.style.display = 'block';

            // Update task button click handler
            updateTaskBtn.addEventListener('click', function () {
                const descriptionInput = document.getElementById('updatedDescription');
                const statusInput = document.getElementById('updatedStatus');

                const description = descriptionInput.value.trim();
                const status = statusInput.value.trim();

                if (description !== '' && (status === 'Pending' || status === 'Completed')) {
                    const data = { Description: description, Status: status };
                    fetch(`/api/tasks/${taskId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    })
                    .then(response => response.json())
                    .then(response => {
                        console.log('Task updated successfully:', response);
                        fetchTasks(); // Fetch and render updated task list
                        modal.style.display = 'none'; // Close the modal after updating
                    })
                    /*.catch(error => {
                        console.error('Error updating task:', error);
                        alert('Error updating task. Please try again.');
                    });*/
                } else {
                    alert('Invalid task description or status.');
                }
            });
        }
    });

    // Event listener for the add task form submission
    document.getElementById('taskForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form submission
        const description = document.getElementById('taskDescription').value;
        const status = document.getElementById('taskStatus').value;
        const data = { Description: description, Status: status };
        fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(response => {
            console.log('Task added successfully:', response);
            fetchTasks(); // Fetch and render updated task list
        })
        .catch(error => console.error('Error adding task:', error));
    });

    // Event listener for delete task button clicks
    document.getElementById('taskList').addEventListener('click', function (event) {
        if (event.target.classList.contains('deleteTaskBtn')) {
            const taskId = event.target.dataset.id;
            if (confirm('Are you sure you want to delete this task?')) {
                fetch(`/api/tasks/${taskId}`, {
                    method: 'DELETE',
                })
                .then(response => response.json())
                .then(response => {
                    console.log('Task deleted successfully:', response);
                    fetchTasks(); // Fetch and render updated task list
                })
                .catch(error => console.error('Error deleting task:', error));
            }
        }
    });

    // Fetch initial tasks when the page loads
    fetchTasks();
});
