import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadComponent } from './download.component';

describe('Download', () => {
  let component: DownloadComponent;
  let fixture: ComponentFixture<DownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
