// Configuração base da API
const API_BASE_URL = 'https://5b2c36587521.ngrok.app/api';

// URLs dos endpoints
const API_ENDPOINTS = {
    get_setores: `${API_BASE_URL}/setores/`,
    get_modelos: `${API_BASE_URL}/modelos-cel/`,
    set_colaboradores: `${API_BASE_URL}/colaboradores/`,
    set_chip: `${API_BASE_URL}/chips/`,
    get_chip: `${API_BASE_URL}/chips/buscar-por-numero/?numero=`,
    set_celular: `${API_BASE_URL}/celulares/`,
};

// Funções GET
async function buscarSetores() {
    try {
        const response = await fetch(API_ENDPOINTS.get_setores, {
            headers: {
                'Accept': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Erro ao buscar setores');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar setores:', error);
        throw error;
    }
}

async function buscarModelos() {
    try {
        const response = await fetch(API_ENDPOINTS.get_modelos, {
            headers: {
                'Accept': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Erro ao buscar modelos');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar modelos:', error);
        throw error;
    }
}

// Função POST para cadastro
async function cadastrarColaborador(dados) {
    try {
        // TODO: Remover o console.log
        console.log('Dados que serão enviados para a API:', dados);
        
        const response = await fetch(API_ENDPOINTS.set_colaboradores, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                nome: dados.nome || "",
                cpf: dados.cpf || "",
                termo: dados.termo || false,
                setor: dados.setor || null,
            })
        });

        const responseData = await response.json();
        
        if (!response.ok) {
            console.error('Erro retornado pela API:', responseData);
            if (responseData.cpf) {
                throw new Error(`Erro no CPF: ${responseData.cpf.join(', ')}`);
            }
            throw new Error(responseData.message || 'Erro ao cadastrar');
        }

        console.log('Cadastro realizado com sucesso:', responseData);
        return responseData;
    } catch (error) {
        console.error('Erro detalhado ao cadastrar:', error);
        throw error;
    }
}

// Função POST para cadastro chip
async function cadastrarChip(dados, colaboradorId) {
    try {
        // TODO: Remover o console.log
        console.log('Dados que serão enviados para a API:', dados);
        console.log('Colaborador ID:', colaboradorId);
        
        const response = await fetch(API_ENDPOINTS.set_chip, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                numero: dados.numero_corporativo || "",
                responsavel: colaboradorId || "",
            })
        });

        const responseData = await response.json();
        
        if (!response.ok) {
            console.error('Erro retornado pela API:', responseData);
            if (responseData.responsavel) {
                throw new Error(`Erro no responsável: ${responseData.responsavel.join(', ')}`);
            }
            if (responseData.numero) {
                throw new Error(`Erro no número: ${responseData.numero.join(', ')}`);
            }
            throw new Error(responseData.message || 'Erro ao cadastrar chip');
        }

        console.log('Cadastro realizado com sucesso:', responseData);
        return responseData;
    } catch (error) {
        console.error('Erro detalhado ao cadastrar:', error);
        throw error;
    }
}

// Função POST para cadastro de celular
async function cadastrarCelular(modeloId, chipId) {
    try {
        console.log('Dados que serão enviados para a API - Modelo ID:', modeloId);
        console.log('Dados que serão enviados para a API - Chip ID:', chipId);
        
        const response = await fetch(API_ENDPOINTS.set_celular, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                modelo: modeloId,
                chip: chipId
            })
        });

        const responseData = await response.json();
        
        if (!response.ok) {
            console.error('Erro retornado pela API:', responseData);
            if (responseData.modelo) {
                throw new Error(`Erro no modelo: ${responseData.modelo.join(', ')}`);
            }
            if (responseData.chip) {
                throw new Error(`Erro no chip: ${responseData.chip.join(', ')}`);
            }
            throw new Error(responseData.message || 'Erro ao cadastrar celular');
        }

        console.log('Cadastro do celular realizado com sucesso:', responseData);
        return responseData;
    } catch (error) {
        console.error('Erro detalhado ao cadastrar celular:', error);
        throw error;
    }
}

// Exportando as funções
export { 
    buscarSetores, 
    buscarModelos, 
    cadastrarColaborador,
    cadastrarChip,
    cadastrarCelular
}; 