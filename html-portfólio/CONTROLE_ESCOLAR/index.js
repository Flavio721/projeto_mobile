let arrayAlunos = [];

const formCadastro = document.getElementById("cadastroAluno");

formCadastro.addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const idade = document.getElementById("idade").value;
    const nota = document.getElementById("nota").value;

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
})

function updateAlunosLista(alunos){
    const grid = document.getElementById("listaAlunos")

    if(alunos.length === 0){
        grid.innerHTML = '<p class="text-center"> Nenhum aluno registrado </p>';
        return;
    }

    grid.innerHTML = alunos.map(aluno => `
        <div class="divAluno">
            <h2> ${aluno.nome} </h2>
            <p> Idade: ${aluno.idade}
            <p> Nota: ${aluno.nota}
    </div>`);
}