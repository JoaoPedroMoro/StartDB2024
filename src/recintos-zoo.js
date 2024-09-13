class RecintosZoo {
  constructor() {
    this.recintos = [
      { id: 1, bioma: 'savana', tamanhoTotal: 10, animaisExistentes: [{ especie: 'MACACO', quantidade: 3 }] },
      { id: 2, bioma: 'floresta', tamanhoTotal: 5, animaisExistentes: [] },
      { id: 3, bioma: 'savana e rio', tamanhoTotal: 7, animaisExistentes: [{ especie: 'GAZELA', quantidade: 1 }] },
      { id: 4, bioma: 'rio', tamanhoTotal: 8, animaisExistentes: [] },
      { id: 5, bioma: 'savana', tamanhoTotal: 9, animaisExistentes: [{ especie: 'LEAO', quantidade: 1 }] }
    ];

    this.animais = {
      LEAO: { tamanho: 3, bioma: 'savana', carnivoro: true },
      LEOPARDO: { tamanho: 2, bioma: 'savana', carnivoro: true },
      CROCODILO: { tamanho: 3, bioma: 'rio', carnivoro: true },
      MACACO: { tamanho: 1, bioma: ['savana', 'floresta'], carnivoro: false},
      GAZELA: { tamanho: 2, bioma: 'savana', carnivoro: false },
      HIPOPOTAMO: { tamanho: 4, bioma: ['savana e rio'], carnivoro: false}
    };
  }

  // Função para verificar se o espaço existente no recinto é suficiente para o animal
  verificaEspaco(recinto, novoAnimal, quantidade) {
    let espacoOcupado = recinto.animaisExistentes.reduce((total, animal) => {
      return total + (animal.quantidade * this.animais[animal.especie].tamanho);
    }, 0);

    const biomasRecinto = recinto.bioma.split(' e '); // Divide o bioma em partes se houver ' e '
    const biomasAnimal = Array.isArray(this.animais[novoAnimal].bioma) ? this.animais[novoAnimal].bioma : [this.animais[novoAnimal].bioma];
    const compatívelComBioma = biomasRecinto.some(biomaRecinto => biomasAnimal.includes(biomaRecinto));

    // Verifica se o bioma é compatível com a lista de biomas do animal
    if (!compatívelComBioma) {
      return false;
    }

    // Evitando colocar animais junto aos animais carnivoros
    const existeCarnivoro = recinto.animaisExistentes.some(animal => this.animais[animal.especie].carnivoro);
    const novoAnimalCarnivoro = this.animais[novoAnimal].carnivoro;

    if ((existeCarnivoro || novoAnimalCarnivoro) && recinto.animaisExistentes.length > 0 && recinto.animaisExistentes[0].especie !== novoAnimal) {
      return false;
    }

    // Verifica existe espaço disponivel no recinto
    const espacoNecessario = quantidade * this.animais[novoAnimal].tamanho;
    const espacoLivre = recinto.tamanhoTotal - espacoOcupado;

    // Verifica se há espaço suficiente antes da adição dos novos animais
    if (espacoNecessario > espacoLivre) {
      return false;
    }

    // Regra especifica para o hipopotamo
    if (novoAnimal === 'HIPOPOTAMO' && recinto.bioma !== 'savana e rio') {
      return false;
    }

    // Verifica se há múltiplas espécies no recinto e aplica a regra de espaço extra (+1)
    if (recinto.animaisExistentes.length > 0 && novoAnimal !== recinto.animaisExistentes[0].especie) {
      if (espacoNecessario + 1 > espacoLivre) {
        return false;
      }
    }

    // Regra de macacos sozinhos na gaiola
    if (recinto.animaisExistentes.length == 0 && novoAnimal == 'MACACO' && quantidade == 1) {
      return false;
    }

    return true;
  }

  // Função para verificar se o recinto é válido para o animal
  analisaRecintos(animal, quantidade) {
    if (!this.animais[animal]) {
        return { erro: 'Animal inválido', recintosViaveis: null };
    }

    if (quantidade <= 0) {
        return { erro: 'Quantidade inválida', recintosViaveis: null };
    }

    // Lista de recintos viáveis, atualizando o espaço do recinto após adicionar os animais
    const recintosViaveis = this.recintos
        .filter(recinto => {
            const resultado = this.verificaEspaco(recinto, animal, quantidade);
            return resultado;
        })
        .map(recinto => {
            // Cálculo do espaço livre após adicionar os animais
            const espacoOcupadoAntes = recinto.animaisExistentes.reduce((total, animal) => total + (animal.quantidade * this.animais[animal.especie].tamanho), 0);
            const espacoOcupadoDepois = espacoOcupadoAntes + (quantidade * this.animais[animal].tamanho);
            const espacoLivreAntes = recinto.tamanhoTotal - espacoOcupadoDepois;
            var espacoLivreDepois = espacoLivreAntes 
            if (recinto.animaisExistentes.length > 0 && animal !== recinto.animaisExistentes[0].especie) {
              var espacoLivreDepois = espacoLivreAntes - 1 
            } 

            return {
                id: recinto.id,
                descricao: `Recinto ${recinto.id} (espaço livre: ${espacoLivreDepois} total: ${recinto.tamanhoTotal})`,
                espacoLivreDepois: espacoLivreDepois
            };
        });

      if (recintosViaveis.length === 0) {
          return { erro: 'Não há recinto viável', recintosViaveis: null };
      }

      // Retorna a lista de descrições dos recintos viáveis
      return {
          erro: null,
          recintosViaveis: recintosViaveis.map(r => r.descricao)
      };
    }
  }

export { RecintosZoo as RecintosZoo };