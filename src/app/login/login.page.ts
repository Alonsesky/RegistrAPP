import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, Animation, AnimationController, IonCardTitle } from '@ionic/angular';
import { StorageService } from '../services/storage.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild(IonCardTitle, {read: ElementRef})
  title!: ElementRef<HTMLIonCardElement>;
  animation!: Animation;
  fmLogin: FormGroup;
  usuario: String = '';
  password:String='';


  constructor(
              private animationCtrl: AnimationController,
              public fb: FormBuilder,
              public router: Router,public alertController: AlertController,
              private storage : StorageService) {
    this.fmLogin = this.fb.group({
      'usuario': new FormControl("", Validators.required),
      'password': new FormControl("", Validators.required)
    });
  }


  async ngOnInit() {
    //var alumnos = localStorage.getItem('alumno');
    //Aplicando storage Capacitor
    var alumnos = await this.storage.getItem('alumno');
    if(alumnos==null){
      var alumno = {
        id:1,
        usuario: 'Alumno1',
        password: 123456,
        name: 'Pedrito',
        lastName: 'Pazcal',
        rut: '11111111-1',
        carrera: 'medicina',
        region: 'Region Metropolitana',
        comuna: 'Puente Alto'
      }
      var alumno2 = {
        id:2,
        usuario: 'Alumno2',
        password: 123456,
        name: 'Leonardo',
        lastName: 'Dikaprioh',
        rut: '22222222-2',
        carrera: 'fotografia',
        region: 'Region Metropolitana',
        comuna: 'Pintana'
      }
      var agregar = [alumno, alumno2]
      //localStorage.setItem('alumno',JSON.stringify(agregar));
      //Aplicando storage Capacitor
      await this.storage.setItem('alumno', JSON.stringify(agregar));

    }

  }

  ngAfterViewInit() {
    this.animation = this.animationCtrl
      .create()
      .addElement(this.title.nativeElement)
      .duration(1500)
      .iterations(Infinity)
      .fromTo('transform', 'translateX(-100px)', 'translateX(100px)')
      .fromTo('opacity', '10', '0.5');
    this.animation.play();
  }

  //Verificar datos de login
  async verificarLogin(){
    var form = this.fmLogin.value;
    //var alumnos = localStorage.getItem('alumno');
    //Aplicando storage Capacitor
    var alumnos = await this.storage.getItem('alumno');

    if (alumnos!==null) {
      var usersItems = JSON.parse(alumnos);
      let userItems = usersItems.find( (alumno: { usuario: string; }) =>
      alumno.usuario === form.usuario
      );

      if(this.fmLogin.invalid){
        const alert = await this.alertController.create({
          header: 'Datos incompletos',
          message: 'Debe llenar todos los datos.',
          buttons: ['Aceptar']
        });
        await alert.present();
        this.limpiarInputs();
        return;
      }
      if (userItems && userItems.usuario == form.usuario && userItems.password == form.password) {
        //ELIMINAR Posibles datos anteriores
        localStorage.removeItem('login');
        //CREAR nuevo login
        var login ={
          id: userItems.id,
          name: userItems.name,
          lastName: userItems.lastName,
          ingreso: true
        }

        //localStorage.setItem('login',JSON.stringify(login));
        ////Aplicando storage Capacitor
        await this.storage.setItem("login",JSON.stringify(login));
        //Redirigir al usuario ingresado

        this.router.navigate(['/home']);
        this.limpiarInputs();
      } else {
        const alert = await this.alertController.create({
          header: 'Datos Erróneo',
          message: 'Debe ingresar datos validos.',
          buttons: ['Aceptar']
        });
        await alert.present();
        this.limpiarInputs();
        return;
      }
    }
  }

  //Limpiar inputs
  limpiarInputs(){
    this.fmLogin.reset();
  }

  //Crear contraseña
  recuperarPass(){
    this.router.navigate(['/recuperar-pass']);
  }

}
