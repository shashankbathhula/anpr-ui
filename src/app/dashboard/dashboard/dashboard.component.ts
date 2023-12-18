import { Component, OnInit } from '@angular/core';
import { AnprService } from '../../service/anpr.service';
import { Column, GenericResponse, User } from '../../app.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  constructor(private anprService: AnprService, private router: Router) {}
  public users!: User[];
  cols!: Column[];

  ngOnInit(): void {
    this.cols = [
      { field: 'firstName', header: 'FirstName' },
      { field: 'email', header: 'email' },
      { field: 'enabled', header: 'User Active' }
  ];


    this.anprService.get('user/users').subscribe({
      next: (res: GenericResponse) => {
        if(res.success) {
          // console.log('Res   ', res);
          this.users = res.data;
        } else{
          this.router.navigateByUrl('login');
        }
      }
    }) 
  }

}
