import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FeedbackService } from '../service/feedback.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  //variaveis
  titulo: string = "Péssima";
  @Input() classificacao: number = 1;
  @Output() ClassificacaoMuda: EventEmitter<number> = new EventEmitter();
  comentario = '';

  melhorias = [
    {nome: 'organizacao;', ativo: false},
    {nome: 'atendimento;', ativo: false},
    {nome: 'preco;', ativo: false},
    {nome: 'limpeza;', ativo: false},
    {nome: 'variedade;', ativo: false},
    {nome: 'seguranca;', ativo: false},
    {nome: 'ambiente;', ativo: false},
    {nome: 'lotacao;', ativo: false}
  ]


  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  constructor(private service: FeedbackService, public alertController: AlertController) {}

  //metodos

  classificar(index: number) {
    this.classificacao = index;
    this.ClassificacaoMuda.emit(this.classificacao);
    this.definirTitulo();
  }

  colorir(index: number) {
    if (this.acimaClassificacao(index)) {
      return CORES.CINZA;
    }
    switch(this.classificacao) {
      case 1:
      case 2: 
      case 3:
      case 4:
      case 5:
        return CORES.AMARELO;
      default:
        return CORES.CINZA;
    }
  }

  acimaClassificacao(index: number): boolean {
    return index > this.classificacao; 
  }

  definirTitulo() {
    switch (this.classificacao) {
      case 1:
        this.titulo = "Péssima";
        break;
      case 2:
        this.titulo = "Ruim";
        break;
      case 3:
        this.titulo = "Razoável";
        break;
      case 4:
        this.titulo = "Boa";
        break;
      case 5:
        this.titulo = "Muito Boa";
        break;
    }
  }

  check(verificador: number) {
    if (this.melhorias[verificador].ativo) {
      this.melhorias[verificador].ativo = false;
    } else {
      this.melhorias[verificador].ativo = true;
    }
  }

  definirCorMelhorias(verificador: boolean) {
    if (verificador) {
      return CORES.AMARELO;
    } else {
      return CORES.CINZA;
    }
  }

  enviar() {
    var melhorias = '';
    this.melhorias.forEach(element => {
      if (element.ativo) {
        melhorias += element.nome;
      }
    });        

    let model = {};
    model['Nota'] = this.classificacao;
    model['Melhorias'] = melhorias;
    model['Comentario'] = this.comentario;

    if (this.classificacao != 0) {
      this.service.create(model)
        .then( result => {
          this.presentAlert("Enviado com sucesso!","Obrigado por deixar seu feedback");
          this.classificacao = 0;
          window.location.reload();
        }).catch(error => {
          this.presentAlert("Erro ao enviar","Espere alguns segundos e tente novamente mais tarde");
        });
    } else {
      this.presentAlert("Avaliação incompleta!","Por favor, nos deixe uma avaliação");
    }
    
  }

  async presentAlert(header, message) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

}

enum CORES {
  CINZA = "#E0E0E0",
  AMARELO = "#FFCA28"
}