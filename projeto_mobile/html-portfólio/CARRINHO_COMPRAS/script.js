// Função para atualizar carrinho toda vez que a página for carregada
window.addEventListener('DOMContentLoaded', () => {
    let array = JSON.parse(localStorage.getItem("lista")) || [];
    updateCarrinho(array);
});

function addToCart(name, price){

    let carrinho =
        JSON.parse(localStorage.getItem("lista")) || []; // Pega valor salvo no localstorage, caso esteja vazio cria uma lista vazia

    // Procura produto existente
    let produtoExistente =
        carrinho.find(item => item.nome === name);

    if(produtoExistente){

        produtoExistente.qtd += 1;

    } else {

        let produto = {
            nome: name,
            preco: price,
            qtd: 1
        };

        carrinho.push(produto);
    }

    localStorage.setItem(
        "lista",
        JSON.stringify(carrinho)
    ); // Atualiza valor da lista

    updateCarrinho(carrinho); // Chama a função para atualizar o carrinho visualmente
}

function updateCarrinho(lista){

    const cartItems =
        document.getElementById('cartItems'); // Elemento HTML em que entrará todos os itens do carrinho

    const cartCount =
        document.getElementById('cart-count'); // Elemento HTML que representa a contagem de itens no carrinho

    const cartTotal =
        document.getElementById('cartTotal'); // Elemento HTML que exibirá o valor total

    cartItems.innerHTML = '';

    let total = 0;
    let quantidadeTotal = 0;

    lista.forEach((item, index) => {

        let subtotal = item.preco * item.qtd; // Total de cada produto, considerando a quantidade adiconado no carrinho

        total += subtotal; // Total de todo o carrinho

        quantidadeTotal += item.qtd; // Quantidade de cada produto salvo no carrinho

        cartItems.innerHTML += `
        <div class="cart-item">

            <div class="cart-item-info">

                <span>
                    ${item.nome}
                    (${item.qtd}x)
                </span>

                <strong>
                    R$ ${subtotal.toFixed(2)}
                </strong>

            </div>

            <button class="cancel-btn"
                onclick="removeItem(${index})">
                Remover
            </button>

        </div>`;
    });

    if(lista.length === 0){
        cartItems.innerHTML =
            '<p>Seu carrinho está vazio.</p>';
    } // Se a lista estiver vazia, exibirá esta mensagem

    cartCount.innerText = quantidadeTotal; // Contador de produtos do carrinho

    cartTotal.innerText =
        total.toFixed(2); // Valor total do carrinho
}
// Função para abrir o carrinho
function toggleCart(){
      document.getElementById('cartSidebar')
        .classList.toggle('open');
}

function removeItem(index){

    let carrinho =
        JSON.parse(localStorage.getItem("lista")) || [];

    // Se tiver mais de um do mesmo produto no carrinho, removerá apenas um, caso tenha um apenas, será excluido da lista
    if(carrinho[index].qtd > 1){

        carrinho[index].qtd -= 1;

    } else {

        carrinho.splice(index, 1);
    }

    localStorage.setItem(
        "lista",
        JSON.stringify(carrinho)
    ); // Atualiza a lista no localstorage

    updateCarrinho(carrinho); // Chama a função para atualizar o carrinho visualmente
}
function removerItems(){
    localStorage.removeItem("lista"); // Remove a lista salva no localstorage

    let carrinho = []; // Cria uma lista vazia

    updateCarrinho(carrinho) // Atualiza o carrinho visualmente, agora vazio
}

function setFilter(){
    const priceSelect = document.getElementById('priceFilter').value; // Valor selecionado no filtro de preço
    const categorySelect = document.getElementById('categoryFilter').value; // Valor selecionado no filtro de categoria

    // Se os dois estiverem vazios, retorna o alert apenas
    if(!priceSelect && !categorySelect){
        alert("Selecione uma das opções do filtro");
        return;
    } 

    let products = document.querySelectorAll(".product-card"); // Pega todos os elementos registrados no catálogo

    products.forEach(produto => {
        const preco = parseFloat(produto.dataset.price); // Valor do dataset.price 

        const categoria = produto.dataset.category; // Valor do dataset.category

        let mostar = true; // Variável para definir se mostra ou não o produto

        // Se o priceSelect foi selecionado, cria a verificação
        if(priceSelect){
            if(parseFloat(priceSelect) < preco){
                mostar = false;
            }
        }

        // Se o categorySelect foi selecionado, cria a verificação
        if(categorySelect){
            if(categoria !== categorySelect){
                mostar = false;
            }
        }

        produto.style.display = mostar ? 'block' : 'none'; // Define se irá mostrar o produto conforme o valor da variável de verificação
    })
}

function clearFilters(){
    let products = document.querySelectorAll('.product-card');

    products.forEach(produto => {
        produto.style.display = 'block'; // Mostra todos os itens

        const priceSelect = document.getElementById('priceFilter');
        const categorySelect = document.getElementById('categoryFilter');

        // Reinicia o valor dos select
        priceSelect.value = '';
        categorySelect.value = '';
    })
}