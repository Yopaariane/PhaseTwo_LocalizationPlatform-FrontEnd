import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-progress-circle',
  imports: [CommonModule],
  templateUrl: './progress-circle.component.html',
  styleUrl: './progress-circle.component.css'
})
export class ProgressCircleComponent {
  @Input() progress: number = 0; // Progress percentage (0-100)
  @Input() borderColor: string = '#d10b4f';
  @Input() textColor: string = '#d10b4f'

  leftRotation: number = 0;
  rightRotation: number = 0;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['progress']) {
      this.updateProgress();
    }
  }

  private updateProgress() {
    const validProgress = Math.max(0, Math.min(100, this.progress));

    if (validProgress <= 50) {
      this.rightRotation = (validProgress / 50) * 180;
      this.leftRotation = 0;
    } else {
      this.rightRotation = 180;
      this.leftRotation = ((validProgress - 50) / 50) * 180;
    }
  }
}
