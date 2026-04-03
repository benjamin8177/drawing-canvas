const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const increaseBtn = document.getElementById('increase');
const decreaseBtn = document.getElementById('decrease');
const sizeEL = document.getElementById('size');
const colorEl = document.getElementById('color');
const clearEl = document.getElementById('clear');
const saveBtn = document.getElementById('save');

let size = 10;
let isPressed = false;
let color = 'black';
let x, y;

function resizeCanvas() {
    if(window.innerWidth < 850) {
        canvas.width = window.innerWidth - 20;
        canvas.height = window.innerHeight - 150;
    } else {
        canvas.width = 800;
        canvas.height = 600;
    }
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const getPos = (e) => {
    let clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    let clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    
    const rect = canvas.getBoundingClientRect();
    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
};

canvas.addEventListener('mousedown', (e) => {
    isPressed = true;
    const pos = getPos(e);
    x = pos.x; y = pos.y;
    drawCircle(x,y);
});

canvas.addEventListener('mouseup', () => {
    isPressed = false;
    x = undefined; y = undefined;
});

canvas.addEventListener('mousemove', (e) => {
    if(isPressed) {
        const pos = getPos(e);
        const x2 = pos.x; const y2 = pos.y;
        
        drawCircle(x2, y2);
        drawLine(x, y, x2, y2);
        x = x2; y = y2;
    }
});

canvas.addEventListener('touchstart', (e) => {
    isPressed = true;
    const pos = getPos(e);
    x = pos.x; y = pos.y;
    drawCircle(x,y);
}, {passive: false});

canvas.addEventListener('touchend', () => {
    isPressed = false;
    x = undefined; y = undefined;
});

canvas.addEventListener('touchmove', (e) => {
    if(isPressed) {
        e.preventDefault();
        const pos = getPos(e);
        const x2 = pos.x; const y2 = pos.y;
        
        drawCircle(x2, y2);
        drawLine(x, y, x2, y2);
        x = x2; y = y2;
    }
}, {passive: false});

function drawCircle(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = size * 2;
    ctx.stroke();
}

function updateSizeOnScreen() { sizeEL.innerText = size; }

increaseBtn.addEventListener('click', () => {
    size += 2;
    if(size > 40) size = 40;
    updateSizeOnScreen();
});

decreaseBtn.addEventListener('click', () => {
    size -= 2;
    if(size < 2) size = 2;
    updateSizeOnScreen();
});

colorEl.addEventListener('change', (e) => { color = e.target.value; });

clearEl.addEventListener('click', () => ctx.clearRect(0, 0, canvas.width, canvas.height));

saveBtn.addEventListener('click', () => {
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
    const dataURI = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURI;
    link.download = 'drawing.png';
    link.click();
    
    ctx.globalCompositeOperation = "source-over";
});
