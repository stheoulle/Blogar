import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';
import { Post } from '../../../interfaces/post';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private pocketBase: PocketBase;
  private apiUrl = 'http://localhost:8090';
  authService: AuthService;

  constructor() {
    this.pocketBase = new PocketBase(this.apiUrl);
    this.authService = new AuthService();
  }

  async getPostsBySujetId(sujetId: string): Promise<Post[]> {
    let author = '';
    
    try {
      // Utilisation de la méthode getList avec un filtre
      let records = await this.pocketBase.collection('posts').getFullList();
      
      // Filtrer les enregistrements pour obtenir uniquement ceux qui correspondent à l'ID du sujet
      records = records.filter((post: any) => post.id_sujet === sujetId);

      const posts: Post[] = [];
      for (const record of records) {
        const authorUsername = await this.authService.getUsernameById(record['author']) // Récupérer l'username de l'auteur
        posts.push({
          id: record.id,
          title: record['title'],
          id_sujet: record['id_sujet'],
          author: authorUsername,
          content: record['content'],
          created: new Date(record.created),
          updated: new Date(record.updated)
        });
      }

      return posts;
    } catch (error) {
      console.error('Erreur lors de la récupération des enregistrements:', error);
      return [];
    }
  }

  async createPost(request: any) {
    let author = '';
    if (this.pocketBase.authStore.model) {
      author = this.pocketBase.authStore.model['id'];
    }
    const post = {
      title: request.title,
      id_sujet: request.id_sujet,
      content: request.content,
      author: author,
    };
    console.log(post);
    const newSujet = await this.pocketBase.collection('posts').create(post);

  }
}
