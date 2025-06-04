import { buscarSetores, buscarModelos, cadastrarColaborador, cadastrarChip, cadastrarCelular } from './api.js';

// Referências dos elementos
const form = document.getElementById('cadastroForm');
const nomeInput = document.getElementById('nome');
const cpfInput = document.getElementById('cpf');
const setorSelect = document.getElementById('setor');
const modeloSelect = document.getElementById('modelo');
const numCorporativoInput = document.getElementById('num-corporativo');
const checkboxTermos = document.getElementById('termos');
const btnDownload = document.getElementById('downloadTermos');
const btnCadastrar = document.getElementById('btnCadastrar');
const setorError = document.getElementById('setor-error');
const modeloError = document.getElementById('modelo-error');
const modal = document.getElementById('modalTermos');
const modalSucesso = document.getElementById('modalSucesso');
const modalErro = document.getElementById('modalErro');
const btnOpen = document.getElementById('openTermos');
const btnClose = document.querySelector('.btn-close');
const span = document.querySelector('.close');

// Referências dos novos elementos
const possuiAparelhoRadios = document.getElementsByName('possui_aparelho');
const possuiNumeroRadios = document.getElementsByName('possui_numero');
const modeloContainer = document.getElementById('modelo-container');
const numeroContainer = document.getElementById('numero-container');

// Referências dos elementos
const modalCamposFaltantes = document.getElementById('modalCamposFaltantes');
const listaCamposFaltantes = document.getElementById('lista-campos-faltantes');

// Função para validar todos os campos
function validarTodosCampos() {
  const nome = nomeInput.value.trim();
  const cpf = cpfInput.value.trim();
  const setor = setorSelect.value;
  const possuiAparelho = document.querySelector('input[name="possui_aparelho"]:checked').value === 'sim';
  const possuiNumero = document.querySelector('input[name="possui_numero"]:checked').value === 'sim';
  const modelo = modeloSelect.value;
  const numCorporativo = numCorporativoInput.value.trim();
  const termosAceitos = checkboxTermos.checked;

  const camposFaltantes = [];
  
  if (!nome) camposFaltantes.push('Nome');
  if (!cpf) camposFaltantes.push('CPF');
  if (!setor) camposFaltantes.push('Setor');
  if (possuiAparelho && !modelo) camposFaltantes.push('Modelo do aparelho');
  if (possuiNumero && !numCorporativo) camposFaltantes.push('Número corporativo');
  if (!termosAceitos) camposFaltantes.push('Aceite dos termos e condições');

  return {
    valido: camposFaltantes.length === 0,
    camposFaltantes
  };
}

// Função para mostrar mensagem de alerta
function mostrarAlerta(camposFaltantes) {
    listaCamposFaltantes.innerHTML = '';
    camposFaltantes.forEach(campo => {
        const li = document.createElement('li');
        li.textContent = campo;
        listaCamposFaltantes.appendChild(li);
    });
    
    modalCamposFaltantes.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Função para validar CPF
function validarCPF(cpf) {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/\D/g, '');

    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    // Validação do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = soma % 11;
    let digitoVerificador1 = resto < 2 ? 0 : 11 - resto;
    if (digitoVerificador1 !== parseInt(cpf.charAt(9))) return false;

    // Validação do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = soma % 11;
    let digitoVerificador2 = resto < 2 ? 0 : 11 - resto;
    if (digitoVerificador2 !== parseInt(cpf.charAt(10))) return false;

    return true;
}

// Função para formatar CPF
function formatarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length <= 11) {
        cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cpf;
}

// Função para validar número de telefone
function validarTelefone(numero) {
    // Remove caracteres não numéricos
    numero = numero.replace(/\D/g, '');

    // Verifica se tem 11 dígitos (formato celular com DDD)
    if (numero.length !== 11) return false;

    // Verifica se começa com dígitos válidos de DDD (10-99)
    const ddd = parseInt(numero.substring(0, 2));
    if (ddd < 11 || ddd > 99) return false;

    // Verifica se o terceiro dígito é 9 (padrão de celular)
    if (numero.charAt(2) !== '9') return false;

    return true;
}

