import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeFormat } from '@zxing/library';
import QRCode from '@zxing/library/esm/core/qrcode/encoder/QRCode';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  formatsEnabled: BarcodeFormat[] = [BarcodeFormat.AZTEC];
  qrResultString!: string;
  usuario!: string;
  idAlumno!:string;
  showScanner = true;
  showAlert = false;
  



  constructor(public router: Router) {}

  public alertButtons = [
    {
      text: 'OK',
      handler: () => {
        this.router.navigate(['/login']);
      }
    }
  ];

  ngOnInit(){
    var user = localStorage.getItem('login');
    if(user){
      var userItems = JSON.parse(user);
      this.usuario= userItems.name + " " + userItems.lastName;
      this.idAlumno= userItems.id;
    }
  }


  clearResult(): void {
    this.qrResultString = '';
  }
  
  onCodeResult(resultString: string) {
    this.qrResultString = resultString;
    if (this.qrResultString!=null){
    
      this.showScanner = false;
      this.showAlert = true;
  
      var sesion = localStorage.getItem('sesion');
      if (sesion) {
        var sesionItems = JSON.parse(sesion);
        var existingClass = sesionItems.find((item: { clase: string; }) => item.clase === this.qrResultString);
        if (existingClass) {
          if (!existingClass.asistencia.includes(this.idAlumno)) {
            existingClass.asistencia.push(this.idAlumno);
          } else {
            alert(`Ya estas en la lista de asistencia. ${this.usuario}`);
          }
        } else {
          var newClass = {
            clase: this.qrResultString,
            asistencia: [this.idAlumno]
          }
          sesionItems.push(newClass);
        }
        localStorage.setItem('sesion', JSON.stringify(sesionItems));
      } else {
        var newSesion = [{
          clase: this.qrResultString,
          asistencia: [this.idAlumno]
        }]
        localStorage.setItem('sesion',JSON.stringify(newSesion));
      }
    }
  }
  

  
  /*let dataQR = this.qrResultString.split(',');
    this.dataQR = dataQR.join('\n');*/
    
}
