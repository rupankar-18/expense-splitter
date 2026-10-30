import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MemberManagerComponent } from './member-manager.component';

describe('MemberManagerComponent', () => {
  let component: MemberManagerComponent;
  let fixture: ComponentFixture<MemberManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberManagerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MemberManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the member manager component', () => {
    expect(component).toBeTruthy();
  });

  it('should not emit when adding an empty name', () => {
    let emitted = '';
    component.addMember.subscribe((name) => (emitted = name));

    component.nameControl.setValue('   ');
    component.handleAdd();

    expect(emitted).toBe('');
    expect(component.errorMessage).toBe('Please enter a name.');
  });

  it('should emit trimmed name and reset control when adding a valid member', () => {
    let emitted = '';
    component.addMember.subscribe((name) => (emitted = name));

    component.nameControl.setValue('  Sam  ');
    component.handleAdd();

    expect(emitted).toBe('Sam');
    expect(component.nameControl.value).toBe('');
    expect(component.errorMessage).toBe('');
  });

  it('should show error and not emit if member already exists (case-insensitive)', () => {
    component.members = [{ id: 1, name: 'Alice', color: '#7c3aed' }];
    let emitted = '';
    component.addMember.subscribe((name) => (emitted = name));

    component.nameControl.setValue('alice');
    component.handleAdd();

    expect(emitted).toBe('');
    expect(component.errorMessage).toBe('"alice" is already added.');
  });
});