// Função para formatar número de telefone
function formatarTelefone(numero) {
    numero = numero.replace(/\D/g, '');
    if (numero.length <= 11) {
        numero = numero.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return numero;
}

// Evento de input para CPF
cpfInput.addEventListener('input', function() {
    let valor = this.value.replace(/\D/g, '');
    const errorElement = document.getElementById('cpf-error');
    
    // Limita a 11 dígitos
    if (valor.length > 11) {
        valor = valor.slice(0, 11);
    }

    // Atualiza o valor formatado
    this.value = valor;

    // Validação em tempo real
    if (valor.length === 11) {
        if (validarCPF(valor)) {
            this.classList.remove('invalid');
            this.classList.add('valid');
            errorElement.style.display = 'none';
        } else {
            this.classList.remove('valid');
            this.classList.add('invalid');
            errorElement.textContent = 'CPF inválido';
            errorElement.style.display = 'block';
        }
    } else if (valor.length > 0) {
        this.classList.remove('valid');
        this.classList.add('invalid');
        errorElement.textContent = 'CPF deve ter 11 dígitos';
        errorElement.style.display = 'block';
    } else {
        this.classList.remove('valid', 'invalid');
        errorElement.style.display = 'none';
    }
});

// Evento de input para número corporativo
numCorporativoInput.addEventListener('input', function() {
    let valor = this.value.replace(/\D/g, '');
    const errorElement = document.getElementById('num-error');
    
    // Limita a 11 dígitos
    if (valor.length > 11) {
        valor = valor.slice(0, 11);
    }

    // Atualiza o valor formatado
    this.value = valor;

    // Só valida se o checkbox estiver marcado
    if (document.querySelector('input[name="possui_numero"]:checked').value === 'sim') {
        if (valor.length === 11) {
            if (validarTelefone(valor)) {
                this.classList.remove('invalid');
                this.classList.add('valid');
                errorElement.style.display = 'none';
            } else {
                this.classList.remove('valid');
                this.classList.add('invalid');
                errorElement.textContent = 'Número de telefone inválido';
                errorElement.style.display = 'block';
            }
        } else if (valor.length > 0) {
            this.classList.remove('valid');
            this.classList.add('invalid');
            errorElement.textContent = 'O número deve ter 11 dígitos';
            errorElement.style.display = 'block';
        } else {
            this.classList.remove('valid', 'invalid');
            errorElement.style.display = 'none';
        }
    }
});

// Controle do checkbox dos termos
checkboxTermos.addEventListener('change', function() {
  btnCadastrar.disabled = !this.checked;
  document.getElementById('termos-error').style.display = this.checked ? 'none' : 'block';
});

// Controle de visibilidade do modelo de aparelho
possuiAparelhoRadios.forEach(radio => {
    radio.addEventListener('change', function() {
        const mostrarModelo = this.value === 'sim';
        modeloContainer.style.display = mostrarModelo ? 'block' : 'none';
        modeloSelect.required = mostrarModelo;
        if (!mostrarModelo) {
            modeloSelect.value = '';
            document.getElementById('modelo-error').style.display = 'none';
        }
    });
});

// Controle de visibilidade do número corporativo
possuiNumeroRadios.forEach(radio => {
    radio.addEventListener('change', function() {
        const mostrarNumero = this.value === 'sim';
        numeroContainer.style.display = mostrarNumero ? 'block' : 'none';
        numCorporativoInput.required = mostrarNumero;
        if (!mostrarNumero) {
            numCorporativoInput.value = '';
            document.getElementById('num-error').style.display = 'none';
            numCorporativoInput.classList.remove('valid', 'invalid');
        }
    });
});

// Carregar dados dos selects ao iniciar a página
async function carregarDados() {
    try {
        const setores = await buscarSetores();
        setores.forEach(setor => {
            const option = document.createElement('option');
            option.value = setor.id;
            option.textContent = setor.nome;
            setorSelect.appendChild(option);
        });

        const modelos = await buscarModelos();
        modelos.forEach(modelo => {
            const option = document.createElement('option');
            option.value = modelo.id;
            option.textContent = `${modelo.marca} - ${modelo.modelo}`;
            modeloSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        alert('Erro ao carregar dados. Por favor, recarregue a página.');
    }
}

document.addEventListener('DOMContentLoaded', carregarDados);

// Envio do formulário
form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const validacao = validarTodosCampos();
    
    if (!validacao.valido) {
        mostrarAlerta(validacao.camposFaltantes);
        return;
    }

    try {
        const dados = {
            nome: nomeInput.value.trim(),
            cpf: cpfInput.value.replace(/\D/g, ''),
            termo: checkboxTermos.checked,
            setor: setorSelect.value ? parseInt(setorSelect.value) : null,
            modelo: document.querySelector('input[name="possui_aparelho"]:checked').value === 'sim' 
                ? parseInt(modeloSelect.value) 
                : null,
            numero_corporativo: document.querySelector('input[name="possui_numero"]:checked').value === 'sim'
                ? numCorporativoInput.value.replace(/\D/g, '')
                : null
        };

        const colaborador = await cadastrarColaborador(dados);
        console.log('Colaborador:', colaborador);

        // Variável para armazenar o chip criado
        let chipCriado = null;

        // Cria o chip se um número foi fornecido
        if (dados.numero_corporativo) {
            try {
                chipCriado = await cadastrarChip(dados, colaborador.id);
                console.log('Chip:', chipCriado);
            } catch (chipError) {
                console.error('Erro ao cadastrar chip:', chipError);
                alert('Colaborador criado com sucesso, mas houve um erro ao cadastrar o chip.');
                modalSucesso.style.display = 'block';
                document.body.style.overflow = 'hidden';
                form.reset();
                modeloContainer.style.display = 'none';
                numeroContainer.style.display = 'none';
                btnCadastrar.disabled = true;
                return;
            }
        }

        // Se tiver chip criado e modelo selecionado, cadastra o celular
        if (chipCriado && dados.modelo) {
            try {
                const celular = await cadastrarCelular(dados.modelo, chipCriado.id);
                console.log('Celular:', celular);
            } catch (celularError) {
                console.error('Erro ao cadastrar celular:', celularError);
                alert('Colaborador e chip criados com sucesso, mas houve um erro ao cadastrar o celular.');
                modalSucesso.style.display = 'block';
                document.body.style.overflow = 'hidden';
                form.reset();
                modeloContainer.style.display = 'none';
                numeroContainer.style.display = 'none';
                btnCadastrar.disabled = true;
                return;
            }
        }

        modalSucesso.style.display = 'block';
        document.body.style.overflow = 'hidden';
        form.reset();
        modeloContainer.style.display = 'none';
        numeroContainer.style.display = 'none';
        btnCadastrar.disabled = true;
    } catch (error) {
        console.error('Erro ao cadastrar:', error);
        if (error.message.includes('CPF')) {
            document.getElementById('mensagemErro').textContent = error.message;
            modalErro.style.display = 'block';
        } else {
            alert(error.message || 'Erro ao cadastrar aparelho. Por favor, tente novamente.');
        }
        document.body.style.overflow = 'hidden';
    }
});

// Função para gerar o PDF
function gerarPDF() {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Configuração inicial
        doc.setFont("helvetica");
        doc.setFontSize(16);
        doc.text('TERMOS E CONDIÇÕES PARA USO DE CELULAR CORPORATIVO', 105, 20, { align: 'center' });
        
        // DADOS DA EMPRESA
        doc.setFontSize(14);
        doc.text('DADOS DA EMPRESA', 20, 40);
        
        doc.setFontSize(12);
        doc.text('Razão Social: Polybalas', 20, 55);
        doc.text('CNPJ: 00.909.327/0001-80', 20, 65);
        doc.text('Endereço: R. João Miguel de Souza, 173 - Galpão B - Ernesto Geisel, João Pessoa - PB,', 20, 75);
        doc.text('58075-075', 20, 85);
        doc.text('Telefone: (83) 3049-4100', 20, 95);

        // DADOS DO COLABORADOR
        doc.setFontSize(14);
        doc.text('DADOS DO COLABORADOR', 20, 115);
        
        doc.setFontSize(12);
        doc.text(`Nome Completo: ${nomeInput.value}`, 20, 130);
        doc.text(`CPF: ${cpfInput.value}`, 20, 140);
        doc.text(`Setor: ${setorSelect.options[setorSelect.selectedIndex].text}`, 20, 150);

        // DADOS DO EQUIPAMENTO
        doc.setFontSize(14);
        doc.text('DADOS DO EQUIPAMENTO', 20, 170);
        
        doc.setFontSize(12);
        const possuiAparelho = document.querySelector('input[name="possui_aparelho"]:checked').value === 'sim';
        const possuiNumero = document.querySelector('input[name="possui_numero"]:checked').value === 'sim';

        if (possuiAparelho) {
            const [marca, modelo] = modeloSelect.options[modeloSelect.selectedIndex].text.split(' - ');
            doc.text(`Modelo: ${modelo}`, 20, 185);
            doc.text(`Marca: ${marca}`, 20, 195);
        } else {
            doc.text('Aparelho Corporativo: Não possui', 20, 185);
        }

        if (possuiNumero) {
            doc.text(`Número Corporativo: ${numCorporativoInput.value}`, 20, possuiAparelho ? 205 : 195);
        } else {
            doc.text('Número Corporativo: Não possui', 20, possuiAparelho ? 205 : 195);
        }
        
        const dataAtual = new Date().toLocaleDateString('pt-BR');
        doc.text(`Data de entrega: ${dataAtual}`, 20, possuiAparelho ? 215 : 205);

        // Termos
        let yPos = possuiAparelho ? 235 : 225;
        const lineHeight = 10;
        const maxWidth = 170;

        const termos = [
            { titulo: '1. Objetivo', 
              conteudo: 'Este documento tem como finalidade estabelecer as diretrizes e responsabilidades relacionadas ao uso de aparelhos celulares corporativos fornecidos pela empresa Polybalas a seus colaboradores, visando garantir o uso adequado e responsável do equipamento.' },
            { titulo: '2. Responsabilidade de Uso',
              conteudo: 'O colaborador compromete-se a utilizar o aparelho celular fornecido exclusivamente para fins profissionais e de acordo com as políticas internas da empresa. É responsabilidade do colaborador zelar pela integridade física e funcional do equipamento durante todo o período de posse.' },
            { titulo: '3. Devolução do Aparelho',
              conteudo: 'Caso o aparelho tenha sido entregue ao colaborador com caixa, carregador e/ou outros acessórios, todos esses itens deverão ser devolvidos nas mesmas condições em que foram recebidos. A não devolução de qualquer item ou devolução em condições inadequadas poderá resultar em cobrança proporcional ao valor do item não retornado.' },
            { titulo: '4. Perda ou Danos',
              conteudo: 'Em caso de perda, quebra ou qualquer dano causado por uso inadequado ou negligência, o colaborador será responsabilizado e deverá arcar com uma multa correspondente a 20% (vinte por cento) do valor de mercado do aparelho no momento do incidente.' },
            { titulo: '5. Roubo ou Furto',
              conteudo: 'Em caso de roubo ou furto do aparelho, o colaborador deverá comunicar imediatamente a empresa e providenciar o registro de um Boletim de Ocorrência (B.O.) junto à autoridade policial. A cópia do B.O. deverá ser encaminhada ao setor responsável no prazo de até 3 (três) dias úteis após o ocorrido.' },
            { titulo: '6. Concordância',
              conteudo: 'Ao clicar em "Aceito", o colaborador declara estar ciente e de acordo com todos os termos e condições descritos acima, comprometendo-se a cumprir integralmente as responsabilidades estabelecidas por este documento.' }
        ];

        termos.forEach(termo => {
            // Verifica se precisa de nova página
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }

            // Título do termo
            doc.setFontSize(12);
            doc.text(termo.titulo, 20, yPos);
            yPos += lineHeight;

            // Conteúdo do termo
            const linhas = doc.splitTextToSize(termo.conteudo, maxWidth);
            linhas.forEach(linha => {
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 20;
                }
                doc.text(linha, 20, yPos);
                yPos += lineHeight;
            });

            yPos += 5; // Espaço extra entre termos
        });

        // Assinatura
        if (yPos > 240) {
            doc.addPage();
            yPos = 30;
        }

        yPos += 20;
        doc.text(`______${nomeInput.value}______`, 105, yPos, { align: 'center' });
        yPos += 10;
        doc.text('Assinatura do Funcionário', 105, yPos, { align: 'center' });
        doc.text('Data: ' + new Date().toLocaleDateString('pt-BR'), 105, yPos + 10, { align: 'center' });
        doc.text('Esta é uma assinatura feita no momento do aceite dos termos e condições.', 105, yPos + 20, { align: 'center' });
        
        doc.save('termos_e_condicoes.pdf');
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        alert('Erro ao gerar o PDF. Por favor, tente novamente.');
    }
}

