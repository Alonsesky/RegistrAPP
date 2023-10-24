import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-recuperar-pass',
  templateUrl: './recuperar-pass.page.html',
  styleUrls: ['./recuperar-pass.page.scss'],
})
export class RecuperarPassPage implements OnInit {
  fmRegister: FormGroup;
  rutDv!: string;
  rut!: string;
  dv!: string;
  id!: number;
  validation: boolean = false;
  constructor(public fb: FormBuilder, public router: Router, public alertController: AlertController) {
    this.fmRegister = this.fb.group({
      'newPassword': new FormControl("", Validators.required),
      'rut': new FormControl("", Validators.required),
      'dv': new FormControl("", Validators.required)
    });
  }

  ngOnInit() {
  }

  async verificar(){
    var form = this.fmRegister.value;
    let rutLength = form.rut.toString().length;
    let regex: RegExp = /^[0-9K]+$/;
    if(this.fmRegister.invalid){
      const alert = await this.alertController.create({
        header: 'Datos incompletos',
        message: 'Debe llenar todos los datos.',
        buttons: ['Aceptar']
      });
      await alert.present();
      return;
    }
    if (form.rut=='' || rutLength < 7 || rutLength > 8 || form.dv.length!=1 || !regex.test(form.dv.toUpperCase())){
      const alert = await this.alertController.create({
        header: 'Datos incorrectos',
        message: 'Ingrese rut 7-8 dígitos y Dv del 1-9 o k.',
        buttons: ['Aceptar']
      });
      await alert.present();
      return;
    } else if(form.newPassword.length<4 || form.newPassword==''){
      const alert = await this.alertController.create({
        header: 'Datos incorrectos',
        message: 'Password debe ser 4 dígitos mínimos.',
        buttons: ['Aceptar']
      });
      await alert.present();
      return;

    }
    return this.validation = true;
  }

  async guardarUser(){
    var validation = await this.verificar();
    var form = this.fmRegister.value;
    var alumnos = localStorage.getItem('alumno');
    this.rutDv = form.rut+'-'+form.dv;

    if (validation) {
      if (alumnos) {
        let usersItems: any[] = JSON.parse(localStorage.getItem('alumno') || '[]');
        this.id = usersItems[usersItems.length -1].id;
        this.id++;
        // Encuentra el índice del usuario que deseas modificar
        let index = usersItems.findIndex(user => user.rut === this.rutDv);
        // Si el rut existe, modifica sus datos
        if (index !== -1) {
          usersItems[index].password = form.newPassword;
          // Guarda los datos modificados en localStorage
          localStorage.setItem('alumno', JSON.stringify(usersItems));
          const alert = await this.alertController.create({
            header: 'Contraseña actualizado con éxito!',
            message: 'Recuerda tu nueva contraseña.',
            buttons: ['Aceptar']
          });
          await alert.present();
          this.router.navigate(['/login']);

        } else{
          const alert = await this.alertController.create({
            header: 'Datos sin éxito!',
            message: 'El Usuario existe, intente con otro.',
            buttons: ['Aceptar']
          });
          await alert.present();
          this.router.navigate(['/login']);




        }
      }
    }


  }
}
