import { Component, OnInit } from '@angular/core';
import { SujetService } from '../../shared/services/sujet/sujets.service';
import { Sujet } from '../../interfaces/sujet';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-sujets',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sujets.component.html',
  styleUrls: ['./sujets.component.css']
})
export class SujetsComponent implements OnInit {
  sujets: Sujet[] = [];

  constructor(private sujetService: SujetService, private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.sujetService.getTopics().then(sujets => {
      this.sujets = sujets;
    });
  }

  createsujet() {
    this.router.navigate(['createsujet']);
  }

  trackById(index: number, sujet: Sujet): number {
    return parseInt(sujet.id);
  }

  onSujetClick(sujet: Sujet) {
    this.sujetService.setSujetTitle(sujet.title);
    this.router.navigate(['/post', sujet.id]);
  }

  editSujet(sujet: Sujet) {
    console.log('Editing sujet:', sujet);
  }

  async deleteSujet(sujet: Sujet) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(async result => {
      if (result === true) {
        await this.sujetService.deleteSujet(sujet.id.toString());
        this.sujets = this.sujets.filter(s => s.id !== sujet.id);
      }
    });
  }
}
