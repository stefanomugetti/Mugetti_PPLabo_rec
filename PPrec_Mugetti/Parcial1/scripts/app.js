import crearTabla from "./tablaDinamica.js";
import Anuncio_Auto from "./auto.anuncio.js";

//localStorage.clear();//POR SI QUEDA SUCIO EL LOCALSTORAGE
//console.log(asd);
//#region CARGA DE DATOS

const anuncios = localStorage.getItem("anuncios")
  ? JSON.parse(localStorage.getItem("anuncios"))
  : [];

var max = 0;
anuncios.forEach((anuncios) => {
  if (anuncios.id > max) {
    max = anuncios.id;
  }
});
const UltimoId = max;
localStorage.setItem("IdMax", (UltimoId + 1).toString());

cargarTabla();
//#endregion
//#region AGREGAR

const $frmAnuncio = document.forms[0];

$frmAnuncio.addEventListener("submit", (e) => {
  const frm = e.target;
  e.preventDefault();

  let titulo = frm.txtTitulo.value;
  let descripcion = frm.txtDescripcion.value;
  let precio = parseFloat(frm.txtPrecio.value);
  let potencia = parseInt(frm.txtPotencia.value);
  let kms = parseInt(frm.txtKms.value);
  let puertas = parseInt(frm.txtPuertas.value);
  let caracteristicas = new Array();

  let transaccionInt = "Alquiler";
  if (document.formulario.transaccion[0].checked) {
    transaccionInt = "Venta";
  }

  if (frm.chkTurbo.checked) {
    caracteristicas.push("Turbo");
  }
  if (frm.chkAleron.checked) {
    caracteristicas.push("Aleron");
  }
  if (frm.chkNeon.checked) {
    caracteristicas.push("Neon");
  }

  if (precio > 0 && potencia > 0 && puertas > 0 && kms > 0) {
    let idMax = parseInt(localStorage.getItem("IdMax"));
    let newAnuncio = new Anuncio_Auto(
      idMax,
      titulo,
      transaccionInt,
      descripcion,
      precio,
      puertas,
      kms,
      potencia,
      caracteristicas
    );
    swal("Atencion", "El anuncio fue agregado", "success");
    anuncios.push(newAnuncio);
    localStorage.setItem("anuncios", JSON.stringify(anuncios));
    localStorage.setItem("IdMax", idMax + 1);
    mostrarTabla();
    refrescarTabla();
    mostrarSpinner(3000);
    limpiarFormulario();
  }
});
//#endregion
//#region MAPEO

function MapearObjetoAControl(id) {
  anuncios.forEach((element) => {
    if (element.id == id) {
      document.getElementById("txtTitulo").value = element.titulo;
      document.getElementById("txtDescripcion").value = element.descripcion;
      document.getElementById("txtPrecio").value = element.precio;
      document.getElementById("txtPotencia").value = element.potencia;
      document.getElementById("txtPuertas").value = element.puertas;
      document.getElementById("txtKms").value = element.kms;
      document.formulario.transaccion[0].checked = true;
      if (element.transaccion == "Alquiler") {
        document.formulario.transaccion[1].checked = true;
      }

      const chkNeon = document.getElementById("chkNeon");
      const chkAleron = document.getElementById("chkAleron");
      const chkTurbo = document.getElementById("chkTurbo");

      chkNeon.checked = false;
      chkAleron.checked = false;
      chkTurbo.checked = false;

      if (element.caracteristicas != null) {
        if (element.caracteristicas.includes("Neon")) {
          chkNeon.checked = true;
        }
        if (element.caracteristicas.includes("Aleron")) {
          chkAleron.checked = true;
        }
        if (element.caracteristicas.includes("Turbo")) {
          chkTurbo.checked = true;
        }
      }
      localStorage.setItem("Id", id);
      return;
    }
  });
}

