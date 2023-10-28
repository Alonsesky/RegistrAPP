import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from './services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
              private storage:StorageService,
              public router: Router){}

  async verificar(){
    let login = await this.storage.getItem("login");

    if (login) {
      var item = JSON.parse(login);
      if (item && item.ingreso) {
        return true;

      }
    }
    return false;
}

  async canActivate(
    ){

      let controlar = await this.verificar();
      if (controlar) {
        return true;

      }else{
        this.router.navigate(['/e-access']);
        return false;

      }
  }

}
