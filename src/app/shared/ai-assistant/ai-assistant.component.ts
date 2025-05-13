import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-ai-assistant',
  imports: [],
  templateUrl: './ai-assistant.component.html',
  styleUrl: './ai-assistant.component.css'
})
export class AiAssistantComponent {
  @Input() dropdownMode: boolean = false;
  @Output() closeAssistant = new EventEmitter<void>();
}
