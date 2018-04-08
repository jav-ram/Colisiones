function gruaControl(keyCode) {

  //
  //  CARRO
  //

  //MOVERSE
  if (keyCode == 87){
    //Adelante
    central.translateX(+T_FACTOR);
  } else if (keyCode == 83){
    //Atras
    central.translateX(-T_FACTOR);
  } else if (keyCode == 68){
    //Derecha
    central.translateZ(+T_FACTOR);
  } else if (keyCode == 65){
    //izquierda
    central.translateZ(-T_FACTOR);
  }

  //ROTAR
   else if (keyCode == 81){
     //derecha
     central.rotateY( T_ROTATE);
   } else if (keyCode == 69){
     //derecha
     central.rotateY(-T_ROTATE);
   }

   //
   // PALO
   //

   //Extender
   else if (keyCode == 84){
     if (paloInterno.position.y < 5){
       console.log(paloInterno.translateY(+T_FACTOR/2));
     } else {
       paloInterno.position.y = 4.9;
     }
   } else if (keyCode == 71){
     if (paloInterno.position.y >= 0){
       console.log(paloInterno.translateY(-T_FACTOR/2));
     } else {
       paloInterno.position.y = 0;
     }
   }

   //
   // horizontal
   //

   //Extender
   else if (keyCode == 82){
     if (horizontal.position.x < 3.5){
       horizontal.translateX(+T_FACTOR/2);
     } else {
       horizontal.position.x = 3.4;
     }
   } else if (keyCode == 70){
     if (horizontal.position.x >= 0){
      horizontal.translateX(-T_FACTOR/2);
    } else {
      horizontal.position.x = 0;
    }
   }
}
