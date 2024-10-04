const textPesos = document.getElementById("textPesos");
const selectMoneda = document.getElementById("selectMoneda");
const btnBuscar = document.getElementById("btnBuscar");
const spanValorPesos = document.getElementById("spanValorPesos");

let mindicadorValue = {};

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

const clickCalcular = () => {
  const valorInput = Number(textPesos.value);

  if (!isNaN(valorInput) && valorInput > 0) {
    const keySelect = selectMoneda.value;

    const valorEnPesos = calcular(valorInput, keySelect);

    spanValorPesos.innerHTML = valorEnPesos;
  }
};

const getAllKeys = (value) => {
  const allkeys = Object.keys(value);
  const invalidKeys = ["version", "autor", "fecha"];
  const validKeys = allkeys.filter((k) => !invalidKeys.includes(k));
  return validKeys;
};

btnBuscar.addEventListener("click", clickCalcular);

fetch("https://mindicador.cl/api")
  .then((response) => response.json())
  .then((value) => {
    mindicadorValue = value;

    const validKeys = getAllKeys(value);

    agregarOpciones(validKeys);
  });
