import { Component, OnInit } from '@angular/core';
import { NavBarLayoutComponent } from '../../layout/nav-bar-layout/nav-bar-layout.component';
import { ProjectService } from '../../core/project.service';
import { TranslationService } from '../../core/translation.service';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { Project } from '../../core/models/project.model';

@Component({
  selector: 'app-project',
  imports: [NavBarLayoutComponent, RouterOutlet, RouterLinkActive, RouterLink, RouterModule],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent implements OnInit {
  projectId: number | null = null;
  projectName: string | undefined;
  projects: Project[] = [];
  progress: number | null = null;

  constructor(
    private projectService: ProjectService,
    private translationService: TranslationService,
    private route: ActivatedRoute,
  ){}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.projectId = Number(id);
        this.loadProjectDetails(this.projectId);
      }
    });
  }

  loadProjectDetails(id: number): void {
    this.projectService.getProjectById(id).subscribe((project: Project) => {
      this.projectName = project.name;

       // progess
      this.calculateTranslationProgress(project);
    });
  }

  calculateTranslationProgress(project: Project): void {
    this.translationService.getOverallTranslationProgressForProject(project.id).subscribe(
      (progress: number) => {
        project['progress'] = progress;
        console.log(project.progress);
        this.progress = project.progress;
      },
      error => {
        console.error(`Error fetching translation progress for term ${project.id}`, error);
      }
    );
  }
}
