const textPesos = document.getElementById("textPesos");
const selectMoneda = document.getElementById("selectMoneda");
const btnBuscar = document.getElementById("btnBuscar");
const spanValorPesos = document.getElementById("spanValorPesos");
const spanErrores = document.getElementById("spanErrores");
const myChart = document.getElementById("myChart");

let mindicadorValue = {};
let grafico;

const agregarOptionMoneda = (key) => {
  const nuevaOpcion = document.createElement("option");
  nuevaOpcion.value = key;
  nuevaOpcion.textContent = key.replace("_", " ");
  selectMoneda.appendChild(nuevaOpcion);
};

const agregarOpciones = (keys) => {
  for (const key of keys) {
    agregarOptionMoneda(key);
  }
};

const calcular = (valorInput, key) => {
  const valor = mindicadorValue[key].valor;

  return (valorInput / valor).toFixed(4);
};

const convertirFecha = (fechaJson) => {
  const fecha = new Date(fechaJson);

  const dia = String(fecha.getUTCDate()).padStart(2, "0");
  const mes = String(fecha.getUTCMonth() + 1).padStart(2, "0");
  const anio = fecha.getUTCFullYear();

  return `${dia}-${mes}-${anio}`;
};

const renderizarChart = (keySelect) => {
  if (grafico) {
    grafico.destroy();
  }

  fetch(`https://mindicador.cl/api/${keySelect}/2024`)
    .then((response) => response.json())
    .then((value) => {
      const series = value.serie.slice(0, 10);

      const labels = series.map((s) => convertirFecha(s.fecha));
      const data = series.map((s) => s.valor);

      grafico = new Chart(myChart, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Últimos 10 días",
              data: data,
              borderWidth: 1,
            },
          ],
        },
      });
    })
    .catch(() => {
      indicarError();
    });
};

const clickCalcular = () => {
  spanErrores.innerHTML = "";
  try {
    const valorInput = Number(textPesos.value);
    const keySelect = selectMoneda.value;

    if (!isNaN(valorInput) && valorInput > 0) {
      const valorEnPesos = calcular(valorInput, keySelect);

      spanValorPesos.innerHTML = valorEnPesos;
    }

    renderizarChart(keySelect);
  } catch (error) {
    indicarError();
  }
};

const getAllKeys = (value) => {
  const allkeys = Object.keys(value);
  const invalidKeys = ["version", "autor", "fecha"];
  const validKeys = allkeys.filter((k) => !invalidKeys.includes(k));
  return validKeys;
};

btnBuscar.addEventListener("click", clickCalcular);

const indicarError = () => {
  spanErrores.innerHTML = "Ha ocurrido un error";
};

fetch("https://mindicador.cl/api")
  .then((response) => response.json())
  .then((value) => {
    mindicadorValue = value;

    const validKeys = getAllKeys(value);

    agregarOpciones(validKeys);
  })
  .catch((r) => {
    indicarError();
  });
