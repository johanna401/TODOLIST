let studentList = document.getElementById('studentList');

// Fonction pour récupérer les élèves au chargement
function fetchStudents() {
    fetch('/students')
        .then(response => response.json())
        .then(data => {
            data.forEach(displayStudent);
        });
}

// Fonction pour ajouter un élève
function addStudent() {
    let nameInput = document.getElementById('nameInput').value;
    let surnameInput = document.getElementById('surnameInput').value;
    let genderInput = document.getElementById('genderInput').value;
    let courseInput = document.getElementById('courseInput').value;
    let matriculeInput = document.getElementById('matriculeInput').value;
    let dateInput = document.getElementById('dateInput').value;

    if (!nameInput || !surnameInput || !genderInput || !courseInput || !matriculeInput || !dateInput) {
        return;
    }

    let student = {
        nom: nameInput,
        prenom: surnameInput,
        sexe: genderInput,
        parcours: courseInput,
        matricule: matriculeInput,
        date_naissance: dateInput
    };

    fetch('/students', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(student)
    })
    .then(response => response.json())
    .then(data => {
        displayStudent(data);
        clearInputs();
    });
}

// Fonction pour afficher un élève
function displayStudent(student) {
    let li = document.createElement('li');
    li.id = `student-${student.id}`; // Ajoutez l'ID pour faciliter la suppression et la modification
    li.innerHTML = `${student.nom} ${student.prenom}, Sexe: ${student.sexe}, Parcours: ${student.parcours}, Matricule: ${student.matricule}, Date: ${student.date_naissance}`;

    let editButton = document.createElement('button');
    editButton.innerHTML = '<ion-icon name="pencil-outline" class="modify"></ion-icon>';
    editButton.onclick = function() {
        editStudent(student);
    };

    let deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<ion-icon name="trash-outline" class="delete"></ion-icon>';
    deleteButton.onclick = function() {
        deleteStudent(student.id, li);
    };

    li.appendChild(editButton);
    li.appendChild(deleteButton);
    studentList.appendChild(li);
}

// Fonction pour modifier un élève
function editStudent(student) {
    document.getElementById('nameInput').value = student.nom;
    document.getElementById('surnameInput').value = student.prenom;
    document.getElementById('genderInput').value = student.sexe;
    document.getElementById('courseInput').value = student.parcours;
    document.getElementById('matriculeInput').value = student.matricule;
    document.getElementById('dateInput').value = student.date_naissance;

    deleteStudent(student.id); // Supprimez l'élève de la liste avant de réajouter
}

// Fonction pour supprimer un élève
function deleteStudent(id, studentLi) {
    fetch(`/students/${id}`, {
        method: 'DELETE'
    }).then(() => {
        studentList.removeChild(studentLi);
    });
}

// Fonction pour réinitialiser les champs
function clearInputs() {
    document.getElementById('nameInput').value = '';
    document.getElementById('surnameInput').value = '';
    document.getElementById('genderInput').value = '';
    document.getElementById('courseInput').value = '';
    document.getElementById('matriculeInput').value = '';
    document.getElementById('dateInput').value = '';
}

// Récupérer les élèves au chargement de la page
fetchStudents();