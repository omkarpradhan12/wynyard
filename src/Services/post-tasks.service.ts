import { Injectable } from '@angular/core';
import { Post_Metadata } from 'src/Classes/post-metadata';
import { UserDataService } from './user-data.service';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, listAll, StorageReference } from "firebase/storage";
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { getFirestore } from 'firebase/firestore';
import {doc, getDoc, query, where,  getDocs, collection, addDoc} from 'firebase/firestore';

import { FetchedPostData } from 'src/Classes/FetchedPostData';


@Injectable({
  providedIn: 'root'
})
export class PostTasksService {

  constructor(private userdata:UserDataService,
    
    ) { }

  app = initializeApp(environment.firebase)  

  firebase_storage = getStorage(this.app)

  firebase_firestore_db = getFirestore(this.app)

  
  post_url_list:any = []

  fetched_post_data : FetchedPostData = new FetchedPostData()
    fetched_posts_list:any  = []
  

  async save_metadata_of_post(current_post_data:Post_Metadata) {
    const keymail = this.userdata.email.replace(".", "")
        
    try {
      const docRef = await addDoc(collection(this.firebase_firestore_db, "posts_metadata"), {
          caption: current_post_data.caption,
          name: current_post_data.name,
          keymail: keymail,          
          fileType:current_post_data.fileType,
          
      });
      
      alert("Data uploaded in firestore successfully")
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    
  }

  

  Upload_post(current_post_data:Post_Metadata) {
    
    const keymail = this.userdata.email.replace(".", "")
    console.log(keymail)
    const path = 'posts/' + keymail + "/" + current_post_data.name 
    console.log(path)
    const firebase_storageRef = ref(this.firebase_storage, path)
    
    const uploadTask = uploadBytesResumable(firebase_storageRef, current_post_data.post);

  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on('state_changed',
    (snapshot) => {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case 'storage/unauthorized':
        alert("You are not an authorized user")
        // User doesn't have permission to access the object
        break;
      case 'storage/canceled':
        // User canceled the upload
        alert("The upload was cancled")
        break;

      // ...

      case 'storage/unknown':
        // Unknown error occurred, inspect error.serverResponse
        alert("Storage Unknown")
        break;
    }
  }, 
  () => {
    // Upload completed successfully, now we can get the download URL
    alert("Post Uploaded successfully")
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      current_post_data.post_url = downloadURL
      console.log('File available at', downloadURL);
    });
  }
);
  return current_post_data;
  }

  delete_post() {}

  get_user_post() {}

  async get_all_posts() {
    // Create a reference under which you want to list
    const post_listRef = ref(this.firebase_storage, 'posts/')
    console.log("post_listRef:" + post_listRef)

    let post_ref:StorageReference
// Find all the prefixes and items.
    this.fetched_posts_list = []
    this.post_url_list = []
  listAll(post_listRef)
  .then((res) => {
    res.prefixes.forEach((folderRef) => {
      // All the prefixes under listRef.
      // You may call listAll() recursively on them.
      post_ref = ref(post_listRef, folderRef.name)  
      this.fetched_post_data.keymail = folderRef.name       
     
      listAll(post_ref).then((res)=> {
          res.items.forEach((post) =>{          
          //console.log("post:", post.fullPath)
          this.fetched_post_data.post_name = post.name
          // console.log("Post_name:", post.name)
          getDownloadURL(post).then((url)=>{
            this.fetched_post_data.post_url = url
            this.post_url_list.push(url)
            //console.log("url: ", url)
          })
          this.fetched_posts_list.push(this.fetched_post_data)
          })
      }).catch((error)=>{
        console.log("error in post_ref: ", error)
      });
      
           
      
    });
    

    
  }).catch((error) => {
    // Uh-oh, an error occurred!
    console.log("error occured in service while loading posts")
  });

  const docRef = doc(this.firebase_firestore_db, "posts_metadata");
    // const docSnap = await getDoc(docRef);
    // if (docSnap.exists()) {
    //   console.log("Document data:", docSnap.data());
    // } else {
    //   // doc.data() will be undefined in this case
    //   console.log("No such document!");
    // }

    const q = query(collection(this.firebase_firestore_db, "posts_metadata"), where("name", "==", true));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });

  }

  

}
