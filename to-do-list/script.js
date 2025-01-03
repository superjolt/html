document.getElementById('add-todo').addEventListener('click', function() {
    const taskName = document.getElementById('new-todo').value;
    if (taskName.trim() !== '') {
        addTask(taskName);
        document.getElementById('new-todo').value = '';
    }
});

function addTask(taskName) {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = taskName;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete');
    deleteButton.addEventListener('click', function() {
        li.remove();
    });

    li.appendChild(span);
    li.appendChild(deleteButton);
    document.getElementById('todo-list').appendChild(li);
}