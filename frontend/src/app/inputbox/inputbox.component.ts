import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-inputbox',
  templateUrl: './inputbox.component.html',
  styleUrls: ['./inputbox.component.scss']
})
export class InputboxComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  inputFormControl = new FormControl('');

  updateInput(e : any): void {
    
  }

}
