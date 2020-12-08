import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AlertView } from 'src/uicomponents/alert';
import { ApisService } from '../services/apis.service';

@Component({
  selector: 'app-create-survey',
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.scss'],
})
export class CreateSurveyComponent implements OnInit {

  questionsTemplateList;
  errorMessage;
  users;
  constructor( public alertController: AlertController,
               public router: Router,
               public popup: AlertView,
               public api: ApisService) { }

  ngOnInit() {
    this.getAllQuestionsTemplate();
  }

  getAllQuestionsTemplate() {
    this.popup.showLoader();
    this.users = JSON.parse(localStorage.getItem('user'));
    this.api.getQuestionTemplate(this.users.link).subscribe(res => {
      this.questionsTemplateList = res.questions;
      this.questionsTemplateList.map(i => i.disabled = true);
      console.log(this.questionsTemplateList);
      this.popup.hideLoader();
    }, err => {
      console.log(err);
      this.popup.hideLoader();
      this.errorMessage = err.error;
      this.errorMessage = this.errorMessage.message;
      this.popup.showToast(this.errorMessage, 1700, 'bottom');
    });
  }

  editQuestion(id, slidingItem) {
    this.questionsTemplateList[id].disabled = false;
    slidingItem.close();
  }

  doneEdit(id, slidingItem) {
    this.questionsTemplateList[id].disabled = true;
    slidingItem.close();
  }

  deleteQuestion(id) {
    this.questionsTemplateList.splice(id, 1);
  }

  addQuestion() {
    this.questionsTemplateList.push({
      disabled: false,
      id: this.questionsTemplateList.length + 1,
      link: '0',
      question: ''
    });
  }

  submitQuestion() {
    console.log(this.questionsTemplateList);
    this.popup.showLoader();
    const payload = {
      link: this.users.link,
      questions : this.questionsTemplateList
    };
    console.log(payload);
    this.api.createQuestionTemplate(payload).subscribe(res => {
      console.log(res);
      this.popup.hideLoader();
      this.router.navigate(['/sharing']);
    }, err => {
      console.log(err);
      this.popup.hideLoader();
      this.errorMessage = err.error.message;
      this.popup.showToast(this.errorMessage, 1700, 'bottom');
    });


  }
}
