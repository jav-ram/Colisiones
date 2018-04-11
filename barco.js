function barcoControl(keyCode) {
  //MOVERSE
  console.log("asdasd");
  if (keyCode == 87){
    //Adelante
    barco.translateZ(-T_FACTOR);
  } else if (keyCode == 83){
    //Atras
    barco.translateZ(+T_FACTOR);
  } else if (keyCode == 68){
    //Derecha
    barco.rotateY(-T_ROTATE);
  } else if (keyCode == 65){
    //izquierda
    barco.rotateY(+T_ROTATE);
  } else if (keyCode == 81){
    barco.translate(-T_FACTOR);
  } else if (keyCode == 69){
    barco.translate(+T_FACTOR);
  }
}
