import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';

const storageAlumno = 'alumno';
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private http:HttpClient) { }

  async setItem(llave:string,valor:string){
    await Preferences.set({key:llave,value:valor})
  }

  async getItem(llave:string):Promise<string | null>{
    const obj = await Preferences.get({key:llave});
    return obj.value;
  }

  async guargarUsuario(user:any[]){
    var userStorage = await this.obtenerUsuario();

    for (const i of userStorage) {
      if (i) {
        user.push(i);
      }
    }
    this.setItem(storageAlumno,JSON.stringify(user));
  }

  async obtenerUsuario(){
    const storageData = await this.getItem(storageAlumno);

    if (storageData == null) {
      return [];
    }

    const data:any[] = JSON.parse(storageData);

    if (data) {
      return data;
    }
    else{
      return [];
    }
  }

  async removeItem(llave:string){
    await Preferences.remove({key:llave});
  }

}


