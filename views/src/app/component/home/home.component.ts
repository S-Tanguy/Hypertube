import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../services/movie/movie.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  categories = [];
  search = { startYY : '', endYY: '', minNote: '', maxNote: '', category: '' };

  constructor(private _movieService: MovieService) {

  }

  ngOnInit() {
    // this.categories = le tableau de categories

  	// this._movieService.find('roi lion', 'fr')
  	// .subscribe(res =>
  	// {
  	// 	res = res.json()
  	// 	console.log(res)

  	// })
  }

  advancedSearch() {
    // fonction qui envoie this.search
  }

  onlyNumbers(e: KeyboardEvent) {
    const regexStr = '^[0-9]*$';
        if ([46, 8, 9, 27, 13, 110, 190, 171].indexOf(e.keyCode) !== -1 ||
            // Allow: Ctrl+A
            (e.keyCode === 65 && e.ctrlKey === true) ||
            // Allow: Ctrl+C
            (e.keyCode === 67 && e.ctrlKey === true) ||
            // Allow: Ctrl+V
            (e.keyCode === 86 && e.ctrlKey === true) ||
            // Allow: Ctrl+X
            (e.keyCode === 88 && e.ctrlKey === true) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39) ||
            // Allow plus button
            (e.keyCode === 107) || (e.keyCode === 187)) {
            // let it happen, don't do anything
            return;
        }
        const /** @type {?} */ ch = String.fromCharCode(e.keyCode);
        const /** @type {?} */ regEx = new RegExp(regexStr);
        if (regEx.test(ch)) {
            return;
        } else if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
}

}
