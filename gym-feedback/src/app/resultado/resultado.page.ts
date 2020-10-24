import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FeedbackModel } from '../models/feedback.model';
import { FeedbackService } from '../service/feedback.service';
import { Chart } from "chart.js";

@Component({
  selector: 'app-resultado',
  templateUrl: './resultado.page.html',
  styleUrls: ['./resultado.page.scss'],
})
export class ResultadoPage implements OnInit {

  slideOpts = { initialSlide: 0, speed: 400 };
  private barChartAvaliacao: Chart;
  private barChartMelhorias: Chart;

  feedback: Array<FeedbackModel> = [];
  notas: Array<number> = [];
  melhorias: Array<number> = [];
  comentarios: Array<FeedbackModel> = [];

  constructor(private service: FeedbackService) { }

  ngOnInit() {
    this.carregarFeedback();
  }

  carregarChartAvaliacao() {
    var barCanvasAvaliacao = document.getElementById('barCanvasAvaliacao');
    this.barChartAvaliacao = new Chart(barCanvasAvaliacao, {
      type: "bar",
      data: {
        labels: ["Nota 1","Nota 2","Nota 3","Nota 4","Nota 5"],
        datasets: [
          {
            label: "Avaliações",
            data: this.notas,
            backgroundColor: [
              "rgba(255,99,132,1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)"
            ],
            borderColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)"
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });
  }

  carregarChartMelhorias() {
    var barCanvasMelhorias = document.getElementById('barCanvasMelhorias');
    this.barChartMelhorias = new Chart(barCanvasMelhorias, {
      type: "bar",
      data: {
        labels: ["Organização","Atendimento","Preço","Limpeza","Variedade", "Segurança", "Ambiente", "Lotação"],
        datasets: [
          {
            label: "Melhorias",
            data: this.melhorias,
            backgroundColor: [
              "rgba(255,255,0,1)",
              "rgba(250,165,0,1)",
              "rgba(255,0,0,1)",
              "rgba(128,0,128,1)",
              "rgba(0,0,255,1)",
              "rgba(252,15,192,1)",
              "rgba(0,128,0,1)",
              "rgba(255,255,255,1)"
            ],
            borderColor: [
              "rgba(255,255,0,0.2)",
              "rgba(250,165,0,0.2)",
              "rgba(255,0,0,0.2)",
              "rgba(128,0,128,0.2)",
              "rgba(0,0,255,0.2)",
              "rgba(252,15,192,0.2)",
              "rgba(0,128,0,0.2)",
              "rgba(255,255,255,0.2)"
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });
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
            feedback: e.payload.doc.data()['Nota'] == 1? "★": 
              (e.payload.doc.data()['Nota'] == 2 ? "★★": 
              (e.payload.doc.data()['Nota'] == 3 ? "★★★" : 
              (e.payload.doc.data()['Nota'] == 4 ? "★★★★" : "★★★★★"))),
            data: e.payload.doc.data()['Data']
          };
        });
        var nota1 = 0, nota2 = 0, nota3 = 0, nota4 = 0, nota5 = 0;
        var organizacao = 0, atendimento = 0, preco = 0, limpeza = 0, variedade = 0, seguranca = 0, ambiente = 0, lotacao = 0;
        
        this.feedback.forEach(element => {

          switch (element.nota) {
            case 1:
              nota1++;
              break;
            case 2:
              nota2++;
              break;
            case 3:
              nota3++;
              break;
            case 4:
              nota4++;
              break;
            case 5:
              nota5++;
              break;
          }

          organizacao = element.melhorias.includes("Organização") ? organizacao+1 : organizacao; 
          atendimento = element.melhorias.includes("Atendimento") ? atendimento+1 : atendimento; 
          preco = element.melhorias.includes("Preço") ? preco+1 : preco; 
          limpeza = element.melhorias.includes("Limpeza") ? limpeza+1 : limpeza; 
          variedade = element.melhorias.includes("Variedade") ? variedade+1 : variedade; 
          seguranca = element.melhorias.includes("Segurança") ? seguranca+1 : seguranca; 
          ambiente = element.melhorias.includes("Ambiente") ? ambiente+1 : ambiente; 
          lotacao = element.melhorias.includes("Lotação") ? lotacao+1 : lotacao; 

          if (element.comentario != "") {
            this.comentarios.push(element);
          }
          
        });

      this.notas.push(nota1,nota2,nota3,nota4,nota5);
      this.melhorias.push(organizacao,atendimento,preco,limpeza,variedade,seguranca,ambiente,lotacao);

      this.comentarios.sort(function(a,b) {
        return a.data.localeCompare(b.data);        
      });

      this.carregarChartAvaliacao();
      this.carregarChartMelhorias();
    });
  }

}
