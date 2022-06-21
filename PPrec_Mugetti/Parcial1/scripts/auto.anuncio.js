import {Anuncio}  from "./anuncios.js"; 
class Anuncio_Auto extends Anuncio {
    constructor(id, titulo, transaccion,descripcion, precio, puertas,kms,potencia,caracteristicas) {
      super(id,titulo,transaccion,descripcion,precio);
      this.puertas = puertas;
      this.kms = kms;
      this.potencia = potencia;
      this.caracteristicas = caracteristicas;
    }
  }
  
  export default Anuncio_Auto