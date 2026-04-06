let arrayAlunos = JSON.parse(localStorage.getItem("lista"));
window.addEventListener('DOMContentLoaded', () => {
    let array = JSON.parse(localStorage.getItem("lista")) || [];
    updateAlunosLista(array);
        });


const formCadastro = document.getElementById("cadastroAluno");

formCadastro.addEventListener("submit", function (e) {
    e.preventDefault();


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
})

function updateAlunosLista(alunos){
    const grid = document.getElementById("listaAlunos")

    let status = "";

    

    if(alunos.length === 0){
        grid.innerHTML = '<p class="text-center"> Nenhum aluno registrado </p>';
        return;
    }

    grid.innerHTML = alunos.map((aluno, index) => {
        const status = aluno.nota >= 6 ? "aprovado" : "reprovado";

        return `
            <tr>
                <td>#${index + 1}</td>
                <td>${aluno.nome}</td>
                <td>${aluno.idade}</td>
                <td>${aluno.nota}</td>
                <td>
                    <span class="badge bg-${status === "aprovado" ? "success" : "danger"}">
                        ${status}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="removerAluno(${index})">
                        Remover
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}