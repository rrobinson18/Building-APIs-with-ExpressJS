document.addEventListener('DOMContentLoaded', function () {
    let submitBtn = document.getElementById('submit-btn');
    let chirpField = document.getElementById('chirp-list');
    let editSubmit = document.getElementById('editSubmit');


    function loadChirps() {

        fetch('/api/chirps')
            .then(res => res.json())
            .then(data => {
                delete data.nextid;
                for(let key in data) {
                    createElement(data[key].user, data[key].text, key);
                }
            });
    }

    function postChirp(name, message) {
        $.post('/api/chirps', {user : name, text : message })
        .then(() => {
             $('#chirp-list').empty();
            loadChirps();
        })
    }

    function createElement(name, message, id) {
        let chirp = document.createTextNode(name);
        let chirpMessage = document.createTextNode(message)

        let li = document.createElement('li');
        li.setAttribute('key', id);
        li.id = id;
        li.setAttribute('class', 'text-dark');


        let divWrapper = document.createElement('div');
        divWrapper.className = 'card border-primary mb-3';

        let divHeader = document.createElement('div');
        divHeader.className = 'card-header text-dark';

        let divBody = document.createElement('div');
        divBody.className = 'card-body';

        //Edit Button
        let editBtn = document.createElement('button');
        editBtn.append(document.createTextNode("Edit"));
        editBtn.className = 'btn btn-primary float-right';
        editBtn.id = id;
        editBtn.setAttribute('data-toggle', 'modal');
        editBtn.setAttribute('data-target', '#editModal');
        // editBtn.addEventListener('click', function () {
        //     document.getElementById('editModal').setAttribute('edit-id', id)
        // })

        //Delete Button
        let deleteBtn = document.createElement('button');
        deleteBtn.append(document.createTextNode("X"));
        deleteBtn.className = 'btn btn-primary float-right';
        deleteBtn.id = id;

        //Puts them all together
        divHeader.append(chirp);
        divHeader.append(deleteBtn);
        divHeader.append(editBtn);
        divBody.append(chirpMessage);
        divWrapper.append(divHeader);
        divWrapper.append(divBody);


        li.append(divWrapper);

        deleteBtn.addEventListener('click', removeChirp);

        chirpField.appendChild(li);
    }

    function removeChirp() {
        let id = this.id;
        document.getElementById(id).remove();
        $.ajax({
            url: `/api/chirps/${id}`,
            type: 'DELETE',
            success: function () {
                console.log('DELETED');
            }
        })
    }

    submitBtn.addEventListener('click', function () {
        event.preventDefault();
        let name = document.getElementById('name');
        let message = document.getElementById('message');
        postChirp(name.value, message.value);
    })

    editSubmit.addEventListener('click', function () {
        let editId = document.getElementById('editModal').getAttribute('edit-id');
        let name = document.getElementById('editName').value;
        let message = document.getElementById('editMessage').value;
        $.ajax({
            url: '/api/submit/' + editId,
            method: 'PUT',
            data: {
                name: name,
                message: message
            },
            success: function () {
                document.location.reload();
            }
        })
        console.log(editId)
    })

    loadChirps();
})