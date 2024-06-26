import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';

@Injectable({
  providedIn: 'root'
})
export class SujetService {
  private pocketBase : PocketBase;
  private apiUrl = 'http://localhost:8090';

  constructor() {
    this.pocketBase = new PocketBase(this.apiUrl);
   }


  async getTopics() {
    const transactionsRecords = await this.pocketBase.collection('sujets').getFullList();
    console.log(transactionsRecords);

    return transactionsRecords.map((transaction: any) => {
      return {
        id: transaction.id,
        title: transaction.title,
        description: transaction.description,
        date: transaction.date,
        author: transaction.author,
        created: transaction.created,
        updated: transaction.updated
      }
    });
  }

  async createSujet(request: any) {
    const transaction = {
      title: request.title,
      author: request.author,
      created: request.created,
      updated: request.updated
    };
    const newSujet = await this.pocketBase.collection('sujets').create(transaction);
  }
}
