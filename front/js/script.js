fetch("http://localhost:3000/api/products")
    .then(function(res) {
        if (res.ok) {
            console.log("réussie")
            
            return res.json();
        }
    })
    .then(function(products) {
        products.forEach(product => {
            let productId = document.createElement("a");
            document.querySelector(".items").appendChild(productId);
            productId.href = `product.html?id=${product._id}`;

        //creation article du produit
        let productCard = document.createElement("article");
            productId.appendChild(productCard);

        //creation img
        let productImg = document.createElement("img");
            productCard.appendChild(productImg);
            productImg.src = product.imageUrl;
            productImg.alt = product.altTxt;
            
        //creation h3 avec nom produit
        let productName = document.createElement("h3");
            productCard.appendChild(productName);
            productName.textContent = product.name;

        //creation p avec description produit
        let productDescription = document.createElement("p");
            productCard.appendChild(productDescription);
            productDescription.textContent = product.description;
                
            console.log("produit ajouté " + product._id);
        })
    })
    .catch(function(err) {
        console.log("erreur")
    });