//#endregion
//#region FUNCIONALIDAD TABLA
const botones = document.getElementById("botonera");
document.getElementById("table-container").addEventListener("click", (e) => {
  if (e.target.matches("tr td")) {
    MapearObjetoAControl(e.target.parentElement.dataset.id);
    botones.removeAttribute("Hidden");
  }
});
function cargarTabla() {
  document.querySelector(".table-container").appendChild(crearTabla(anuncios));
}
function refrescarTabla() {
  document.querySelector(".table-container").firstElementChild.remove();
  document.querySelector(".table-container").appendChild(crearTabla(anuncios));
}
function limpiarFormulario() {
  //SIEMPRE QUE OCURRA ALGUNA ACCION DEL ABM SE VA A LIMPIAR LOS CAMPOS Y DESAPARECE LA BOTONERA
  const botones = document.getElementById("botonera");
  botones.setAttribute("Hidden", true);

  document.getElementById("txtTitulo").value = "";
  document.getElementById("txtDescripcion").value = "";
  document.getElementById("txtPrecio").value = "";
  document.getElementById("txtPotencia").value = "";
  document.getElementById("txtPuertas").value = "";
  document.getElementById("txtKms").value = "";

  document.getElementById("chkTurbo").checked = false;
  document.getElementById("chkAleron").checked = false;
  document.getElementById("chkNeon").checked = false;
}
//#endregion
//#region CANCELAR
let btnCancelar = document.getElementById("btnCancelar");
btnCancelar.addEventListener("click", (e) => {
  cancelar();
});
function cancelar() {
  limpiarFormulario();
  localStorage.removeItem("Id");
}
//#endregion
//#region ELIMINAR
let btnEliminar = document.getElementById("btnEliminar");

btnEliminar.addEventListener("click", (e) => {
  swal({
    title: "¿Esta Seguro?",
    text: "No podra recuperar el anuncio",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      mostrarSpinner(3000);
      if (eliminar()) {
        swal("El anuncio fue eliminado", {
          icon: "success",
        });
      }
    } else {
      swal("El anuncio esta a salvo!");
    }
  });
});

function eliminar() {
  let id = localStorage.getItem("Id");
  let index = 0;
  anuncios.forEach((element) => {
    if (element.id == id) {
      anuncios.splice(index, 1);
      localStorage.setItem("anuncios", JSON.stringify(anuncios));
      return true;
    }
    index++;
  });
  limpiarFormulario();
  refrescarTabla();
}

//#endregion
//#region Modificar
let btnModificar = document.getElementById("btnModificar");

btnModificar.addEventListener("click", (e) => {
  modificar();
});

function modificar() {
  let id = localStorage.getItem("Id");
  anuncios.forEach((element) => {
    if (element.id == id) {
      if(modificarAnuncio(element)){
        localStorage.setItem("anuncios", JSON.stringify(anuncios));
        refrescarTabla();
        limpiarFormulario();
        swal("Atencion", "El anuncio fue modificado", "warning");
        mostrarSpinner(3000);
        return;
      }
    }
  });
}

function modificarAnuncio(anuncio) {
  let titulo = document.getElementById("txtTitulo").value;
  let descripcion = document.getElementById("txtDescripcion").value;
  let precio = document.getElementById("txtPrecio").value;
  let puertas = document.getElementById("txtPuertas").value;
  let potencia = document.getElementById("txtPotencia").value;
  let kms = document.getElementById("txtKms").value;
  let caracteristicas = new Array();
  let transaccion = "Alquiler";
  if (document.formulario.transaccion[0].checked) {
    transaccion = "Ventas";
  }
  if (document.getElementById("chkTurbo").checked) {
    caracteristicas.push("Turbo");
  }
  if (document.getElementById("chkAleron").checked) {
    caracteristicas.push("Aleron");
  }
  if (document.getElementById("chkNeon").checked) {
    caracteristicas.push("Neon");
  }
  if (precio > 0 && puertas > 0 && kms > 0 && potencia > 0) {
    anuncio.titulo = titulo;
    anuncio.descripcion = descripcion;
    anuncio.precio = precio;
    anuncio.puertas = puertas;
    anuncio.potencia = potencia;
    anuncio.kms = kms;
    anuncio.transaccion = transaccion;
    anuncio.caracteristicas = caracteristicas;
    return true;
  } else {
    alert("Los datos ingresados son invalidos.");
  }
  return false;
}
//#endregion
//#region SPINNER

setTimeout(() => {
  const divSpinner = document.getElementById("divSpinner");
  divSpinner.setAttribute("Hidden", true);
  if (anuncios.length > 0) {
    mostrarTabla();
  }

  //#endregion
}, 5000);

function mostrarTabla() {
  const tabla = document.getElementById("table-container");
  tabla.removeAttribute("Hidden");
  //const botones = document.getElementById("botonera");
  //botones.removeAttribute("Hidden");
}

function mostrarSpinner(ms) {
  const divSpinner = document.getElementById("divSpinner");
  divSpinner.removeAttribute("Hidden");
  setTimeout(() => {
    divSpinner.setAttribute("Hidden", true);
  }, ms);
}
