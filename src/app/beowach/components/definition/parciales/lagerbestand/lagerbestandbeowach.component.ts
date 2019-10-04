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
import { EndeWocheBestand } from 'src/app/models/endewochebestand.model';
import { LagerControl } from 'src/app/models/lagercontrol.model';

@Component({
  selector: 'app-beo-lagerbestand',
  templateUrl: './lagerbestandbeowach.component.html',
  styleUrls: ['./lagerbestandbeowach.component.css']
})
export class LagerBestandBeowachComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() bestand$: Observable<Array<EndeWocheBestand>>;
  @Input() lagercontrol$: Observable<LagerControl>;

  public isLoading = true;
  public bestand: Array<EndeWocheBestand>;
  public lagercontrol: LagerControl;
  public cuni: string;

  private subbestand: Subscription;
  private sublagercontrol: Subscription;
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
        label: 'Bestand',
        type: 'bar',
        data: []
      },
      {
        label: 'Meldungsbestand',
        data: [],
        type: 'line',
        pointRadius: 0
      }
    ];
    this.subbestand = this.bestand$.subscribe((c) => {
      this.bestand = c;
      this.cuni = c[0].cuni;
      console.log('bestand definido');
      this.Etiquetas = c.map((x) => `${x.jahr_kw}-${x.kw}`);
      this.Datos[0] = {
        label: 'bestand',
        data: c.map((x) => x.menge),
        backgroundColor: 'rgba(0, 0, 125, 1)'
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
                labelString: `in ${c[0].cuni}`
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
                  .week(+datos[1])
                  .add(6, 'd');

                label += `: ${tooltipitem.yLabel}\nDatum:${desde.format(
                  'DD.MM.YY'
                )}`;
              }
              return label;
            }
          }
        }
      };

      this.isLoading = false;
      this.sublagercontrol = this.lagercontrol$.subscribe((lc) => {
        this.lagercontrol = lc;
        this.Datos[1] = {
          label: 'Meldungsbestand',
          data: new Array(this.Datos[0].data.length).fill(lc.meldungsbestand),
          type: 'line',
          pointRadius: 0
        };
      });
    });
  }

  ngAfterViewInit() {}
  ngOnDestroy() {
    this.subbestand.unsubscribe();
    this.sublagercontrol.unsubscribe();
  }

  PromedioBestandsL52W(): number {
    // tslint:disable-next-line: triple-equals
    if (this.bestand == undefined) {
      return 0;
    }
    if (this.bestand.length === 0) {
      return 0;
    }
    const datos = this.bestand.slice(0, 52).map((x) => x.menge);
    if (datos.length === 0) {
      return 0;
    }
    const salida = datos.reduce((a, b) => a + b);
    return salida / datos.length;
  }
}
