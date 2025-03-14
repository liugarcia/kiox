let ipfs, orbitdb, db;

// Inicializa IPFS e OrbitDB
async function init() {
    ipfs = await Ipfs.create();
    orbitdb = await OrbitDB.createInstance(ipfs);

    // Criar ou abrir o banco de dados (salvo no IPFS)
    db = await orbitdb.docstore('cadastro_clientes', { indexBy: '_id' });
    await db.load();

    console.log("Banco de dados iniciado:", db.address.toString());
    
    // Carregar clientes ao iniciar
    listarClientes();
}

// Cadastrar Cliente
async function cadastrarCliente(event) {
    event.preventDefault();
    
    let nome = document.getElementById("nome").value;
    let email = document.getElementById("email").value;

    if (!nome || !email) return alert("Preencha todos os campos!");

    let id = Date.now().toString(); // Criar um ID único

    // Adicionar ao OrbitDB
    await db.put({ _id: id, nome, email });

    listarClientes(); // Atualizar a lista

    document.getElementById("cadastroForm").reset();
}

// Listar Clientes
async function listarClientes() {
    let clientes = db.query(() => true); // Retorna todos os registros
    let lista = document.getElementById("listaClientes");
    lista.innerHTML = "";

    clientes.forEach(cliente => {
        let li = document.createElement("li");
        li.textContent = `${cliente.nome} - ${cliente.email}`;
        lista.appendChild(li);
    });
}

// Associa evento ao formulário
document.getElementById("cadastroForm").addEventListener("submit", cadastrarCliente);

// Inicializa OrbitDB
init();
