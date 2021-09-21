import React, { useContext } from 'react';
import styled from 'styled-components'

import { UserContext } from '../context/UserContext';
import {FirebaseContext} from '../context/FirebaseContext'

import Text from '../components/Text'

export default ProfileScreen = () => {
  const [user, setUser] = useContext(UserContext)
  const firebase = useContext(FirebaseContext)

  const logOut = async () => {
    const loggedOut = await firebase.logOut()
    
    if(loggedOut) {
      setUser((state) => ({...state, isLoggedIn: false}))
    }
  }  

  return (
    <Container>
      <Logout onPress={logOut}>
        <Text large bold color="#23a8d9">
          Log Out
        </Text>
      </Logout>
    </Container>
  )
}

const Container = styled.View`
  align-items: center;
  margin-top: 64px;
  flex: 1;
`

const Logout = styled.TouchableOpacity`
  margin-top: 250px;
`



