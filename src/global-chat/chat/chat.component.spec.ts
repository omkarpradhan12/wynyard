import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatComponentComponent } from './chat.component';

describe('ChatComponentComponent', () => {
  let component: ChatComponentComponent;
  let fixture: ComponentFixture<ChatComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
