import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import {
  MatGridListModule,
  MatTooltipModule,
  MatMenuModule,
  MatButtonToggleModule,
  MatSlideToggleModule,
  MatTreeModule,
  MatExpansionModule,
  MatDividerModule,
  MatSortModule
} from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HelpersModule } from '../helpers-module/helpers-module.module';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatInputModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatIconModule,
    MatSnackBarModule,
    MatListModule,
    MatTableModule,
    MatSortModule,
    MatTreeModule,
    MatCheckboxModule,
    MatDialogModule,
    MatGridListModule,
    MatTooltipModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatMenuModule,
    MatExpansionModule,
    HelpersModule,

    ChartsModule,
    FlexLayoutModule
  ],
  exports: [
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatInputModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatIconModule,
    MatSnackBarModule,
    MatListModule,
    MatTableModule,
    MatSortModule,
    MatTreeModule,
    MatCheckboxModule,
    MatDialogModule,
    MatGridListModule,
    MatTooltipModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatMenuModule,
    MatExpansionModule,
    HelpersModule,

    ChartsModule,
    FlexLayoutModule
  ]
})
export class AppMaterialModule {}
