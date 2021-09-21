import React, { useContext, useEffect } from "react"
import styled from "styled-components"

import { UserContext } from "../context/UserContext"
import { FirebaseContext } from "../context/FirebaseContext"

import Text from "../components/Text"

export default LoadingScreen = () => {
  const [_, setUser] =  useContext(UserContext);
  const firebase = useContext(FirebaseContext)


  useEffect(() => {
    setTimeout(async () => {
      const user = firebase.getCurrentUser()

      if(user) {
        const userInfo = await firebase.getUserInfo(user.uid)

        setUser({
          isLoggedIn: true,
          email: userInfo.email,
          uid: user.uid,
          username: userInfo.username,
          profilePhotoUrl: userInfo.profilePhoto
        })
      }else{
        setUser((state) => ({...state, isLoggedIn: false}))
      }
    }, 500)
  }, [])

  return (
    <Container>
      <Text title color="#FFFFFF">
        SocialApp
      </Text>
    </Container>
  )
}

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: #222222;
`