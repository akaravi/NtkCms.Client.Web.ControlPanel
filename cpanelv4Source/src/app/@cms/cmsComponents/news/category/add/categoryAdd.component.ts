import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";

@Component({
  selector: "app-news-category-add",
  templateUrl: "./categoryAdd.component.html",
  styleUrls: ["./categoryAdd.component.scss"],
})
export class NewsCategoryAddComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute) {}
  Id: number;
  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.Id = +params["id"];
      console.log(this.Id);
    });
  }
}
