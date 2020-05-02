import {
  Component,
  OnInit,
  Input,
  ViewChild,
  OnDestroy,
  ElementRef,
  Renderer2,
  AfterViewInit,
} from "@angular/core";

import { CmsROUTES } from "./sidebar-routes.config";
import { MenuInfo } from "./sidebar.metadata";
import { Router, ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { customAnimations } from "../../../shared/animations/custom-animations";
import { ConfigService } from "../../../shared/services/config.service";
import { LayoutService } from "../../../shared/services/layout.service";
import { Subscription } from "rxjs";
import { CoreCpMainMenuService } from "app/@cms/cmsService/core/coreCpMainMenu.service";
import { CoreCpMainMenuModel } from "app/@cms/cmsModels/core/CoreCpMainMenuModel";

@Component({
  selector: "app-cms-sidebar",
  templateUrl: "./sidebar.component.html",
  animations: customAnimations,
})
export class CmsSidebarComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("toggleIcon", { static: false }) toggleIcon: ElementRef;
  public menuItems: MenuInfo[];
  depth: number;
  activeTitle: string;
  activeTitles: string[] = [];
  expanded: boolean;
  nav_collapsed_open = false;
  logoUrl = "assets/img/logo.png";
  public config: any = {};
  layoutSub: Subscription;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private router: Router,
    private route: ActivatedRoute,
    public translate: TranslateService,
    private configService: ConfigService,
    private layoutService: LayoutService,
    private coreCpMainMenuService: CoreCpMainMenuService
  ) {
    if (this.depth === undefined) {
      this.depth = 0;
      this.expanded = true;
    }

    this.layoutSub = layoutService.customizerChangeEmitted$.subscribe(
      (options) => {
        if (options) {
          if (options.bgColor) {
            if (options.bgColor === "white") {
              this.logoUrl = "assets/img/logo-dark.png";
            } else {
              this.logoUrl = "assets/img/logo.png";
            }
          }

          if (options.compactMenu === true) {
            this.expanded = false;
            this.renderer.addClass(
              this.toggleIcon.nativeElement,
              "ft-toggle-left"
            );
            this.renderer.removeClass(
              this.toggleIcon.nativeElement,
              "ft-toggle-right"
            );
            this.nav_collapsed_open = true;
          } else if (options.compactMenu === false) {
            this.expanded = true;
            this.renderer.removeClass(
              this.toggleIcon.nativeElement,
              "ft-toggle-left"
            );
            this.renderer.addClass(
              this.toggleIcon.nativeElement,
              "ft-toggle-right"
            );
            this.nav_collapsed_open = false;
          }
        }
      }
    );
  }

  ngOnInit() {
    this.DataGetCpMenu();

    this.config = this.configService.templateConf;
    //this.menuItems = CmsROUTES; //karavi menu
    //console.log(this.menuItems);

    if (this.config.layout.sidebar.backgroundColor === "white") {
      this.logoUrl = "assets/img/logo-dark.png";
    } else {
      this.logoUrl = "assets/img/logo.png";
    }
  }
  DataGetCpMenu() {
    this.coreCpMainMenuService
      .ServiceGetAllMenu<CoreCpMainMenuModel>(null)
      .subscribe(
        (next) => {
          if (next.IsSuccess) {
            this.menuItems = this.menuConvertor(next.ListItems);
          }
        },
        (error) => {}
      );
  }
  menuConvertor(model: CoreCpMainMenuModel[]) {
    var retOut = new Array<MenuInfo>();
    model.forEach((element) => {
      var newRow: MenuInfo = {
        path: element.AddressLink,
        title: element.Title,
        icon: element.Icon,
        class: "",
        badge: "",
        badgeClass: "",
        isExternalLink: false,
        submenu: [],
      };
      if (newRow.icon == null) newRow.icon = "";

      if (element.Children && element.Children.length > 0) {
        newRow.class = "has-sub";
        newRow.submenu = this.menuConvertor(element.Children);
      }
      retOut.push(newRow);
    });
    return retOut;
  }
  ngAfterViewInit() {
    setTimeout(() => {
      if (this.config.layout.sidebar.collapsed != undefined) {
        if (this.config.layout.sidebar.collapsed === true) {
          this.expanded = false;
          this.renderer.addClass(
            this.toggleIcon.nativeElement,
            "ft-toggle-left"
          );
          this.renderer.removeClass(
            this.toggleIcon.nativeElement,
            "ft-toggle-right"
          );
          this.nav_collapsed_open = true;
        } else if (this.config.layout.sidebar.collapsed === false) {
          this.expanded = true;
          this.renderer.removeClass(
            this.toggleIcon.nativeElement,
            "ft-toggle-left"
          );
          this.renderer.addClass(
            this.toggleIcon.nativeElement,
            "ft-toggle-right"
          );
          this.nav_collapsed_open = false;
        }
      }
    }, 0);
  }

  ngOnDestroy() {
    if (this.layoutSub) {
      this.layoutSub.unsubscribe();
    }
  }

  toggleSlideInOut() {
    this.expanded = !this.expanded;
  }

  handleToggle(titles) {
    this.activeTitles = titles;
  }

  // NGX Wizard - skip url change
  ngxWizardFunction(path: string) {
    if (path.indexOf("forms/ngx") !== -1)
      this.router.navigate(["forms/ngx/wizard"], { skipLocationChange: false });
  }
}
