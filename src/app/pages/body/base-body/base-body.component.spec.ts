import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { of } from "rxjs";
import { GitBody } from "../../../model/git-body";
import { LayoutData } from "../../../model/layout-data/layout-data";
import { AdminManagerService } from '../../../services/admin-manager/admin-manager.service';
import { ColorConvertorService } from '../../../services/color-to-rgba/color-convertor.service';
import { ComponentFacadeService } from '../../../services/component-facade/component-facade.service';
import { StringToHtmlService } from '../../../services/string-to-html/string-to-html.service';
import { BaseBodyComponent } from './base-body.component';

describe('BaseBodyComponent', () => {
  let component: BaseBodyComponent;
  let fixture: ComponentFixture<BaseBodyComponent>;
  let componentFacade: ComponentFacadeService
  let stringToHtml: StringToHtmlService
  let colorConvertor: ColorConvertorService
  let adminManager: AdminManagerService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseBodyComponent],
      imports: [
            HttpClientTestingModule,
            ButtonModule,
            DropdownModule,
            FileUploadModule,
        ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseBodyComponent);
    componentFacade = TestBed.inject(ComponentFacadeService);
    stringToHtml = TestBed.inject(StringToHtmlService);
    colorConvertor = TestBed.inject(ColorConvertorService);
    adminManager = TestBed.inject(AdminManagerService);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    console.log("");
    expect(component).toBeTruthy();
  });

  it('LayoutData should contains only those keys'
    + "key, height, width, opacity, imageBackgroundColor, textData, hasBeenSaved"
    + '"', () => {
    const layoutData: LayoutData = getInitialTab().at(0)!;
    const layoutDataKeys = Object.keys(layoutData);
    const layoutDataKeysToString
      = layoutDataKeys
        .join(", ")

    expect(layoutDataKeysToString).toEqual("key, height, width, opacity, imageBackgroundColor, textData, hasBeenSaved");
    expect(layoutDataKeys.length).toBe(7);
  });

  it('TextData should contains only those keys: '
    + "value, color, size, police"
    + '"', () => {
    const layoutData: LayoutData = getInitialTab().at(0)!;
    const layoutDataKeys = Object.keys(layoutData.textData);
    const layoutDataKeysToString
      = layoutDataKeys
        .join(", ")

    expect(layoutDataKeysToString).toEqual("value, color, size, police");
    expect(layoutDataKeys.length).toBe(4);
  });

  it('onInit, all layoutElements should be set', () => {
    const layoutDataTab: LayoutData[] = getInitialTab();
    const layoutData: LayoutData = layoutDataTab.at(0)!;

    prepareTestOfOnInit(layoutDataTab, layoutData);

    component.ngOnInit();

    expect(component.imageBackgroundColor).toBe(layoutData.imageBackgroundColor);
    expect(component.height).toBe(layoutData.height);
    expect(component.width).toBe(layoutData.width);
    expect(component.opacity).toBe(layoutData.opacity);
    expect(component.textValue).toBe(layoutData.textData.value);
  });

  it('onInit, imageUrl should be set', () => {
    const layoutDataTab: LayoutData[] = getInitialTab();
    const layoutData: LayoutData = layoutDataTab.at(0)!;

    prepareTestOfOnInit(layoutDataTab, layoutData);

    component.ngOnInit();

    expect(component.imageUrl).toEqual('fakeUrl');
  });

  it('onInit, dropdownIndexes should be set', () => {
    const layoutDataTab: LayoutData[] = getInitialTab();
    const layoutData: LayoutData = layoutDataTab.at(0)!;

    prepareTestOfOnInit(layoutDataTab, layoutData);

    component.ngOnInit();

    const indexes = layoutDataTab.map(element => element.key)

    expect(component.dropdownTab).toEqual(indexes);
  });

  it('onInit, componentFacade should be call with proper repository', () => {
    component.layoutJsonName = 'fakeJsonRepository';

    componentFacade.loadData(component.layoutJsonName);

    expect(componentFacade.gitManager.finalApiUrl).toContain(component.layoutJsonName);
  });

  it('onInit, layoutDataTabFromDb and layoutDataTabCurrent should be set', () => {
    const layoutDataTab: LayoutData[] = getInitialTab();

    spyOn(componentFacade, 'loadData')
      .and.returnValue(of({
        sha: 'fakeSha'
      }))

    spyOn(componentFacade.gitManager, 'getStringifyResponseContent')
      .and.returnValue(layoutDataTab);

    spyOn(component, 'wrapForkJoin')
      .and.returnValue(of(['toto']));

    spyOn(componentFacade, 'getImageUrl')
    .and.returnValue('fakeUrl');

    component.ngOnInit();

    expect(componentFacade.layoutManager.layoutDataTabFromDb).toBe(layoutDataTab);
    expect(componentFacade.layoutManager.layoutDataTabCurrent).toBe(layoutDataTab);
  });

  it('on loadLayoutDataDropdown, selectIndex should be set', () => {
    componentFacade.layoutManager.layoutData = getInitialTab()[0];

    const event = {value: 3};

    spyOn(componentFacade, 'updateCurrentLayoutDataTab')

    spyOn(componentFacade, 'getImageUrl')
      .and.returnValue('fakeUrl');

    spyOn(componentFacade, 'getLayoutElements')
      .and.returnValue({
        imageUrl: 'fakeUrl',
        layoutData: getInitialTab().at(0)!
      });

    component.loadLayoutDataDropdown(event);

    expect(component.selectedIndex).toBe(3);
  });

  it('on loadLayoutDataDropdown, currentLayoutDataTab should be updated', () => {
    const event = {value: 3};
    const layoutDataTab: LayoutData[] = getInitialTab()
    const layoutData: LayoutData = {
      key: 2,
      height: 60,
      width: 60,
      opacity: 0.5,
      imageBackgroundColor: 'otherImageBackgroundColor',
      textData: {
        value: 'toto',
        color: 'toto',
        size: 12,
        police: "toto",
      },
      hasBeenSaved: ''
    }

    componentFacade.layoutManager.layoutDataTabCurrent = layoutDataTab;
    componentFacade.layoutManager.layoutData = layoutData;

    spyOn(componentFacade, 'getImageUrl')
      .and.returnValue('fakeUrl');

    spyOn(componentFacade, 'getLayoutElements')
      .and.returnValue({
        imageUrl: 'fakeUrl',
        layoutData: getInitialTab().at(0)!
      });

    component.loadLayoutDataDropdown(event);

    expect(componentFacade.layoutManager.layoutDataTabCurrent[0]).toEqual(layoutDataTab[0]);
    expect(componentFacade.layoutManager.layoutDataTabCurrent[1]).toEqual(layoutData);
    expect(componentFacade.layoutManager.layoutDataTabCurrent[1] == layoutDataTab[0]).toBeFalse();
  });

  it('on loadLayoutDataDropdown, layoutElements should be set', () => {
    componentFacade.layoutManager.layoutData = getInitialTab()[0];

    const event = {value: 2};
    const layoutDataTab: LayoutData[] = getInitialTab();
    componentFacade.layoutManager.layoutDataTabCurrent = layoutDataTab;

    spyOn(componentFacade, 'updateCurrentLayoutDataTab')

    spyOn(componentFacade, 'getImageUrl')
    .and.returnValue('fakeUrl');

    component.loadLayoutDataDropdown(event);

    console.log("");

    const expectedlayoutDataSet
      = layoutDataTab.filter(element => element.key == event.value)
        .at(0)!

    expect(component.imageBackgroundColor).toBe(expectedlayoutDataSet.imageBackgroundColor)
    expect(component.height).toBe(expectedlayoutDataSet.height)
    expect(component.width).toBe(expectedlayoutDataSet.width)
    expect(component.opacity).toBe(expectedlayoutDataSet.opacity)
    expect(component.textValue).toBe(expectedlayoutDataSet.textData.value)
  });

  it('on loadLayoutDataDropdown, layoutData should be set without not ui keys', () => {
    const layoutData = getInitialTab()[0]
    componentFacade.layoutManager.layoutData = layoutData;

    component.height = 4;
    component.width = 4;
    component.opacity = 0.7;
    component.imageBackgroundColor = 'tutu';
    component.textValue = 'tutu'
    component.textColor = 'tutu'
    component.textSize = 12
    component.textPolice = 'tutu'

    const event = {value: 3};

    spyOn(componentFacade, 'updateCurrentLayoutDataTab')

    spyOn(componentFacade, 'getImageUrl')
      .and.returnValue('fakeUrl');

    spyOn(component, 'setLayoutElements')

    component.loadLayoutDataDropdown(event);

    expect(componentFacade.layoutManager.layoutData.height).toEqual(component.height);
    expect(componentFacade.layoutManager.layoutData.width).toEqual(component.width);
    expect(componentFacade.layoutManager.layoutData.opacity).toEqual(component.opacity);
    expect(componentFacade.layoutManager.layoutData.imageBackgroundColor).toEqual(component.imageBackgroundColor);
    expect(componentFacade.layoutManager.layoutData.textData.value).toEqual(component.textValue);
    expect(componentFacade.layoutManager.layoutData.textData.color).toEqual(component.textColor);
    expect(componentFacade.layoutManager.layoutData.textData.size).toEqual(component.textSize);
    expect(componentFacade.layoutManager.layoutData.textData.police).toEqual(component.textPolice);

    expect(componentFacade.layoutManager.layoutData.key).toEqual(layoutData.key);
    expect(componentFacade.layoutManager.layoutData.hasBeenSaved).toEqual(layoutData.hasBeenSaved);
  });

  it('on loadLayoutDataDropdown, imageUrl should be set', () => {
    componentFacade.layoutManager.layoutData = getInitialTab()[0];

    const event = {value: 3};

    spyOn(componentFacade, 'updateCurrentLayoutDataTab')

    spyOn(componentFacade, 'getImageUrl')
      .and.returnValue('fakeUrl');

    spyOn(componentFacade, 'getLayoutElements')
      .and.returnValue({
        imageUrl: 'fakeUrl',
        layoutData: getInitialTab().at(0)!
      });

    component.loadLayoutDataDropdown(event);

    expect(component.imageUrl).toBe('fakeUrl');
  });

  it('on saveLayout, layout should be saved in proper repository', () => {
    componentFacade.layoutManager.layoutData = getInitialTab().at(0)!;
    component.layoutJsonName = 'fakeRepositoryName';
    component.selectedIndex = 1;

    spyOn(componentFacade.layoutManager, 'updateLayoutDataTab');
    spyOn(componentFacade.layoutManager.gitManager, 'getData')
      .and.returnValue(of('toto'));

    spyOn(componentFacade.layoutManager, 'putData')
      .and.returnValue(of('toto'));

    component.saveLayout()

    expect(componentFacade.gitManager.finalApiUrl).toContain(component.layoutJsonName);
  });

  it('on saveLayout, layoutDataFromDb should be updated with index from currentLayoutData', () => {
    component.layoutJsonName = 'fakeRepositoryName';
    component.selectedIndex = 1;

    componentFacade.layoutManager.layoutData = getInitialTab().filter(element => element.key == component.selectedIndex).at(0)!

    componentFacade.layoutManager.layoutDataTabFromDb = [
      {
        key: 1,
        height: 60,
        width: 60,
        opacity: 0.5,
        imageBackgroundColor: 'toto',
        textData: {
          value: 'toto',
          color: 'toto',
          size: 12,
          police: "toto",
        },
        hasBeenSaved: 'toto',
      },
      {
        key: 2,
        height: 60,
        width: 60,
        opacity: 0.5,
        imageBackgroundColor: 'toto',
        textData: {
          value: 'toto',
          color: 'toto',
          size: 12,
          police: "toto",
        },
        hasBeenSaved: 'toto',
      }
    ]

    spyOn(componentFacade.layoutManager, 'loadData')
      .and.returnValue(of('toto'));

    spyOn(componentFacade.layoutManager, 'putData')
      .and.returnValue(of('toto'));

    component.saveLayout()

    const layoutDataFromDbUpdated
      = componentFacade.layoutManager.
        layoutDataTabFromDb.filter(element => element.key == component.selectedIndex).at(0);

    expect(layoutDataFromDbUpdated).toEqual(componentFacade.layoutManager.layoutData);
  });

  it('on saveLayout, layoutDataFromDb should be saved', () => {
    component.layoutJsonName = 'fakeRepositoryName';
    component.selectedIndex = 1;
    componentFacade.layoutManager.layoutData = {
      key: 1,
      height: 60,
      width: 60,
      opacity: 0.5,
      imageBackgroundColor: 'toto',
      textData: {
        value: 'toto',
        color: 'toto',
        size: 12,
        police: "toto",
      },
      hasBeenSaved: 'toto',
    },

    componentFacade.layoutManager.layoutDataTabFromDb = getInitialTab();

    spyOn(componentFacade.layoutManager, 'updateLayoutDataTab')

    spyOn(componentFacade.layoutManager, 'loadData')
      .and.returnValue(of({sha: 'fakeSha'}));

    const mySpy = spyOn(componentFacade.layoutManager.gitManager, 'putData')
                    .and.returnValue(of('toto'));

    component.saveLayout()

    const gitBody: GitBody
      = componentFacade
          .layoutManager
          .gitManager
          .getGitBody(
            component.layoutJsonName,
            JSON.stringify(componentFacade.layoutManager.layoutDataTabFromDb),
            'fakeSha'
          )

    expect(mySpy).toHaveBeenCalledWith(gitBody)

  });

  it('on saveImage, proper imageUrl should be saved', () => {
    component.imageUrl = 'fake,url'
    component.imageFolder = 'fakeFolder'
    component.selectedIndex = 2
    componentFacade.imageDataUtils.finalPath = 'fakeFinalPath'

    spyOn(componentFacade.imageDataUtils, 'loadImageData')
      .and.returnValue(of({
        sha: 'fakeSha'
      }));

    const mySpy = spyOn(componentFacade.imageDataUtils.gitManager, 'putData')
      .and.returnValue(of('toto'));

    component.saveImage();

    const gitBody: GitBody
    = componentFacade
        .layoutManager
        .gitManager
        .getGitBody(
          componentFacade.imageDataUtils.finalPath,
          component.imageUrl.split(',')[1],
          'fakeSha'
        )

    expect(mySpy).toHaveBeenCalledWith(gitBody)

  });

  it('on saveImage, image should be saved in proper repository', () => {
    component.imageUrl = 'dontCare,Url'
    component.imageFolder = 'fakeFolder'
    component.selectedIndex = 2
    componentFacade.imageDataUtils.finalPath = 'fakeFinalPath'

    const mySpy = spyOn(componentFacade.imageDataUtils.gitManager, 'get')
                  .and.returnValue(of({
                    sha: 'fakeSha'
                  }));

    spyOn(componentFacade.imageDataUtils, 'putData')
      .and.returnValue(of('toto'));

    component.saveImage();

    const repositoryPath: string = "fakeFolder/image-content-2.txt";

    expect(repositoryPath).toContain(component.imageFolder)
    expect(mySpy).toHaveBeenCalledWith(repositoryPath);
  });

  it('on saveImage, image should be saved with proper index', () => {
    component.imageUrl = 'dontCare,Url'
    component.imageFolder = 'fakeFolder'
    component.selectedIndex = 2
    componentFacade.imageDataUtils.finalPath = 'fakeFinalPath'

    const mySpy = spyOn(componentFacade.imageDataUtils.gitManager, 'get')
                  .and.returnValue(of({
                    sha: 'fakeSha'
                  }));

    spyOn(componentFacade.imageDataUtils, 'putData')
      .and.returnValue(of('toto'));

    component.saveImage();

    const repositoryPath: string = "fakeFolder/image-content-2.txt";

    expect(repositoryPath).toContain(component.selectedIndex.toString())
    expect(mySpy).toHaveBeenCalledWith(repositoryPath);
  });

  it('on getImageBackgroundStyle, backgroundColor should be set when color is rendered', () => {
    componentFacade.layoutManager.layoutData = getInitialTab().at(1)!;
    const layoutData: LayoutData = getInitialTab().at(1)!;

    component.imageBackgroundColor = layoutData.imageBackgroundColor;
    component.height = layoutData.height;
    component.width = layoutData.width;
    component.opacity = layoutData.opacity;

    component.printBackgroundData();
    const backgroundStyle: string = component.getImageBackgroundStyle()
    const expectedBackgroundColor: string = "background-color: rgba(30, 144, 255, 0.005);"

    expect(backgroundStyle).toContain(expectedBackgroundColor);
  });

  it('on getImageBackgroundStyle, backgroundColor should not be set when color is not rendered', () => {
    componentFacade.layoutManager.layoutData = getInitialTab().at(1)!;
    const layoutData: LayoutData = getInitialTab().at(0)!;

    component.imageBackgroundColor = layoutData.imageBackgroundColor;
    component.height = layoutData.height;
    component.width = layoutData.width;
    component.opacity = layoutData.opacity;

    component.doNotPrintBackgroundData()
    const backgroundStyle: string = component.getImageBackgroundStyle()

    expect(backgroundStyle).not.toContain("background-color");
  });

  function prepareTestOfOnInit(layoutDataTab: LayoutData[], layoutData: LayoutData){
    const response = {
      sha: 'fakeSha',
      layoutDataTab: layoutDataTab
    }
    spyOn(componentFacade, 'loadData')
      .and.returnValue(of(response));

    spyOn(componentFacade, 'initImplicitDependencies')

    spyOn(componentFacade, 'getLayoutElements')
      .and.returnValue({
        imageUrl: '',
        layoutData: layoutData
      })

    spyOn(component, 'wrapForkJoin')
      .and.returnValue(of(['toto']));

    spyOn(componentFacade, 'getImageUrl')
    .and.returnValue('fakeUrl');

    const indexes = layoutDataTab.map(element => element.key);

    spyOn(componentFacade, 'getDropdownIndexes')
    .and.returnValue(indexes);
  }
});

function getInitialTab(): LayoutData[]{
  return [
    {
      key: 1,
      height: 60,
      width: 60,
      opacity: 0.5,
      imageBackgroundColor: 'fakeImageBackgroundColor_1',
      textData: {
        value: 'fakeImageText_1',
        color: '#1E90FF',
        size: 12,
        police: "fakePolice",
      },
      hasBeenSaved: 'fakehasBeenSaved_1',
    },
    {
      key: 2,
      height: 60,
      width: 60,
      opacity: 0.5,
      imageBackgroundColor: '#1E90FF',
      textData: {
        value: 'fakeImageText_2',
        color: '#1E90FF',
        size: 12,
        police: "fakePolice",
      },
      hasBeenSaved: 'fakehasBeenSaved_2',
    },
  ];
}
