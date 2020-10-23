import { Component, OnInit } from '@angular/core';
import { BlockUi, DataGridColumnModel, EnumAlignment } from 'ngx-ui-hero';
import { FeedbackModel } from '../models/feedback.model';
import { FeedbackService } from '../service/feedback.service';

@Component({
  selector: 'app-resultado',
  templateUrl: './resultado.page.html',
  styleUrls: ['./resultado.page.scss'],
})
export class ResultadoPage implements OnInit {

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  styleClass = "material";

  feedback: Array<FeedbackModel>;

  constructor(private service: FeedbackService) { }

  ngOnInit() {
    this.carregarFeedback();
  }

  carregarFeedback() {
    this.service.get()
      .subscribe(result => {
        
        this.feedback = result.map(e => {
          return{
            id: e.payload.doc.id,
            nota: e.payload.doc.data()['Nota'],
            melhorias: e.payload.doc.data()['Melhorias'],
            comentario: e.payload.doc.data()['Comentario'],
          };
        });
        console.log(this.feedback);
    });
    
  }

  pegarClasseLinha(linha) {

  }

  async abrir(linha) {

  }

}
