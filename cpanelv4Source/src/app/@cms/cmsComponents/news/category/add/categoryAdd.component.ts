import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";

@Component({
  selector: "app-news-category-add",
  templateUrl: "./categoryAdd.component.html",
  styleUrls: ["./categoryAdd.component.scss"],
})
export class NewsCategoryAddComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute) {}
  Id: any;
  ngOnInit() {
    this.Id = Number.parseInt(this.activatedRoute.snapshot.paramMap.get('id'));
    this.activatedRoute
    .queryParams
    .subscribe(params => {
      // Defaults to 0 if no query param provided.
      this.Id = +params['id'] || 0;
    });

    console.log(this.Id);

  }
}
