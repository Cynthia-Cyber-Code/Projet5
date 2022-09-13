const id = getIdOrder();

function getIdOrder(){
    return new URL(window.location).searchParams.get("order");
}
//affichage de l'id de la commande
const orderId = document.getElementById("orderId");
orderId.textContent = id;
console.log(id);