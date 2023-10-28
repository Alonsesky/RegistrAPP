import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { BarcodeFormat } from '@zxing/library';
import { StorageService } from '../services/storage.service';
import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraResultType,CameraSource } from '@capacitor/camera';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

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
  mostrarDatos!:any;
  selfie:any[]=[];
  btnSelfie:boolean=true;

  constructor(private storage: StorageService, public router: Router, public alertController: AlertController) {}

  public alertButtons = [
    {
      text: 'OK',
      handler: () => {
        this.router.navigate(['/home']);
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
    //Iniciar camera
    defineCustomElements(window);
  }

  //Metodos de QR
  clearResult(): void {
    this.qrResultString = '';
  }
/*
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
            this.router.navigate(['/home']);
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
*/
  //Metodo de geolocalizacion
  async ObtenerGeolocation () {
    const position = await Geolocation.getCurrentPosition();
    let latitud = position.coords.latitude;
    let longitud = position.coords.longitude;
    var positionData = {latitud,longitud}
    return positionData
  }

  //Lector QR y Mostrar resultados en HOME
  async onCodeResult(resultString: string) {
    this.qrResultString = resultString;
    if (this.qrResultString!=null){
      //EXTRAER DATOS DEL STRING
      //"Nombre Profesor: Pepito Juan, Hora: 20:30, sala: 805, Dia: lunes";
      var str = this.qrResultString;
      var partes = str.split(", ");
      var objeto:any = {};

      partes.forEach(function(parte) {
        var indice = parte.indexOf(":");
        var clave = parte.substring(0, indice);
        var valor = parte.substring(indice + 1);
        objeto[clave] = valor;
      });

      this.showScanner = false;

      let sesion = await this.storage.getItem('sesion');
      let sesionItems: any[] = sesion ? JSON.parse(sesion) : [];
      let noExistente = sesionItems.find((item: { qr: string; }) => item.qr === this.qrResultString);

      if (noExistente) {
        if (!noExistente.asistencia.includes(this.idAlumno)) {
          noExistente.asistencia.push(this.idAlumno);
        } else {
          const alert = await this.alertController.create({
            header: 'Ya estás registrado!',
            message: `Ya estas en la lista de asistencia. ${this.usuario}`,
            buttons: ['Aceptar']
          });
          await alert.present();
        }
      } else {
        var newSesion = {
          qr: this.qrResultString,
          nombreProfesor: objeto["Nombre Profesor"],
          hora: objeto["Hora"],
          sala: objeto["sala"],
          dia: objeto["Dia"],
          asistencia: [this.idAlumno]
        };
        sesionItems.push(newSesion);
        //Modificamos el storage
        this.storage.setItem('sesion', JSON.stringify(sesionItems));
        this.showAlert = true;

      }

      //TRAER DATOS DE GEOLOCALIZACION
      const dataGeo = await this.ObtenerGeolocation();
      await this.takeSelfie();
      //TRAER DATOS DEL ALUMNO
      let alumnos = await this.storage.getItem('alumno');
      let data = alumnos ? JSON.parse(alumnos) : [];
      let dataAlumno = data.find((item: { id: string; }) => item.id === this.idAlumno);
      //JUNTAR DATOS
        this.mostrarDatos = [{
        nombreProfesor: objeto["Nombre Profesor"],
        hora: objeto["Hora"],
        sala: objeto["sala"],
        dia: objeto["Dia"],
        asistencia: [this.idAlumno],
        nombreAlumno: dataAlumno.name,
        apellidoAlumno: dataAlumno.lastName,
        comuna: dataAlumno.comuna,
        region:dataAlumno.region,
        rut:dataAlumno.rut,
        latitud: dataGeo.latitud,
        longitud: dataGeo.longitud
      }];
      //Modificamos el storage
      this.storage.setItem('sesion', JSON.stringify(sesionItems));



    }
  }

  //Usaremos Camera para selfie
  async takeSelfie(){
    var cSource = CameraSource.Prompt;
    if ((await Camera.checkPermissions()).camera == 'granted') {
      const image = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        quality: 100,
        height:1024,
        width:1024,
        source:cSource,
        presentationStyle:'popover',
        promptLabelCancel:'cancelar',
        promptLabelHeader:'seleccione',
        promptLabelPhoto: 'Desde galeria',
        promptLabelPicture:'Desde la camara'
      });

      if (image.webPath) {
        var blob = (await fetch(image.webPath)).blob();
        this.selfie.unshift({fname:'Foto.' + image.format, src:image.webPath,file:blob})
      }



    }

  }

  //Cerrar sesion
  cerrarSesion(){
    this.showScanner = false;
    this.storage.removeItem('login');
    this.router.navigate(['/login']);
  }

}
