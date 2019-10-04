import {
  Component,
  OnDestroy,
  AfterViewInit,
  OnInit,
  Input
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { WocheVerbrauch } from 'src/app/models/wochenverbrauch.model';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { BeowachtService } from 'src/app/services/beowacht.service';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-beo-lagerverbrauch',
  templateUrl: './lagerverbrauchbeowach.component.html',
  styleUrls: ['./lagerverbaruchbeowach.component.css']
})
export class LagerVerbrauchBeowachComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() consumo$: Observable<Array<WocheVerbrauch>>;

  public isLoading = true;
  public weekconsumo: Array<WocheVerbrauch>;
  public cuni: string;

  private subconsumos: Subscription;
  public barChartOptions: ChartOptions = {
    responsive: true
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [];
  public barChartLegend = false;
  public Etiquetas: Label[];
  public Datos: ChartDataSets[];

  constructor(private beoservice: BeowachtService) {}

  ngOnInit() {
    this.Datos = [
      {
        label: 'Verbrauch',
        data: []
      }
    ];
    this.subconsumos = this.consumo$.subscribe((c) => {
      this.weekconsumo = c;
      this.cuni = c[0].cuni;
      console.log('Consumo definido');
      this.Etiquetas = c.map((x) => `${x.jahr_kw}-${x.kw}`);
      this.Datos[0] = {
        label: 'Verbrauch',
        data: c.map((x) => x.menge),
        backgroundColor: 'rgba(0, 125, 0, 1)'
      };
      this.barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                min: 0
              },
              scaleLabel: {
                display: true,
                labelString: `in ${this.cuni}`
              }
            }
          ]
        },
        tooltips: {
          callbacks: {
            label(tooltipitem, data) {
              // console.log('tooltipitem');
              // console.log(tooltipitem);
              let label = data.datasets[tooltipitem.datasetIndex].label || '';
              if (label.length > 0) {
                const datos = tooltipitem.xLabel.toString().split('-');
                const desde: moment.Moment = moment()
                  .day('Monday')
                  .year(+datos[0])
                  .week(+datos[1]);
                const hasta = desde;
                label += `: ${tooltipitem.yLabel}\nDatum:${desde.format(
                  'DD.MM.YY'
                )}-${hasta.add(7, 'd').format('DD.MM.YY')}`;
              }
              return label;
            }
          }
        }
      };

      this.isLoading = false;
    });
  }

  Consumol52Woche(): number {
    // tslint:disable-next-line: triple-equals
    if (this.weekconsumo == undefined) {
      return 0;
    }
    const datos = this.weekconsumo.slice(0, 51);
    const salida = datos.map((x) => x.menge).reduce((a, b) => a + b);
    return salida;
  }
  ConsumoMedioWoche(): number {
    // tslint:disable-next-line: triple-equals
    if (this.weekconsumo == undefined) {
      return 0;
    }
    const datos = this.weekconsumo.slice(0, 51);
    if (datos.length === 0) {
      return 0;
    }
    return this.Consumol52Woche() / datos.length;
  }
  MedianaWoche(): number {
    // tslint:disable-next-line: triple-equals
    if (this.weekconsumo == undefined) {
      return 0;
    }
    const datos = this.weekconsumo.slice(0, 51).map((x) => x.menge);
    if (datos.length === 0) {
      return 0;
    }
    datos.sort((a, b) => a - b);
    // tslint:disable-next-line: no-bitwise
    return datos[(datos.length - 1) >> 1];
  }

  ngAfterViewInit() {}
  ngOnDestroy() {
    this.subconsumos.unsubscribe();
  }
}
