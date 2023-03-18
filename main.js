const canvas = document.getElementById('canvas');
canvas.setAttribute('style', "color: white")
const ctx = canvas.getContext('2d');

const dt = 0.01
const sigma = 10
const rho = 28
const beta = 8 / 3

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

function extendPath(path, steps) {
    [...Array(steps)].forEach(() => {
        const lastP = path[path.length - 1];
        const p = integrate(lastP)
        path.push(p)
    })
    return path
}

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
    })
}
var q = 0

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

function step() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    extendPath(path, 10)
    const scaled = scale(path, 600)
    draw(scaled)
    while (path.length > 1000) path.shift()
    setTimeout(step, 1000 / 60)
}

step();