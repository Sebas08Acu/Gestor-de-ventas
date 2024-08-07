// Variables globales
const salesSection = document.getElementById('sales-section');
const paymentsSection = document.getElementById('payments-section');
const toggleButton = document.getElementById('toggle-button');
const userForm = document.getElementById('user-form');
const paymentForm = document.getElementById('payment-form');
const salesTableBody = document.getElementById('sales-table-body');
const paymentsTableBody = document.getElementById('payments-table-body');
const editModal = document.getElementById('edit-modal');
const confirmDeleteModal = document.getElementById('confirm-delete-modal');
const editForm = document.getElementById('edit-form');

// Mostrar la pantalla de bienvenida y ocultar el contenido principal
document.getElementById('start-button').addEventListener('click', function() {
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('content').style.display = 'block';
});

// Alternar entre secciones de ventas y apartados
toggleButton.addEventListener('click', function() {
    if (salesSection.style.display === 'none') {
        salesSection.style.display = 'block';
        paymentsSection.style.display = 'none';
        toggleButton.textContent = 'Agregar Apartados';
    } else {
        salesSection.style.display = 'none';
        paymentsSection.style.display = 'block';
        toggleButton.textContent = 'Agregar Ventas';
    }
});

// Agregar ventas
userForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const product = document.getElementById('product').value;
    const price = document.getElementById('price').value;
    const date = document.getElementById('date').value;
    const image = document.getElementById('image').files[0];
    const comment = document.getElementById('comment').value;
    
    const row = salesTableBody.insertRow();
    row.insertCell().textContent = name;
    row.insertCell().textContent = product;
    row.insertCell().textContent = price;
    row.insertCell().textContent = date;
    row.insertCell().innerHTML = image ? `<img src="${URL.createObjectURL(image)}" class="table-img" />` : '';
    row.insertCell().textContent = comment;
    
    const actionsCell = row.insertCell();
    actionsCell.innerHTML = `<button onclick="editRow(this)">Editar</button> <button onclick="confirmDelete(this)">Eliminar</button>`;
    
    userForm.reset();
    saveData();
});

// Agregar apartados
paymentForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('payment-name').value;
    const product = document.getElementById('payment-product').value;
    const amount = document.getElementById('payment-amount').value;
    const date = document.getElementById('payment-date').value;
    const image = document.getElementById('payment-image').files[0];
    const comment = document.getElementById('payment-comment').value;
    
    const row = paymentsTableBody.insertRow();
    row.insertCell().textContent = name;
    row.insertCell().textContent = product;
    row.insertCell().textContent = amount;
    row.insertCell().textContent = date;
    row.insertCell().innerHTML = image ? `<img src="${URL.createObjectURL(image)}" class="table-img" />` : '';
    row.insertCell().textContent = comment;
    
    const actionsCell = row.insertCell();
    actionsCell.innerHTML = `<button onclick="editRow(this)">Editar</button> <button onclick="confirmDelete(this)">Eliminar</button>`;
    
    paymentForm.reset();
    saveData();
});

// Editar fila
function editRow(button) {
    const row = button.closest('tr');
    const cells = row.getElementsByTagName('td');
    
    document.getElementById('edit-name').value = cells[0].textContent;
    document.getElementById('edit-product').value = cells[1].textContent;
    document.getElementById('edit-price').value = cells[2].textContent;
    document.getElementById('edit-date').value = cells[3].textContent;
    document.getElementById('edit-comment').value = cells[5].textContent;
    
    document.getElementById('edit-row-index').value = Array.from(row.parentNode.children).indexOf(row);
    
    editModal.style.display = 'block';
}

// Guardar cambios en la edición
editForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const index = document.getElementById('edit-row-index').value;
    const row = salesSection.style.display === 'block' ? salesTableBody.children[index] : paymentsTableBody.children[index];
    
    row.cells[0].textContent = document.getElementById('edit-name').value;
    row.cells[1].textContent = document.getElementById('edit-product').value;
    row.cells[2].textContent = document.getElementById('edit-price').value;
    row.cells[3].textContent = document.getElementById('edit-date').value;
    row.cells[5].textContent = document.getElementById('edit-comment').value;
    
    closeModal();
    saveData();
});

// Confirmar eliminación
function confirmDelete(button) {
    const modal = document.getElementById('confirm-delete-modal');
    const table = document.querySelector(salesSection.style.display === 'block' ? '#sales-table-body' : '#payments-table-body');
    const row = button.closest('tr');
    const index = Array.from(row.parentNode.children).indexOf(row);
    
    document.getElementById('confirm-delete-btn').onclick = () => {
        table.deleteRow(index);
        saveData();
        closeDeleteModal();
    };
    
    document.getElementById('cancel-delete-btn').onclick = closeDeleteModal;
    
    modal.style.display = 'block';
}

function closeDeleteModal() {
    document.getElementById('confirm-delete-modal').style.display = 'none';
}

// Cerrar el modal de edición
function closeModal() {
    editModal.style.display = 'none';
}

// Guardar datos en Local Storage
function saveData() {
    const salesData = [];
    salesTableBody.querySelectorAll('tr').forEach(row => {
        const cells = row.querySelectorAll('td');
        salesData.push({
            name: cells[0].textContent,
            product: cells[1].textContent,
            price: cells[2].textContent,
            date: cells[3].textContent,
            image: cells[4].querySelector('img') ? cells[4].querySelector('img').src : '',
            comment: cells[5].textContent
        });
    });
    localStorage.setItem('sales', JSON.stringify(salesData));

    const paymentsData = [];
    paymentsTableBody.querySelectorAll('tr').forEach(row => {
        const cells = row.querySelectorAll('td');
        paymentsData.push({
            name: cells[0].textContent,
            product: cells[1].textContent,
            amount: cells[2].textContent,
            date: cells[3].textContent,
            image: cells[4].querySelector('img') ? cells[4].querySelector('img').src : '',
            comment: cells[5].textContent
        });
    });
    localStorage.setItem('payments', JSON.stringify(paymentsData));
}

// Cargar datos desde Local Storage al iniciar
document.addEventListener('DOMContentLoaded', function() {
    const savedSales = JSON.parse(localStorage.getItem('sales')) || [];
    const savedPayments = JSON.parse(localStorage.getItem('payments')) || [];
    
    savedSales.forEach(item => {
        const row = salesTableBody.insertRow();
        row.insertCell().textContent = item.name;
        row.insertCell().textContent = item.product;
        row.insertCell().textContent = item.price;
        row.insertCell().textContent = item.date;
        row.insertCell().innerHTML = item.image ? `<img src="${item.image}" class="table-img" />` : '';
        row.insertCell().textContent = item.comment;
        const actionsCell = row.insertCell();
        actionsCell.innerHTML = `<button onclick="editRow(this)">Editar</button> <button onclick="confirmDelete(this)">Eliminar</button>`;
    });
    
    savedPayments.forEach(item => {
        const row = paymentsTableBody.insertRow();
        row.insertCell().textContent = item.name;
        row.insertCell().textContent = item.product;
        row.insertCell().textContent = item.amount;
        row.insertCell().textContent = item.date;
        row.insertCell().innerHTML = item.image ? `<img src="${item.image}" class="table-img" />` : '';
        row.insertCell().textContent = item.comment;
        const actionsCell = row.insertCell();
        actionsCell.innerHTML = `<button onclick="editRow(this)">Editar</button> <button onclick="confirmDelete(this)">Eliminar</button>`;
    });
});
