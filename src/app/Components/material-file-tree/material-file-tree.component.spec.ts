import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialFileTreeComponent } from './material-file-tree.component';

describe('MaterialFileTreeComponent', () => {
  let component: MaterialFileTreeComponent;
  let fixture: ComponentFixture<MaterialFileTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialFileTreeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialFileTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
