import { Component, DoCheck, OnInit, ViewEncapsulation } from '@angular/core';
import { CoreServices } from './core/services/core.service';
import { AuthService } from './core/auth/auth.service';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { ModalService } from './core/services/modal.service';

@Component({
  selector: 'pfep-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, DoCheck {
  title = 'oshkosh-pfep';
  showLoader = false;
  showApp = false;
  count = 0;
  currentUser: any;
  modalOpen = false;

  constructor(
    public coreService: CoreServices,
    public authService: AuthService,
    private router: Router,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.coreService.showLoader();
      } else if (event instanceof NavigationEnd) {
        this.coreService.hideLoader();
      }
    });
    let currentUserRoles = [];
    if (this.authService.userAuthData !== null) {
      if (Array.isArray(this.authService.userAuthData.roles)) {
        currentUserRoles = this.authService.userAuthData.roles;
      } else {
        currentUserRoles = JSON.parse(this.authService.userAuthData.roles);
      }
    }
    this.showApp = currentUserRoles.length > 0 ? true : false;
    if (!this.showApp) {
      this.router.navigate(['/un-authorized']);
    }

    // Modal subscription
    this.modalService.getModalSubject().subscribe(isOpen => {
      if (isOpen && this.coreService.checkLoader() > 0) {
        this.coreService.hideLoader();
      }
      this.modalOpen = isOpen as boolean;
    });
  }

  ngDoCheck() {
    this.count = this.coreService.checkLoader();
    this.showLoader = this.count === 0 ? true : false;
  }

  // confirmation modal functions

  stay = () => {
    this.modalService.stay();
  }
  navigate = () => {
    this.coreService.showLoader();
    this.modalService.navigateAway();
  }
}
