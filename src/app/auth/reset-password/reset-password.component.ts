import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ConfirmedValidator} from "../../validators/ConfirmedValidator";
import { AnprService } from '../../service/anpr.service';
import { GenericResponse, Signup } from '../../app.interface';
import { MessageService } from 'primeng/api';
interface ParamsData {
  token: string;
  email: string;
  passReset: boolean;
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  public params: ParamsData | undefined;
  public submitted: boolean = false;
  public hasResetPassword: boolean = false;
  flow = '';
  form: FormGroup = new FormGroup<any>({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private anprService: AnprService, private router: Router) {
    this.route.queryParams.subscribe((qParams: any) => {
      console.log('Object(qParams).keys   ', Object.keys(qParams));
      if (Object.keys(qParams).length > 0) {
        this.params = qParams as ParamsData;
      }
    });
    this.submitted = true;
    let flow;
    if (!this.params) {
      // password reset flow starts
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();
      this.form.get('confirmPassword')?.clearValidators();
      this.form.get('confirmPassword')?.updateValueAndValidity();
      this.flow = 'forgot';
      this.hasResetPassword = true;
    } else if (this.params?.passReset) {
      // Password Reset flow mail redirect
      this.form.get('email')?.clearValidators();
      this.form.get('email')?.updateValueAndValidity();
      this.flow = 'reset';
      this.hasResetPassword = true;
    } else {
      // User Activation flow
      this.form.get('email')?.clearValidators();
      this.form.get('email')?.updateValueAndValidity();
      this.flow = 'activate';
      this.hasResetPassword = false;
    }
    console.log('Params   ', this.params);
  }

  public sendLink(): void {
    
    const signup: Signup = this.form.value;
    signup.email = this.form.get('email')?.value;
    let endpoint: string = '';
    if (this.form.valid) {
      // make api call from here
      if (this.flow === 'forgot') {
        this.anprService.post('auth/forgot', signup.email).subscribe((res: GenericResponse) => {
          if(res.success) {
            this.anprService.addToast('success', 'Success', 'Mail sent successfully, please check.');
          } else {
            this.anprService.addToast('error', 'Error', 'Something went wrong!, please try agian');
          }
        });
      } else if (this.flow === 'reset') {
        endpoint = `auth/reset/${this.params?.email}/${this.params?.token}`;
        this.anprService.post(endpoint, signup.password).subscribe((res: GenericResponse) => {
          if(res.success) {
            this.router.navigateByUrl('login');
            this.anprService.addToast('success', 'Success', 'Successfully updated password, please login.');
          } else {
            this.anprService.addToast('error', 'Error', 'Something went wrong!, please try agian');
          }
        })
      } else {
        this.anprService.post('auth/activateUser', signup).subscribe((res: GenericResponse) => {
          if(res.success) {
            this.router.navigateByUrl('login');
            this.anprService.addToast('success', 'Success', 'Account activated successfully, please login.');
          } else {
            this.anprService.addToast('error', 'Error', 'Something went wrong!, please try agian');
          }
        })
      }
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: [{value: '', disabled: this.params}, [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    }, {
      validator: ConfirmedValidator('password', 'confirmPassword')
    });

    if (this.params?.email) {
      this.f['email'].setValue(this.params?.email)
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }


}