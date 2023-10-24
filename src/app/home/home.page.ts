import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { BarcodeFormat } from '@zxing/library';
import { StorageService } from '../services/storage.service';
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




  constructor(private storage: StorageService, public router: Router, public alertController: AlertController) {}

  public alertButtons = [
    {
      text: 'OK',
      handler: () => {
        this.router.navigate(['/login']);
      }
    }
  ];

  async ngOnInit(){
    //var user = localStorage.getItem('login');
    //Enviando datos a storage para utilizarlo en HOME
    var user = await this.storage.getItem('login');
    if(user){
      var userItems = JSON.parse(user);
      this.usuario= userItems.name + " " + userItems.lastName;
      this.idAlumno= userItems.id;
    }
  }

  //Metodos de QR
  clearResult(): void {
    this.qrResultString = '';
  }

  async onCodeResult(resultString: string) {
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
            // Guarda los datos modificados de nuevo en el localStorage
            const alert = await this.alertController.create({
              header: 'Ya estás registrado!',
              message: `Ya estas en la lista de asistencia. ${this.usuario}`,
              buttons: ['Aceptar']
            });
            await alert.present();
            this.router.navigate(['/login']);
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




}
