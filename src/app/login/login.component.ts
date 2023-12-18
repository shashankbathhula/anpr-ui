import { Component } from '@angular/core';
import { AnprService } from '../service/anpr.service';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { GenericResponse } from '../app.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private anprService: AnprService, private router: Router){}

  form: FormGroup = new FormGroup<any>({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required])
  });

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  public login() {
    if(this.form.valid) {
      localStorage.clear();
      this.anprService.post('auth/login', this.form.value).subscribe({
        next: (res:GenericResponse) => {
          if (res.success) {
            localStorage.setItem('token', res.data.token);
            this.router.navigateByUrl('dashboard');
            this.anprService.addToast('success', 'User login', 'User login successfully');
          } else {
            this.anprService.addToast('error', 'Bad credentials', 'Please check email or password');
          }
        }
      })
    } 
  }
}
