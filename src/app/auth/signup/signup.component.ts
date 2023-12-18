import { Component } from '@angular/core';
import { AnprService } from '../../service/anpr.service';
import { Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { GenericResponse } from '../../app.interface';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  constructor(private anprService: AnprService, private router: Router){}

  form: FormGroup = new FormGroup<any>({
    firstName: new FormControl<string>('', [Validators.required, Validators.min(3), Validators.max(15)]),
    lastName: new FormControl<string>('', [Validators.required, Validators.min(3), Validators.max(15)]),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    phone: new FormControl<string>('')
  });

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  public signup() {
    if(this.form.get('phone')?.value) {
      this.form.get('phone')?.setValidators([Validators.required, Validators.max(10)]);
      this.form.get('phone')?.updateValueAndValidity;
    }

    if (this.form.valid) {
      this.anprService.post('auth/signup', this.form.value).subscribe({
        next: (res: GenericResponse) => {
          if(res.success) {
            this.anprService.addToast('success', 'Signup Success', 'Activation link sent successfully, please check mail');
          } else {
            this.anprService.addToast('error', 'Emaail found', 'Duplicate email found!')
          }
        }
      })
    }
  }
}
