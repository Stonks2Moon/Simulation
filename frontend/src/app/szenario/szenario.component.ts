import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SzenarioService } from '../@data/szenario.service';

@Component({
  selector: 'app-szenario',
  templateUrl: './szenario.component.html',
  styleUrls: ['./szenario.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SzenarioComponent implements OnInit {

  constructor(private readonly szenarioService: SzenarioService) { }

  ngOnInit(): void {
    this.szenarioService.getAvailableSzenarios()
  }

}
