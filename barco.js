function barcoControl(keyCode) {
  //MOVERSE
  console.log("asdasd");
  barco.__dirtyPosition = true;
  barco.__dirtyRotation = true;
  
  if (keyCode == 87){
    //Adelante
    barco.translateZ(-T_FACTOR);
  } else if (keyCode == 83){
    //Atras
    barco.translateZ(+T_FACTOR);
  } else if (keyCode == 68){
    //Derecha
    //barco.rotation.y -= T_ROTATE;
    barco.rotateY(-T_ROTATE);
  } else if (keyCode == 65){
    //izquierda
    //barco.rotation.y += T_ROTATE;
    barco.rotateY(+T_ROTATE);
  } else if (keyCode == 81){
    barco.translate(-T_FACTOR);
  } else if (keyCode == 69){
    barco.translate(+T_FACTOR);
  }


}
