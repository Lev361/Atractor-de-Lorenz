const canvas = document.getElementById('canvas');
canvas.setAttribute('style', "color: white")
const ctx = canvas.getContext('2d');

const dt = 0.01
const sigma = 10
const rho = 28
const beta = 8 / 3


/**
 * A função "integrate" recebe um objeto com as propriedades "x", "y" e "z",
 * que representam as variáveis do modelo de Lorenz. Ela usa essas variáveis
 * para calcular novos valores de "x", "y" e "z" com base em fórmulas matemáticas
 * específicas, usando valores pré-definidos de sigma, rho e beta, que são constantes
 * usadas no modelo de Lorenz.
 */
function integrate({
    x,
    y,
    z
}) {
    x += (sigma * (y - x)) * dt
    y += (x * (rho - z) - y) * dt
    z += (x * y - beta * z) * dt
    return {
        x,
        y,
        z
    }
}

/**
 * A função "extendPath" recebe dois parâmetros: "path" e "steps". "path" é uma matriz que contém
 * pontos no espaço tridimensional, e "steps" é o número de etapas adicionais que desejamos adicionar ao caminho.
 * A função cria um loop com o número de etapas desejadas e itera a cada etapa. A cada iteração,
 * a função calcula o próximo ponto no caminho adicionando um ponto ao final do caminho existente.
 * Para fazer isso, a função chama outra função chamada "integrate"
 * passando o último ponto do caminho atual como um parâmetro.
 * O objetivo do cálculo feito pela função "integrate" é prever a
 * posição do próximo ponto no caminho, com base em um modelo matemático chamado de
 * algoritmo de Lorenz.
 */
function extendPath(path, steps) {
    [...Array(steps)].forEach(() => {
        const lastP = path[path.length - 1];
        const p = integrate(lastP)
        path.push(p)
    })
    return path
}


/**
 * 
 * Essa função chamada "scale" recebe dois parâmetros: "points" e "size". "points"
 * é uma matriz de pontos tridimensionais que representam um objeto geométrico, e "size"
 * é um fator de escala que indica o tamanho da geometria resultante.
 * 
 * A função começa encontrando os valores mínimos e máximos das coordenadas x, y e z de
 * todos os pontos na matriz "points". Em seguida, ela armazena esses valores mínimos e
 * máximos em variáveis separadas chamadas mx, Mx, my, My, mz e Mz. Essas variáveis representam
 * os limites do objeto geométrico original nos eixos x, y e z.
 * 
 * Essas informações são usadas para calcular o centro do objeto geométrico original,
 * que é o ponto médio em cada eixo (x, y e z). Isso é feito dividindo a soma dos valores
 * mínimos e máximos por dois.
 * 
 * A função retorna um objeto que contém as informações sobre a geometria resultante.
 * As propriedades do objeto são "points", que contém os pontos do objeto geométrico resultante,
 * "center", que contém as coordenadas do centro do objeto resultante, e "size", que contém o tamanho
 * do objeto resultante.
 * 
 * Em resumo, a função "scale" encontra os valores mínimos e máximos das coordenadas x, y e z
 * dos pontos tridimensionais de um objeto geométrico e calcula o centro desse objeto. Em seguida,
 * ela retorna um objeto que contém informações sobre a geometria resultante, que é uma versão
 * escalonada do objeto original com base no fator de escala fornecido.
 * 
 */
function scale(points, size) {
    const mx = Math.min(...points.map(({
        x,
        y,
        z
    }) => x))
    const Mx = Math.max(...points.map(({
        x,
        y,
        z
    }) => x))
    const my = Math.min(...points.map(({
        x,
        y,
        z
    }) => y))
    const My = Math.max(...points.map(({
        x,
        y,
        z
    }) => y))
    const mz = Math.min(...points.map(({
        x,
        y,
        z
    }) => z))
    const Mz = Math.max(...points.map(({
        x,
        y,
        z
    }) => z))


    /**
     * 
     * A função "s" é definida como uma função de seta que recebe três argumentos:
     * "v", "mv" e "Mv". A função também utiliza a variável "size", que é uma constante
     * que não é passada como argumento.
     *
     * O objetivo dessa função é calcular uma escala de tamanho para um valor "v" com base 
     * nos valores mínimos e máximos "mv" e "Mv". Essa escala é usada para dimensionar 
     * um objeto com base em um tamanho especificado.
     * 
     */
    const s = (v, mv, Mv) => size * (v - mv) / (Mv - mv)

    return points.map(({
        x,
        y,
        z
    }) => {
        x = s(x, mx, Mz)
        y = s(y, my, My)
        z = s(z, mx, Mz)
        return {
            x,
            y,
            z
        }
    })}
var q = 0


/**
 * A função "draw" recebe um argumento "path", que é um array de pontos.
 * Esses pontos descrevem uma trajetória que será desenhada no canvas.
 */
function draw(path) {
    q += 0.01
    const map = ({
        x,
        y,
        z
    }) => [(x - 300) * Math.cos(q) - (y - 300) * Math.sin(q) + 300, z]
    ctx.beginPath()
    path.map(map).forEach(p => ctx.lineTo(p[0], p[1]))
    ctx.strokeStyle = "#fff";
    ctx.stroke()
}

const path = [{
    x: 1,
    y: 1,
    z: 1
}]

/**
 * A função "step" é responsável por atualizar o canvas a cada quadro de animação.
 * Ela começa limpando o canvas usando a função "ctx.clearRect()", que recebe quatro argumentos:
 * as coordenadas x e y do canto superior esquerdo do retângulo a ser limpo, e as coordenadas x e y
 * do canto inferior direito do mesmo retângulo. Nesse caso, a função limpa todo o canvas,
 * usando as dimensões do próprio canvas (0, 0, canvas.width, canvas.height).
 */
function step() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    extendPath(path, 10)
    const scaled = scale(path, 600)
    draw(scaled)
    while (path.length > 1000) path.shift()
    setTimeout(step, 1000 / 60)
}

step();