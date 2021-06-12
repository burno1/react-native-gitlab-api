import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {useEffect,useState}  from "react";
import { Text, Input, Button,Image } from "react-native-elements";
import * as RootNavigation from './../../RootNavigation';
import { FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import axios from 'axios';
import gitlab from '../api/gitlab'
import { View } from "react-native";
import { Audio } from 'expo-av';


  const HomeScreen = ({ navigation }) => {
      
    const [ user, setUser] = useState({});
    const [ repos, setRepos] = useState([]);
    const [ sound, setSound] = useState();
    const [ shouldSing, setShouldSing ] = useState(false);
    
    const playSong = async () => {
        setShouldSing(true);
        
        const { sound } = await Audio.Sound.createAsync(
            require('./../../assets/nevergonna.mp3')
        );

        setSound(sound);
        await sound.playAsync();
    }

    const stopSong = async () =>{
        await sound.stopAsync();
        await sound.unLoadAsync();
        setSound(null);
    }    
  
    useEffect (() => {
        if(!shouldSing) stopSong()
    },[shouldSing])

    useEffect (() => {
        async function projects(){
            
            const access_token = await AsyncStorage.getItem('access_token');
            console.log(access_token);

            const userId = await axios({
                method: "get",
                url: "https://gitlab.tadsufpr.net.br/oauth/token/info",
                headers: {'Authorization': `Bearer ${access_token}`}
            });

            const userInfo = await gitlab.get(`users/${userId.data.resource_owner_id}`);
            setUser(userInfo.data);

            const userRepos = await gitlab.get(`users/${userId.data.resource_owner_id}/projects`);
            setRepos(userRepos.data);
        }

        projects();
    },[])

    return ( 
       <View>
            <Text style={{fontSize:20, fontWeight: "bold", margin: 10, alignContent:"center"}}>
                Welcome {user.name}!
            </Text>

        <FlatList
            data={repos}
            renderItem={({item}) => (
                <TouchableOpacity 
                    onPress={() =>{
                        RootNavigation.navigate("Repo", {playSong, stopSong, setShouldSing})
                    }}
                >                    
                <View style={{margin:5, backgroundColor: 'lightgrey'}}>
                    <Text>{item.name}</Text>
                </View>
            </TouchableOpacity>
            )}
            keyExtractor={item => item.id.toString()}
         />
       </View>        
    )
}

const styles = StyleSheet.create({
});


export default HomeScreen;