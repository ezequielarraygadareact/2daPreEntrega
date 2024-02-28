document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM');
    document.querySelectorAll('.addToCartButton').forEach(button => {
        button.addEventListener('click', async function() {
            console.log('Agregar al Carrito');
            const pid = this.getAttribute('data-productid');
            console.log('Producto ID:', pid);
            try {
                const response = await fetch(`/cart/${cid}/${pid}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                console.log('Respuesta del servidor:', data);
                if (data.result === "success") {
                    console.log("Se ah agregado el producto al carro");
                } else {
                    console.error("No se ha podido agregar el producto al carro", data.message);
                    // Aquí puedes manejar el caso de que haya ocurrido un error al agregar el producto al carrito
                }
            } catch (error) {
                console.error('No se ha podido agregar el producto al carro', error);
            }
        });
    });
});