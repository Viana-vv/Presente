 function atualizarContador() {
      const inicio = new Date("2025-02-18T00:00:00");
      const agora = new Date();

      // diferença em milissegundos
      const diff = agora - inicio;

      // converter para unidades
      const segundosTotais = Math.floor(diff / 1000);
      const minutosTotais = Math.floor(segundosTotais / 60);
      const horasTotais = Math.floor(minutosTotais / 60);
      const diasTotais = Math.floor(horasTotais / 24);

      // calcular anos e meses aproximados
      const anos = agora.getFullYear() - inicio.getFullYear();
      let meses = agora.getMonth() - inicio.getMonth();
      let dias = agora.getDate() - inicio.getDate();

      if (dias < 0) {
        meses--;
        const ultimoMes = new Date(agora.getFullYear(), agora.getMonth(), 0);
        dias += ultimoMes.getDate();
      }
      if (meses < 0) {
        meses += 12;
      }

      // segundos, minutos e horas atuais
      const segundos = segundosTotais % 60;
      const minutos = minutosTotais % 60;
      const horas = horasTotais % 24;

      document.getElementById("contador").textContent =
        `${anos} anos, ${meses} meses, ${dias} dias, ` +
        `${horas} horas, ${minutos} minutos e ${segundos} segundos desde 18/02/2025.`;
    }

    // atualiza a cada segundo
    setInterval(atualizarContador, 1000);
    atualizarContador();


const images = [
'img/img-(1).jpeg',
'img/img-(2).jpeg',
'img/img-(3).jpeg',
'img/img-(4).jpeg',
'img/img-(5).jpeg',
'img/img-(6).jpeg',
'img/img-(7).jpeg',
'img/img-(8).jpeg',
'img/img-(9).jpeg',
];

const segments = 34;
const maxVerticalRotationDeg = 5;
const dragSensitivity = 20;
const fit = 0.8;
const minRadius = 600;

/* ========= ELEMENTOS ========= */

const root = document.getElementById("root");
const sphere = document.getElementById("sphere");
const viewer = document.getElementById("viewer");
const viewerImg = document.getElementById("viewerImg");

/* ========= BUILD ITEMS IGUAL AO REACT ========= */

function buildItems() {
  const xCols = Array.from({ length: segments }, (_, i) => -37 + i * 2);
  const evenYs = [-4, -2, 0, 2, 4];
  const oddYs = [-3, -1, 1, 3, 5];

  let index = 0;

  xCols.forEach((x, col) => {
    const ys = col % 2 === 0 ? evenYs : oddYs;

    ys.forEach(y => {
      const item = document.createElement("div");
      item.className = "item";

      item.style.setProperty("--offset-x", x);
      item.style.setProperty("--offset-y", y);

      const imgWrap = document.createElement("div");
      imgWrap.className = "item__image";

      const img = document.createElement("img");
      img.src = images[index % images.length];

      imgWrap.appendChild(img);
      item.appendChild(imgWrap);
      sphere.appendChild(item);

      imgWrap.onclick = () => {
        viewer.style.display = "flex";
        viewerImg.src = img.src;
      };

      index++;
    });
  });
}

buildItems();

/* ========= RADIUS DINÂMICO ========= */

function updateRadius() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const basis = Math.min(w, h);
  let radius = basis * fit;
  radius = Math.max(radius, minRadius);
  root.style.setProperty("--radius", radius + "px");
  root.style.setProperty("--segments", segments);
}

updateRadius();
window.addEventListener("resize", updateRadius);

/* ========= ROTATION + INERTIA ========= */

let rotX = 0;
let rotY = 0;
let startX = 0;
let startY = 0;
let startRotX = 0;
let startRotY = 0;
let dragging = false;
let vx = 0;
let vy = 0;

function applyTransform() {
  sphere.style.transform =
    `translateZ(calc(var(--radius) * -1)) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
}

document.addEventListener("pointerdown", e => {
  dragging = true;
  startX = e.clientX;
  startY = e.clientY;
  startRotX = rotX;
  startRotY = rotY;
});

document.addEventListener("pointermove", e => {
  if (!dragging) return;

  const dx = e.clientX - startX;
  const dy = e.clientY - startY;

  rotY = startRotY + dx / dragSensitivity;
  rotX = startRotX - dy / dragSensitivity;

  rotX = Math.max(-maxVerticalRotationDeg, Math.min(maxVerticalRotationDeg, rotX));

  vx = dx;
  vy = dy;

  applyTransform();
});

document.addEventListener("pointerup", () => {
  dragging = false;
  inertia();
});

function inertia() {
  vx *= 0.95;
  vy *= 0.95;

  rotY += vx * 0.01;
  rotX -= vy * 0.01;

  rotX = Math.max(-maxVerticalRotationDeg, Math.min(maxVerticalRotationDeg, rotX));

  applyTransform();

  if (Math.abs(vx) > 0.1 || Math.abs(vy) > 0.1) {
    requestAnimationFrame(inertia);
  }
}

viewer.onclick = () => viewer.style.display = "none";