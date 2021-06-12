import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {useEffect}  from "react";
import { Image } from "react-native-elements";
import { useFocusEffect } from '@react-navigation/native';

const RepoScreen= ({ navigation, route}) =>{
    useFocusEffect(
        React.useCallback(() => {
            route.params.playSong();    
          return () => {
            route.params.setShouldSing(false);
          };
        }, [])
      );

    return (
        <Image 
            source={{uri:'https://i.pinimg.com/originals/88/82/bc/8882bcf327896ab79fb97e85ae63a002.gif'}}  
                style={{ 
                    width:"100%",
                    height:"100%",
                    justifyContent:"center",
                    alignItems:"center"
                }}
        />
    )
}

export default RepoScreen;