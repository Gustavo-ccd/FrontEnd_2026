const gruposInicial = [
    {
        titulo: '🅰️ Grupo A',
        selecoes: ['México', 'África do Sul', 'Coreia do Sul', 'República Tcheca'],
        fatos: 'O jogo de abertura será México x África do Sul. Confrontos entre Coreia do Sul e seleções europeias já ocorreram em várias Copas, com histórico equilibrado.',
    },
    {
        titulo: '🅱️ Grupo B',
        selecoes: ['Canadá', 'Suíça', 'Catar', 'Vaga Europeia (Bósnia)'],
        fatos: 'O Canadá joga em casa, fator importante de desempenho. Catar e Suíça já se enfrentaram recentemente em amistosos internacionais.',
    },
    {
        titulo: '🅲 Grupo C',
        selecoes: ['Brasil', 'Marrocos', 'Haiti', 'Escócia'],
        fatos: 'Brasil, Marrocos e Escócia já dividiram grupo em 1998. Brasil nunca perdeu para a Escócia em Copas.',
    },
];

const gruposAlternativos = [
    {
        titulo: '🅳 Grupo D',
        selecoes: ['Estados Unidos', 'Paraguai', 'Austrália', 'Turquia'],
        fatos: 'Os EUA jogam em casa, vantagem histórica em Copas. Austrália enfrenta frequentemente seleções sul-americanas em torneios.',
    },
    {
        titulo: '🅴 Grupo E',
        selecoes: ['Alemanha', 'Equador', 'Costa do Marfim', 'Curaçao'],
        fatos: 'Alemanha costuma dominar fases de grupos. Equador e Costa do Marfim têm estilos físicos semelhantes.',
    },
    {
        titulo: '🅵 Grupo F',
        selecoes: ['Holanda', 'Japão', 'Tunísia', 'Suécia'],
        fatos: 'Brasil, Marrocos e Escócia já dividiram grupo em 1998. Brasil nunca perdeu para a Escócia em Copas.',
    },
];

const apoioConteudo = document.getElementById('apoio-conteudo');
const tituloGrupos = document.getElementById('titulo-grupos');
let mostrandoAlternativo = false;

function renderizarGrupos(grupos) {
    apoioConteudo.innerHTML = grupos.map((grupo, indice) => `
    <div class="grupo" id="grupo-${indice + 1}">
      <h4>${grupo.titulo}</h4>
      <h5>Seleções</h5>
      <ul>
        ${grupo.selecoes.map(selecao => `<li>${selecao}</li>`).join('')}
      </ul>
      <details>
        <summary>Saiba mais</summary>
        <p>${grupo.fatos}</p>
      </details>
    </div>
  `).join('');
}

function proximo() {
    mostrandoAlternativo = !mostrandoAlternativo;
    renderizarGrupos(mostrandoAlternativo ? gruposAlternativos : gruposInicial);
    tituloGrupos.textContent = mostrandoAlternativo ? 'Grupos D, E e F' : 'Grupos A, B e C';
}

renderizarGrupos(gruposInicial);
