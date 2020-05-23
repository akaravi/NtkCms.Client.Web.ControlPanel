import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CoreUserRoutes } from "./coreUser.routing";
import { CoreUserProfileComponent } from "./profile/profile.component";

@NgModule({
  imports: [CommonModule, CoreUserRoutes],
  declarations: [CoreUserProfileComponent],
})
export class CoreUserModule {}
