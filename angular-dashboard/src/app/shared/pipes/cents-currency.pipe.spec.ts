import { TestBed } from '@angular/core/testing';
import { CentsCurrencyPipe } from './cents-currency.pipe';

describe('CentsCurrencyPipe', () => {
  it('formatea céntimos como pesos mexicanos', () => {
    const pipe = new CentsCurrencyPipe();
    expect(pipe.transform(12900)).toContain('129.00');
    expect(pipe.transform(null)).toContain('0.00');
  });
});
