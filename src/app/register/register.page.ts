import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { LocationService } from 'src/app/services/location.service';
import { Comuna } from 'src/app/models/comuna';
import { Region } from 'src/app/models/region';
import { StorageService } from '../services/storage.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  fmRegistro: FormGroup;
  validation: boolean = false;
  rutDv!: string;
  rut!: string;
  dv!: string;
  id!: number;
  regiones:Region[]=[];
  comunas:Comuna[]=[];
  seleccionComuna:boolean = true;
  regionSel:number = 0;
  comunaSel:number = 0;
  comuna!: any;
  region!: any;

  constructor(
              public fb: FormBuilder,
              public router: Router,
              public alertController: AlertController,
              private locationService:LocationService,
              private storage :StorageService) {
    this.fmRegistro = new FormGroup({
      rut: new FormControl('',Validators.required),
      dv: new FormControl('',Validators.required),
      usuario: new FormControl('',Validators.required),
      nombre: new FormControl('',Validators.required),
      apellido: new FormControl('',Validators.required),
      password: new FormControl('',Validators.required),
      carrera: new FormControl('',Validators.required),
      comuna: new FormControl(Validators.required),
      region: new FormControl(Validators.required)
    });
  }

  ngOnInit() {
    this.cargarRegion();
  }
  //API Regiones y Comunas
  async cargarRegion(){
    const req = await this.locationService.getRegion();
    this.regiones = req.data;
  }

  async cargarComuna(){
    this.seleccionComuna = false;
    const req = await this.locationService.getComuna(this.regionSel);
    this.comunas = req.data;
  }


  //Verificar Formulario de registro
  async onSubmit(){
    var form = this.fmRegistro.value;
    let rutLength = form.rut.toString().length;
    let regex: RegExp = /^[0-9K]+$/;
    if(this.fmRegistro.invalid){
      const alert = await this.alertController.create({
        header: 'Datos incompletos',
        message: 'Debe llenar todos los datos.',
        buttons: ['Aceptar']
      });
      await alert.present();
      this.limpiarcampos();
      return;
    }
    if (form.rut=='' || rutLength < 7 || rutLength > 8 || form.dv.length!=1 || !regex.test(form.dv.toUpperCase())){
      const alert = await this.alertController.create({
        header: 'Datos incorrectos',
        message: 'Ingrese rut 7-8 dígitos y Dv del 1-9 o k.',
        buttons: ['Aceptar']
      });
      await alert.present();
      this.limpiarcampos();
      return;
    } else if (form.usuario.length>8 || form.usuario.length<3 || form.usuario=='') {
      const alert = await this.alertController.create({
        header: 'Datos incorrectos',
        message: 'Usuario debe ser entre 3-8 dígitos.',
        buttons: ['Aceptar']
      });
      await alert.present();
      this.limpiarcampos();
      return;
    } else if(form.password.length<4 || form.password==''){
      const alert = await this.alertController.create({
        header: 'Datos incorrectos',
        message: 'Password debe ser 4 dígitos mínimos.',
        buttons: ['Aceptar']
      });
      await alert.present();
      this.limpiarcampos();
      return;

    } else if (form.carrera.length<3 || form.carrera=='') {
      const alert = await this.alertController.create({
        header: 'Datos incorrectos',
        message: 'Carrera debe ser 4 dígitos mínimos.',
        buttons: ['Aceptar']
      });
      await alert.present();
      this.limpiarcampos();
      return;
    } else if (this.regionSel == 0 || this.comunaSel== 0) {
      const alert = await this.alertController.create({
        header: 'Datos incorrectos',
        message: 'Debe seleccionar la Region y comuna.',
        buttons: ['Aceptar']
      });
      await alert.present();
      this.limpiarcampos();
      return;
    }
    return this.validation = true;
  }
  //Guardar usuario
  async guardarUser(){
    var validation = await this.onSubmit();
    var form = this.fmRegistro.value;
    this.rutDv = form.rut+'-'+form.dv;

    if (validation) {
      let alumnos = await this.storage.getItem('alumno');
      if (alumnos) {
        //let usersItems: any[] = JSON.parse(localStorage.getItem('alumno') || '[]');
        if (alumnos !== null) {
          let usersItems: any[] = JSON.parse(alumnos);

          this.id = usersItems[usersItems.length -1].id;
          this.id++;
          // Encuentra el índice del usuario que deseas modificar
          let index = usersItems.findIndex(user => user.rut === this.rutDv);
          // Si el rut existe, modifica sus datos
          if (index !== -1) {
            const alert = await this.alertController.create({
              header: 'Usuario existente',
              message: 'Ingrese datos correctos.',
              buttons: ['Aceptar']
            });
            await alert.present();
            return;

          } else{
            let indexUser = usersItems.findIndex(user => user.usuario === form.usuario);
            let regionRelacionada = this.regiones.find(region => region.id == form.region);
            let comunaRelacionada = this.comunas.find(comuna=> comuna.id == form.comuna);

            if (indexUser==-1) {
              var alumno = {
                id: this.id,
                usuario: form.usuario,
                password: form.password,
                name: form.nombre,
                lastName: form.apellido,
                rut: this.rutDv,
                carrera: form.carrera,
                region: regionRelacionada?.nombre,
                comuna: comunaRelacionada?.nombre
              }
              usersItems.push(alumno);
              // Guarda los datos modificados de nuevo en el localStorage
              this.storage.setItem('alumno', JSON.stringify(usersItems));
              const alert = await this.alertController.create({
                header: 'Datos con exito!',
                message: 'Se han actualizado los datos.',
                buttons: ['Aceptar']
              });
              await alert.present();
              this.router.navigate(['/login']);
              this.limpiarcampos();

            } else {
              const alert = await this.alertController.create({
                header: 'Datos sin éxito!',
                message: 'El Usuario existe, intente con otro.',
                buttons: ['Aceptar']
              });
              await alert.present();
              this.router.navigate(['/register']);
              this.limpiarcampos();
            }

          }
        }
      }

    }


  }
  //Limpiar campos de registro
  limpiarcampos() {
    this.fmRegistro.reset();
  }

}
