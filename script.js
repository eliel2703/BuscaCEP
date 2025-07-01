document.addEventListener('DOMContentLoaded', function() {
    const cepInput = document.getElementById('cep');
    const nomeInput = document.getElementById('nome');
    const logradouroInput = document.getElementById('logradouro');
    const complementoInput = document.getElementById('complemento');
    const bairroInput = document.getElementById('bairro');
    const localidadeInput = document.getElementById('localidade');
    const ufInput = document.getElementById('uf');
    const salvarBtn = document.getElementById('salvar');
    const limparBtn = document.getElementById('limpar');
    const listaEnderecos = document.getElementById('lista-enderecos');

    carregarEnderecos();

    function limparCampos() {
        logradouroInput.value = '';
        complementoInput.value = '';
        bairroInput.value = '';
        localidadeInput.value = '';
        ufInput.value = '';
    }

    function preencherCampos(data) {
        logradouroInput.value = data.logradouro || '';
        complementoInput.value = data.complemento || '';
        bairroInput.value = data.bairro || '';
        localidadeInput.value = data.localidade || '';
        ufInput.value = data.uf || '';
    }

    function mostrarErro() {
        limparCampos();
        alert('CEP não encontrado ou formato inválido');
    }

    function consultarCEP(cep) {
        limparCampos();
        
        if (cep.length !== 8 || !/^\d+$/.test(cep)) {
            mostrarErro();
            return;
        }

        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (data.erro) {
                    mostrarErro();
                } else {
                    preencherCampos(data);
                }
            })
            .catch(() => mostrarErro());
    }

    function salvarEndereco() {
        const nome = nomeInput.value.trim();
        const cep = cepInput.value;
        
        if (!nome) {
            alert('Por favor, digite seu nome completo');
            return;
        }
        
        if (cep.length !== 8 || !logradouroInput.value) {
            alert('Por favor, consulte um CEP válido primeiro');
            return;
        }
        
        const endereco = {
            nome,
            cep,
            logradouro: logradouroInput.value,
            complemento: complementoInput.value,
            bairro: bairroInput.value,
            localidade: localidadeInput.value,
            uf: ufInput.value,
            data: new Date().toLocaleString()
        };
        
        const enderecos = JSON.parse(localStorage.getItem('enderecos') || '[]');
        
        enderecos.push(endereco);
        
        localStorage.setItem('enderecos', JSON.stringify(enderecos));
    
        carregarEnderecos();
        
        alert('Endereço salvo com sucesso!');
    }

    function carregarEnderecos() {
        const enderecos = JSON.parse(localStorage.getItem('enderecos') || '[]');
        listaEnderecos.innerHTML = '';
        
        if (enderecos.length === 0) {
            listaEnderecos.innerHTML = '<p>Nenhum endereço salvo ainda.</p>';
            return;
        }
        
        enderecos.forEach((endereco, index) => {
            const enderecoDiv = document.createElement('div');
            enderecoDiv.className = 'endereco-item';
            enderecoDiv.innerHTML = `
                <h3>${endereco.nome}</h3>
                <p><strong>CEP:</strong> ${endereco.cep}</p>
                <p><strong>Endereço:</strong> ${endereco.logradouro} ${endereco.complemento}</p>
                <p><strong>Bairro:</strong> ${endereco.bairro}</p>
                <p><strong>Cidade/UF:</strong> ${endereco.localidade}/${endereco.uf}</p>
                <p><small>Salvo em: ${endereco.data}</small></p>
            `;
            listaEnderecos.appendChild(enderecoDiv);
        });
    }

    function limparLista() {
        if (confirm('Tem certeza que deseja limpar todos os endereços salvos?')) {
            localStorage.removeItem('enderecos');
            carregarEnderecos();
        }
    }

    cepInput.addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '');
        
        if (this.value.length === 8) {
            consultarCEP(this.value);
        } else if (this.value.length > 8) {
            this.value = this.value.slice(0, 8);
        }
    });

    salvarBtn.addEventListener('click', salvarEndereco);
    limparBtn.addEventListener('click', limparLista);
});