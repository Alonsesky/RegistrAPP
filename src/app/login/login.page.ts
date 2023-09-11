import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Animation, AnimationController, IonCardTitle } from '@ionic/angular';

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

  constructor(private animationCtrl: AnimationController, public fb: FormBuilder, public router: Router) {
    this.fmLogin = this.fb.group({
      'usuario': new FormControl("", Validators.required),
      'password': new FormControl("", Validators.required)
    });
  }


  ngOnInit() {
    var alumno = {
      id:1,
      usuario: 'Alumno1',
      password: 123456,
      name: 'Pedrito',
      lastName: 'Pazcal',
      rut: '11111111-1'
    }
    var alumno2 = {
      id:2,
      usuario: 'Alumno2',
      password: 123456,
      name: 'Peduuuu',
      lastName: 'Pazcal',
      rut: '11111111-1'
    }
    var alumnos = [alumno, alumno2]
    localStorage.setItem('alumno',JSON.stringify(alumnos));
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
  verificarLogin(){
    var form = this.fmLogin.value;
    var alumnos = localStorage.getItem('alumno');
  
    
    if (alumnos!==null) {
      var usersItems = JSON.parse(alumnos);
      let userItems = usersItems.find( (alumno: { usuario: string; }) => 
      alumno.usuario === form.usuario
      );
      if (userItems && userItems.usuario == form.usuario && userItems.password == form.password) {
        //ELIMINAR Posibles datos anteriores
        localStorage.removeItem('login');
        //CREAR nuevo login
        var login ={
          id: userItems.id,
          name: userItems.name,
          lastName: userItems.lastName
        }
        localStorage.setItem('login',JSON.stringify(login));
        //Redirigir al usuario ingresado
        this.router.navigate(['/home']); 
        this.limpiarInputs();
      }
    }
  }

  //Limpiar inputs
  limpiarInputs(){
    this.usuario = '';
    this.password= '';
  }
}