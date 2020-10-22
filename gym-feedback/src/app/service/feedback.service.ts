import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private firestore: AngularFirestore) { }

  create(model) {
    return this.firestore.collection('feedback').add(model);
  }

  get() {
    return this.firestore.collection('feedback').get();
  }

  
}
