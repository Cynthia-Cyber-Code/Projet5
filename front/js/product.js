const id = getId();

fetch ("http://localhost:3000/api/products/" + id)
    .then((res) => res.json())
    .then((product) => {
        display(product);
        listenForCartAddition();
    })

function display(product){
    //create class item__img
    let productImg = document.createElement("img");
    document.querySelector(".item__img").appendChild(productImg);
    productImg.src = product.imageUrl;
    productImg.alt = product.altTxt;

    //ajout id title
    let productName = product.name;
    document.getElementById("title").textContent = productName;

    //ajout id Price
    let productPrice = product.price;
    document.getElementById("price").textContent = productPrice;

    //ajout id description
    let productDescription = product.description;
    document.getElementById("description").textContent = productDescription;

    //ajout nom doc
    document.title = productName;

    //ajout id colors
    let data = product.colors;
    console.log(data);

    for (let numColors=0; numColors < product.colors.length; numColors++) {
        let color = document.createElement("option");
        color.setAttribute("value", product.colors[numColors]);
        document.getElementById("colors").appendChild(color);
        color.textContent = product.colors[numColors];
    }
}

function getId(){
    return new URL(window.location).searchParams.get("id");
}

function isValid() {
    const color = document.getElementById("colors").value
    const qty = document.getElementById("quantity").value
    return (color.length > 0) && (qty > 0)
}

//Vérification des valeurs de quantité et de couleur
function listenForCartAddition() {
    document.getElementById("addToCart").addEventListener("click", () =>  {
        if (!isValid()) {
            alert("Merci de sélectionner une couleur et une quantité.");
            return;
        }

        let products = [];
        const qty = document.getElementById("quantity").value;
        const color = document.getElementById("colors").value;

        if (localStorage.getItem("products")) {

            products = JSON.parse(localStorage.getItem("products"));

            let product = products.find(item => item.id == id && item.color == color);

            if (product) {
                product.qty = Number(product.qty) + Number(qty);
            } else {
                products.push({
                    id: id, 
                    qty: qty, 
                    color: color
                });
            }
        } else {
            products.push({
                id: id,
                qty: qty,
                color: color
            });
        }
        localStorage.setItem("products", JSON.stringify(products));

        alert("Merci à vous. Vous serez redirigé sur la page d'acceuil mais vous pouvez retrouver votre commande dans panier.");
        window.location.href="./index.html";
    })
}