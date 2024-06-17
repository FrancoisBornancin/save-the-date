import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorConvertorService {

  convertToRgba(hex: string): string{
    let r, g, b = 1;

    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);

    return "rgba("
              + r + ", "
              + g + ", " 
              + b + ", "
              + "1)";
  }

  addOpacity(rgba: string, opacityValue: number): string{
    const splittedRgba: string[] = rgba.split(",")

    splittedRgba[3] = " " + opacityValue + ")";
    
    return splittedRgba.map(element => element)
      .join(",")
  }
}
