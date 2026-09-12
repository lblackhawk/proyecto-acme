const form = document.getElementById("productForm");
const nameInput = document.getElementById("productName");
const priceInput = document.getElementById("productPrice");
// Solo buscamos el botón si el formulario existe en la página
const submitButton = form ? form.querySelector("button") : null; 
const tableBody = document.querySelector("#productsTable tbody");

const STORAGE_KEY = "products";
let editingIndex = null; 


function validateFields() {
    if (nameInput.value.trim() === "") {
        alert("El nombre del producto es obligatorio");
        nameInput.focus();
        return false;
    }

    if (priceInput.value.trim() === "") {
        alert("El precio es obligatorio");
        priceInput.focus();
        return false;
    }

    if (parseFloat(priceInput.value) <= 0) {
        alert("El precio debe ser mayor a 0");
        priceInput.focus();
        return false;
    }
    return true;
}


function saveProducts(products) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}


function getProducts() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}


function addProduct(name, price) {
    const products = getProducts();
    products.push({
        name: name,
        price: price
    });
    saveProducts(products);
}


function updateProduct(index, name, price) {
    const products = getProducts();
    products[index] = {
        name: name,
        price: price
    };
    saveProducts(products);
}


function deleteProduct(index) {
    const products = getProducts();
    products.splice(index, 1);
    saveProducts(products);
    renderProducts(); 
}


function createRow(name, price, index) {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = name;
    
    const priceCell = document.createElement("td");
    priceCell.textContent = "$ " + parseFloat(price).toFixed(2);

    const actionCell = document.createElement("td");

    const editButton = document.createElement("button");
    editButton.textContent = "Editar";
    // Vinculamos la acción de editar
    editButton.onclick = function() {
        nameInput.value = name;
        priceInput.value = price;
        editingIndex = index;
        submitButton.textContent = "Guardar";
    };

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar";
    deleteButton.onclick = function() {
        deleteProduct(index);
    };

    actionCell.appendChild(editButton);
    actionCell.appendChild(deleteButton);

    row.appendChild(nameCell);
    row.appendChild(priceCell);
    row.appendChild(actionCell);

    return row;
}


function renderProducts() {
    if (!tableBody) return; 

    tableBody.innerHTML = "";
    const products = getProducts();

    products.forEach(function(product, index) {
        const row = createRow(
            product.name,
            product.price,
            index
        );
        tableBody.appendChild(row);
    });
}

if (form) {
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        if (!validateFields()) {
            return;
        }

        const name = nameInput.value.trim();
        const price = priceInput.value.trim();

        if (editingIndex !== null) {
            updateProduct(editingIndex, name, price);
            editingIndex = null;
            submitButton.textContent = "Guardar producto";
        } else {
            addProduct(name, price);
        }

        alert("¡Producto guardado exitosamente!");
        
        window.location.href = "productos.html"; 
    });
}

