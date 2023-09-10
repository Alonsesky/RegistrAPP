import { Component } from '@angular/core';
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
  showScanner = true;
  showAlert = false;
  public alertButtons = ['OK'];
  constructor() {}

  clearResult(): void {
    this.qrResultString = '';
  }
  
  onCodeResult(resultString: string) {
    this.qrResultString = resultString;
    if (this.qrResultString!=null){
    } {
      this.showScanner = false;
      this.showAlert = true;
    }
  }

  
  /*let dataQR = this.qrResultString.split(',');
    this.dataQR = dataQR.join('\n');*/
    
}
