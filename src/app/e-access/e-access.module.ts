import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EAccessPageRoutingModule } from './e-access-routing.module';

import { EAccessPage } from './e-access.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EAccessPageRoutingModule
  ],
  declarations: [EAccessPage]
})
export class EAccessPageModule {}
