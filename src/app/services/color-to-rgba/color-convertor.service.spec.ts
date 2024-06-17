import { TestBed } from '@angular/core/testing';

import { ColorConvertorService } from './color-convertor.service';

describe('ColorConvertorService', () => {
  let service: ColorConvertorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColorConvertorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should rendered in corresponding rgba with opacity always 1', () => {

    const toRgba: string = service.convertToRgba('#00a6ff');
    const rgbaValue: string = "rgba(0, 166, 255, 1)"

    expect(toRgba).toEqual(rgbaValue);
  });

  it('should add wanted opacity to rgba', () => {

    const opacityValue: number = 0.5;
    const initialRbaValue: string = "rgba(0, 166, 255, 1)"

    const rgbaConstructed: string = service.addOpacity(initialRbaValue, opacityValue);
    const expectedRgba = "rgba(0, 166, 255, 0.5)"

    expect(rgbaConstructed).toEqual(expectedRgba);
  });
});
