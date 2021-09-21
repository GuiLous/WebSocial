import React, {createContext} from 'react'

import firebase from 'firebase'
import "firebase/auth"
import "firebase/firestore"
import {collection, query} from "firebase/firestore"
import config from '../config/firebase'

const FirebaseContext = createContext();

if(!firebase.apps.length) {
  firebase.initializeApp(config)
}

const db = firebase.firestore()

const Firebase = {
  getCurrentUser: () => {
    return firebase.auth().currentUser
  },

  getPostDatas: async () => {
    const posts = await db.collection("posts").doc("rBuuCAc8ckUclBBAI5w8").get() 
    // console.log(posts.data())
    return posts.data()
  },

  createUser: async (user) => {
    console.log("create ")
    try {
      await firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      const uid = Firebase.getCurrentUser().uid
      
      let profilePhotoUrl = 'default'

      await db.collection("users").doc(uid).set({
        username: user.username,
        email: user.email,
        profilePhotoUrl
      })

      if(user.profilePhoto){
        profilePhotoUrl = await Firebase.uploadProfilePhoto(user.profilePhoto)
      }

      delete user.password

      return {...user, profilePhotoUrl, uid}
    } catch (error) {
      console.log("Error createUser", error)
    }
  },

  uploadProfilePhoto: async (uri) => {
    const uid = Firebase.getCurrentUser().uid

    try {
      const photo = await Firebase.getBlob(uri)
      
      const imageRef = await firebase.storage().ref("profilePhotos").child(uid)
      imageRef.put(photo)

      const url = await imageRef.getDownloadURL()
      console.log(url)

      await db.collection("users").doc(uid).update({
        profilePhotoUrl: url,
      })
      
      return url
    } catch (error) {
      console.log(error)
    }
  },

  getBlob: async (uri) => {
    return await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.onload = () => {
        resolve(xhr.response)
      }

      xhr.onerror = () => {
        reject(new TypeError("Network request failed."))
      }

      xhr.responseType = "blob"
      xhr.open("GET", uri, true)
      xhr.send(null)
    })
  },

  getUserInfo: async (uid) => {
    try {
      const user = await db.collection("users").doc(uid).get()

      if (user.exists){
        return user.data()
      }
    } catch (error) {
      console.log(error)
    }
  },

  logOut: async () => {
    try {
      await firebase.auth().signOut();

      return true
    } catch (error) {
      console.log(error)
    }

    return false
  },

  signIn: async (email, password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password)
  }
}

const FirebaseProvider = (props) => {
  return <FirebaseContext.Provider value={Firebase}>{props.children}</FirebaseContext.Provider>
}

export {FirebaseContext, FirebaseProvider}