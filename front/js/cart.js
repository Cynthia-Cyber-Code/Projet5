const productsInCart = JSON.parse(localStorage.getItem("products"));

let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");
let address = document.getElementById("address");
let city = document.getElementById("city");
let email = document.getElementById("email");

//Regex
let letterRegExp = new RegExp("^[a-zA-Z ,.'-]+$");
let addressRegExp = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[a-zA-Z ,.'-]{1,4}[-a-zA-Zàâäéèêëïîôöùûüç]+)+");
let emailRegExp = new RegExp("^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,3})$");

if (!productsInCart || productsInCart.length === 0) {
    showEmptyCart();
} else {
    fetch ("http://localhost:3000/api/products/")
    .then((res) => res.json())
    .then((all) => {
        let products = buildCompleteList(all, productsInCart);

        displayProducts(products);
        displayTotalQty(products);
        displayTotalPrice(products);
        listenForCartQty(products);
        deleteProduct();
        listenForFormInput();
        formSubmit();
    })
}

function showEmptyCart() {
    document.querySelector("h1").textContent = "Le panier est vide";
    document.querySelector(".cart").style.display = "none";
}

function buildCompleteList(all, productsInCart) {
    let list = [];

    productsInCart.forEach(productInCart => {

        const productFound = all.find(el => el._id == productInCart.id);
        let product = {
            id : productFound._id,
            price : productFound.price,
            name : productFound.name,
            description : productFound.description,
            imageUrl : productFound.imageUrl,
            alt : productFound.altTxt,
            qty : productInCart.qty,
            color : productInCart.color
        }
        console.log(product);
        list.push(product);
    });

    return list;
}

function displayProducts(products) {
    let html = ``;
    
    products.forEach(product => {
        html += `
            <article class="cart__item" data-id="${product.id}"data-color="${product.color}">
                <div class="cart__item__img">
                    <img src="${product.imageUrl}" alt="${product.altTxt}">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${product.name}</h2>
                        <p>${product.color}</p>
                        <p>${product.price} €</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                        <p>Qté : ${product.qty}</p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.qty}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                </div>
            </article>`
    })
    document.querySelector("#cart__items").innerHTML = html
}

//Vérification changement de quantité d'un article
function listenForCartQty(products) {
    const changeQuantity = document.querySelectorAll(".itemQuantity");
        
    changeQuantity.forEach(quantity => {
        quantity.addEventListener("change", (e) => {

            let qty = e.target.value;
            if (qty < 1) {
                alert("Merci de sélectionner une quantité supérieur à zéro");
                return;
            }
            let id = e.target.closest("article").getAttribute("data-id");
            let color = e.target.closest("article").getAttribute("data-color");
            console.log(id);

            let product = products.find(item => item.id == id && item.color == color && item.qty != qty);
            
            console.log(product.qty);
            console.log(qty);
            product.qty = Number(qty);

            localStorage.setItem("products", JSON.stringify(products));
            location.reload();
        });
    });
}

function displayTotalQty(products) {
    document.getElementById("totalQuantity").textContent = countTotalQty(products);
}

//calcul du nombre d'article
function countTotalQty(products) {
    let total = 0;

    products.forEach(product => {
        total = Number(total) + Number(product.qty)
    })
    return total;
}

function displayTotalPrice(products) {
    document.getElementById("totalPrice").textContent = countTotalPrice(products);
}

//calcul total des produits
function countTotalPrice(products) {
    let total = 0;
    
    products.forEach(product => {
        total = Number(total) + Number(product.qty) * Number(product.price)
    })
    return total;
}

//Suppression de l'élément
function deleteProduct() {
    let deleteItem = document.querySelectorAll(".deleteItem");
        
    deleteItem.forEach(delElement => {
        delElement.addEventListener("click", (e) =>  {
        let id = e.target.closest("article").getAttribute("data-id");
        let color = e.target.closest("article").getAttribute("data-color");

        // let product = products.find(item => item.id == id && item.color == color && item.qty != qty);
        let index = productsInCart.findIndex(item => item.id == id && item.color == color);
        console.log(index);
        productsInCart.splice(index, 1);

        localStorage.setItem('products', JSON.stringify(productsInCart));
        location.reload();
        });
    })
}

//formulaire 
//Prénom/Nom/Adresse/Ville/Email
function listenForFormInput() {
    let form = document.querySelector(".cart__order__form");

    form.firstName.addEventListener("input", function() {
        let firstNameErrorMsg = firstName.nextElementSibling;
        hideError(firstNameErrorMsg);
            
        if (!isFirstNameValid(firstName.value.trim()) || firstName.value.trim()== "") {
            showError("firstNameErrorMsg", "Veuillez renseigner un prénom correcte.");
        } 
        console.log(firstName.value.trim());
    });
    form.lastName.addEventListener("input", function() {
        let lastNameErrorMsg = lastName.nextElementSibling;
        hideError(lastNameErrorMsg);

        if (!isLastNameValid(lastName.value.trim()) || lastName.value.trim()== "") {
            showError("lastNameErrorMsg", "Veuillez renseigner un nom correcte.");
        }
    });
    form.address.addEventListener("input", function() {
        let addressErrorMsg = address.nextElementSibling;
        hideError(addressErrorMsg);

        if (!isAddressValid(address.value.trim())|| address.value.trim()== "") {
            showError("addressErrorMsg", "Veuillez renseigner une adresse correcte.");
        }
    });
    form.city.addEventListener("input", function() {
        let cityErrorMsg = city.nextElementSibling;
        hideError(cityErrorMsg);

        if (!isCityValid(city.value.trim())|| city.value.trim()== "") {
            showError("cityErrorMsg", "Veuillez renseigner un nom de ville correcte.");
        }
    });
    form.email.addEventListener("input", function() {
        let emailErrorMsg = email.nextElementSibling;
        hideError(emailErrorMsg);

        if (!isEmailValid(email.value.trim()) || email.value.trim()== "") {
            showError("emailErrorMsg", "Veuillez renseigner un email correcte.");
        }
    });
    
}

function isFirstNameValid(value){
    return (letterRegExp.test(value));
}
function isLastNameValid(value){
    return (letterRegExp.test(value));
}
function isAddressValid(value){
    return (addressRegExp.test(value));
}
function isCityValid(value){
    return (letterRegExp.test(value));
}
function isEmailValid(value){
    return (emailRegExp.test(value));
}

function showError(id, message) {
    document.getElementById(id).textContent = message;
}
function hideError(id){
    id.textContent = "";
}

function formSubmit() {
    let submit = document.getElementById("order");
    submit.addEventListener("click", (e) => {
        e.preventDefault();
        
        if (isFirstNameValid(firstName.value) && isLastNameValid(lastName.value) && isAddressValid(address.value) && isCityValid(city.value) && isEmailValid(email.value)) { 
            const productsId = productsInCart.map(item => item.id);
            console.log(productsId);

            //create fiche contact
            const payload = {
                contact: {
                    firstName : firstName.value,
                    lastName : lastName.value,
                    address : address.value,
                    city : city.value,
                    email : email.value
                },
                products: productsId
            }
            //Post envoie les données
            const dataOrder = {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: { 
                'Content-Type': 'application/json',
                }
            };
            //Get récupère les données
            fetch ("http://localhost:3000/api/products/order", dataOrder)
            .then((res) => res.json())
            .then((res) => {
                localStorage.clear();
                window.location.href="./confirmation.html?order=" + res.orderId;
                
            })
        } else {
            alert("Merci de bien renseigner la fiche contact correctement.");
            return;
        }
    });
}