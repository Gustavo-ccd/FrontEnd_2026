function add() {
    const cardsContainer = document.getElementById('Cards');
    if (!cardsContainer) return;

    const btn = document.querySelector('button[onclick="add()"]');
    if (btn) btn.disabled = true;

    const novoCard = document.createElement('div');
    novoCard.className = 'card card-entrada';
    novoCard.style.width = '22rem';

    novoCard.innerHTML = `
        <img src="img/Lucas_Paqueta.webp" class="card-img-top" alt="Lucas Paquetá">
        <div class="card-body">
            <h5 class="card-title">
                <span>Lucas Tolentino Coelho de Lima</span>
                <span class="badge text-bg-secondary">8,8</span>
            </h5>
            <p class="card-text">
                <span><strong>Nascimento:</strong> 27/08/1997 (28 anos)</span><br>
                <span><strong>Altura:</strong> 1,80 m</span><br>
                <span><strong>Posição:</strong> Meio-campista</span>
            </p>
        </div>
    `;

    cardsContainer.appendChild(novoCard);
}