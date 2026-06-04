import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  api = 'http://localhost:3000';

  mensagem = '';
  erro = '';
  guiche = 1;
  ignorarExpediente = true;
  tipoRelatorio = 'geral';

  status: any = null;
  painel: any[] = [];
  fila: any = { SP: 0, SE: 0, SG: 0 };
  relatorio: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.carregarDados();
    setInterval(() => this.carregarDados(), 3000);
  }

  carregarDados() {
    this.http.get<any>(`${this.api}/status`).subscribe({
      next: d => this.status = d,
      error: () => this.erro = 'Backend desligado ou com erro.'
    });

    this.http.get<any[]>(`${this.api}/painel`).subscribe({
      next: d => this.painel = Array.isArray(d) ? d : [],
      error: () => this.painel = []
    });

    this.http.get<any>(`${this.api}/senhas/aguardando`).subscribe({
      next: d => this.fila = d,
      error: () => this.fila = { SP: 0, SE: 0, SG: 0 }
    });

    this.carregarRelatorio();
  }

  carregarRelatorio() {
    this.http.get<any>(`${this.api}/relatorios/${this.tipoRelatorio}`).subscribe({
      next: d => this.relatorio = d,
      error: () => this.relatorio = null
    });
  }

  emitirSenha(tipo: string) {
    this.erro = '';

    this.http.post<any>(`${this.api}/senhas`, {
      tipo,
      ignorarExpediente: this.ignorarExpediente
    }).subscribe({
      next: d => {
        this.mensagem = `${d.mensagem}: ${d.codigo}`;
        this.carregarDados();
      },
      error: e => this.erro = e.error?.erro || 'Erro ao emitir senha.'
    });
  }

  chamarProxima() {
    this.erro = '';

    this.http.post<any>(`${this.api}/chamar-proxima`, {
      guiche: this.guiche,
      ignorarExpediente: this.ignorarExpediente
    }).subscribe({
      next: d => {
        this.mensagem = d.senha ? `${d.mensagem}: ${d.senha}` : d.mensagem;
        this.carregarDados();
      },
      error: e => this.erro = e.error?.erro || e.error?.mensagem || 'Erro ao chamar senha.'
    });
  }

  encerrarExpediente() {
    this.http.post<any>(`${this.api}/expediente/encerrar`, {}).subscribe({
      next: d => {
        this.mensagem = `${d.mensagem} Total descartadas: ${d.descartadas}`;
        this.carregarDados();
      },
      error: e => this.erro = e.error?.erro || 'Erro ao encerrar expediente.'
    });
  }

  limparDados() {
    this.http.delete<any>(`${this.api}/dev/limpar`).subscribe({
      next: d => {
        this.mensagem = d.mensagem;
        this.carregarDados();
      },
      error: e => this.erro = e.error?.erro || 'Erro ao limpar dados.'
    });
  }
}
