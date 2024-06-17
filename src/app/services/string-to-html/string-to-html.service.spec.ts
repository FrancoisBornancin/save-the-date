import { TestBed } from '@angular/core/testing';
import { StringToHtmlService } from './string-to-html.service';

describe('StringToHtmlService', () => {
  let service: StringToHtmlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StringToHtmlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('test with toto|tutu ', () => {
    const html = service.replaceString('toto|tutu');
    expect(html).toEqual('toto<br>tutu');
  });

  it('test with |toto|tutu ', () => {
    const html = service.replaceString('|toto|tutu');
    expect(html).toEqual('<br>toto<br>tutu');
  });

  it('test with |toto|tutu| ', () => {
    const html = service.replaceString('|toto|tutu|');
    expect(html).toEqual('<br>toto<br>tutu<br>');
  });

  it('test with :it:tutu:it: ', () => {
    const html = service.replaceString(':it:tutu:it:');
    expect(html).toEqual('<em>tutu</em>');
  });

  it('test with toto:it:tutu:it: ', () => {
    const html = service.replaceString('toto:it:tutu:it:');
    expect(html).toEqual('toto<em>tutu</em>');
  });

  it('test with toto:it:tutu:it:tata ', () => {
    const html = service.replaceString('toto:it:tutu:it:tata');
    expect(html).toEqual('toto<em>tutu</em>tata');
  });

  it('test with :gr:tutu:gr: ', () => {
    const html = service.replaceString(':gr:tutu:gr:');
    expect(html).toEqual('<strong>tutu</strong>');
  });

  it('test with toto:gr:tutu:gr: ', () => {
    const html = service.replaceString('toto:gr:tutu:gr:');
    expect(html).toEqual('toto<strong>tutu</strong>');
  });

  it('test with toto:gr:tutu:gr:tata ', () => {
    const html = service.replaceString('toto:gr:tutu:gr:tata');
    expect(html).toEqual('toto<strong>tutu</strong>tata');
  });

  it('test with :it:toto:gr:tutu:gr:tata:it: ', () => {
    const html = service.replaceString(':it:toto:gr:tutu:gr:tata:it:');
    expect(html).toEqual('<em>toto<strong>tutu</strong>tata</em>');
  });

  it('test with :gr:toto:it:tutu:it:tata:gr: ', () => {
    const html = service.replaceString(':gr:toto:it:tutu:it:tata:gr:');
    expect(html).toEqual('<strong>toto<em>tutu</em>tata</strong>');
  });

  it('test with :p:toto ', () => {
    console.log("");
    const html = service.replaceString(':p:toto');
    expect(html).toEqual('<ul><li>toto</li></ul>');
  });

  it('test with tata:p:toto ', () => {
    console.log("");
    const html = service.replaceString('tata:p:toto');
    expect(html).toEqual('tata<ul><li>toto</li></ul>');
  });

  it('test with :p:toto:p:tata ', () => {
    console.log("");
    const html = service.replaceString(':p:toto:p:tata');
    expect(html).toEqual('<ul><li>toto</li></ul><ul><li>tata</li></ul>');
  });

  it('test with :p:toto|tata ', () => {
    const html = service.replaceString(':p:toto|tata');
    expect(html).toEqual('<ul><li>toto</li></ul><br>tata');
  });

  it('test with :p:toto:p:tata|tutu ', () => {
    const html = service.replaceString(':p:toto:p:tata|tutu');
    expect(html).toEqual('<ul><li>toto</li></ul><ul><li>tata</li></ul><br>tutu');
  });

  it('test with :p:toto:p:tata|tutu:p:tete ', () => {
    const html = service.replaceString(':p:toto:p:tata|tutu:p:tete');
    expect(html).toEqual('<ul><li>toto</li></ul><ul><li>tata</li></ul><br>tutu<ul><li>tete</li></ul>');
  });
});