// Controle do Modal
btnOpen.onclick = function(e) {
  e.preventDefault();
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

span.onclick = function() {
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

btnClose.onclick = function() {
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

btnDownload.addEventListener('click', function(e) {
    e.preventDefault();
    const validacao = validarTodosCampos();
    if (!validacao.valido) {
        mostrarAlerta(validacao.camposFaltantes);
        return;
    }
    gerarPDF();
});

// Controle do Modal de Sucesso
modalSucesso.querySelector('.close').onclick = function() {
  modalSucesso.style.display = 'none';
  document.body.style.overflow = 'auto';
}

modalSucesso.querySelector('.btn-close').onclick = function() {
  modalSucesso.style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Controle do Modal de Erro
modalErro.querySelector('.close').onclick = function() {
    modalErro.style.display = 'none';
    document.body.style.overflow = 'auto';
}

modalErro.querySelector('.btn-close').onclick = function() {
    modalErro.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Controle do Modal de Campos Faltantes
modalCamposFaltantes.querySelector('.close').onclick = function() {
    modalCamposFaltantes.style.display = 'none';
    document.body.style.overflow = 'auto';
}

modalCamposFaltantes.querySelector('.btn-close').onclick = function() {
    modalCamposFaltantes.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Atualizar o evento de click fora para incluir o novo modal
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    if (event.target == modalSucesso) {
        modalSucesso.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    if (event.target == modalErro) {
        modalErro.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    if (event.target == modalCamposFaltantes) {
        modalCamposFaltantes.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}
