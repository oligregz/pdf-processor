import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Download } from './download.component';

describe('Download', () => {
  let component: Download;
  let fixture: ComponentFixture<Download>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Download]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Download);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
