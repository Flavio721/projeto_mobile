window.addEventListener('DOMContentLoaded', () => {
    let array = JSON.parse(localStorage.getItem("lista")) || [];
    updateAlunosLista(array);
        });


const formCadastro = document.getElementById("cadastroAluno");

formCadastro.addEventListener("submit", function (e) {
    e.preventDefault();

    let arrayAlunos = JSON.parse(localStorage.getItem("lista")) || [];


    const nome = document.getElementById("nome").value.trim();
    const idade = document.getElementById("idade").value;
    const notaCampo = document.getElementById("nota").value;

    const nota = parseFloat(notaCampo)

    if(!nome || !idade || !nota){
        alert("Campos obrigatórios vazios!");
        return;
    }

    if(idade <= 0){
        alert("Idade inválida!");
        return
    }
    if(nota > 10 || nota < 0){
        alert("Nota inválida!");
        return;
    }

    const objetoAluno = {
        nome: nome,
        idade: idade,
        nota: nota
    };

    arrayAlunos.push(objetoAluno);
    localStorage.setItem("lista", JSON.stringify(arrayAlunos));
    updateAlunosLista(arrayAlunos)

    let modal = bootstrap.Modal.getInstance(document.getElementById("modalCadastro"));
    modal.hide();
})

function updateAlunosLista(alunos){
    const grid = document.getElementById("listaAlunos")

    let status = "";

    

    if(alunos.length === 0){
        grid.innerHTML = '<p class="text-center"> Nenhum aluno registrado </p>';
        return;
    }

    grid.innerHTML = alunos.map((aluno, index) => {
        const status = aluno.nota >= 6 ? "Aprovado" : "Reprovado";

        return `
            <tr>
                <td>#${index + 1}</td>
                <td>${aluno.nome}</td>
                <td>${aluno.idade}</td>
                <td>${aluno.nota}</td>
                <td>
                    <span class="badge bg-${status === "Aprovado" ? "success" : "danger"}">
                        ${status}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="removerAluno(${index})">
                        Remover
                    </button>
                    <button class="btn btn-sm btn-primary" style="margin-left: 10px;" onclick="detalhesAluno(${index})">
                        Detalhes
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function removerAluno(index){
    let alunos = JSON.parse(localStorage.getItem("lista")); // Pega lista salva no localstorage

    alunos.splice(index, 1); // Remove o item que está na posição que recebeu como parâmetro
    
    localStorage.setItem("lista", JSON.stringify(alunos)); // Atualiza o localstorage

    updateAlunosLista(alunos); // Realiza o update da lista visual
}

function detalhesAluno(indexAluno){
    let alunos = JSON.parse(localStorage.getItem("lista")) || []; // Pega lista de alunos

    let aluno = alunos[indexAluno]; // Pega aluno que está registrado no indice recebido pelo parâmetro
    if(!aluno) return; // Se não tiver aluno encerra a função

    let status = aluno.nota >= 6 ? "Aprovado" : "Reprovado"; // Gera o status do aluno conforme sua nota

    // Cria uma variável para registrar o html das infos do aluno
    let html = `
        <tr>
            <td>#${indexAluno + 1}</td>
            <td>${aluno.nome}</td>
            <td>${aluno.idade}</td>
            <td>${aluno.nota}</td>
            <td>
                <span class="badge bg-${status === "Aprovado" ? "success" : "danger"}">
                    ${status}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="removerAluno(${indexAluno})">
                    Remover
                </button>
            </td>
        </tr>
    `;

    document.getElementById("detalhesAluno").innerHTML = html; // Insere o HTML na tabela do modal

    // Abre o modal (Bootstrap 5)
    let modal = new bootstrap.Modal(document.getElementById("modalDetalhes")); // Abre o modal
    modal.show();
}