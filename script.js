document.addEventListener('DOMContentLoaded', function() {
    const cepInput = document.getElementById('cep');
    const logradouroInput = document.getElementById('logradouro');
    const complementoInput = document.getElementById('complemento');
    const bairroInput = document.getElementById('bairro');
    const localidadeInput = document.getElementById('localidade');
    const ufInput = document.getElementById('uf');

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

    cepInput.addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '');
        
        if (this.value.length === 8) {
            consultarCEP(this.value);
        } else if (this.value.length > 8) {
            this.value = this.value.slice(0, 8);
        }
    });
});