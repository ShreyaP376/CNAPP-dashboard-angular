import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../../shared.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  
  categories= [
    {
      id: 1,
      name: 'CSPM Executive Dashboard',
      widgets: [
        {
          id: 'cspm-widget-1',
          name: 'Cloud Accounts',
          text: 'Pie chart of cloud accounts',
          selected: true,
        },
        {
          id: 'cspm-widget-2',
          name: 'Cloud Account Risk Assessment',
          text: 'CARA',
          selected: true,
        },
      ],
    },
    {
      id: 2,
      name: 'CWPP Dashboard',
      widgets: [
        {
          id: 'cwpp-widget-1',
          name: 'Top 5 Namespace specific Alerts',
          text: 'No data available',
          selected: true,
        },
        {
          id: 'cwpp-widget-2',
          name: 'Workload Alerts',
          text: 'No data available',
          selected: true,
        },
      ],
    },
    {
      id: 3,
      name: 'Registry Scan',
      widgets: [
        {
          id: 'registry-widget-1',
          name: 'Image Risk Assessment',
          text: 'Images chart',
          selected: true,
        },
        {
          id: 'registry-widget-2',
          name: 'Image Security Issues',
          text: 'Registry',
          selected: true,
        },
      ],
    },
  ];

  selectedButton: string = '';
  filteredCategories: any[] = [];
  selectedCategory: string = '';
  isPanelOpen = false;
  activeTab = '';
  tempCategories: any[] = [];
  tempWidgetsForActiveTab: any[] = [];
  newWidName: string = '';
  newWidText: string = '';
  openForm = false;

    
  constructor(private sharedService: SharedService) {}

  ngOnInit() {
    this.filteredCategories = this.categories; 

    this.sharedService.searchText.subscribe((searchText: string) => {
      this.filteredCategories = this.categories.filter(category =>
        category.widgets.some(widget =>
        widget.name.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    });
  }

  trackByCategory(index: number, category: any) {
    return category.id;
  }

  trackByWidget(index: number, widget: any) {
    return widget.id;
  }

  selectButton(button: string) {
    if (button === 'refresh') {
      window.location.reload();
      this.selectedButton = button;
    } else {
      this.selectedButton = button; // Set the selected button to the clicked one
    }
  }

  getSelectedWidgets(category: any) {
    return category.widgets.filter((w: any) => w.selected);
  }

  closeSidePanel() {
    this.openForm = false;
    this.isPanelOpen = false;
  }

  selectTab(tabName: string) {
    this.activeTab = tabName;
    this.setWidgetsForActiveTab();
  }

  openSidePanel(activeName: string) {
    this.tempCategories = this.categories.map((category) => ({
      ...category,
      widgets: category.widgets.map((widget) => ({
        ...widget,
        selected: widget.selected,
      })),
    }));

    if (this.tempCategories.length > 0) {
      this.activeTab = activeName ? activeName : this.tempCategories[0].name; // ✅ Set first category as default tab
    }

    this.setWidgetsForActiveTab();
    this.isPanelOpen = true;
  }

  setWidgetsForActiveTab() {
    if (this.activeTab) {
      const activeCategory = this.tempCategories.find(
        (c) => c.name === this.activeTab
      );
      this.tempWidgetsForActiveTab = activeCategory
        ? activeCategory.widgets
        : [];
    }
  }

  confirmSelection() {
    this.categories.forEach((category, index) => {
      category.widgets.forEach((widget, widgetIndex) => {
        widget.selected =
          this.tempCategories[index].widgets[widgetIndex].selected;
      });
    });
    if (this.newWidName.trim() && this.newWidText.trim()) {
      const activeCategory = this.categories.find(
        (c) => c.name === this.activeTab
      );
      if (activeCategory) {
        activeCategory.widgets.push({
          id: 'new-widget-' + Date.now(),
          name: this.newWidName,
          text: this.newWidText,
          selected: true,
        });
      }
    }
    localStorage.setItem('categories', JSON.stringify(this.categories));
    this.newWidName = '';
    this.newWidText = '';
    this.openForm = false;
    this.isPanelOpen = false;
  }

  addWidget() {
    this.openForm = true;
  }
}
