import React from 'react';
import {View, Text, TextInput, Button, FlatList, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

import {inject, observer} from 'mobx-react';

function ImageList(props) {
        // destructure vars from store to use
        const { text, updateText, data, searchImages, favorites, addToFavorite, getFavoriteCount } = props.store;
        const comp_favor = (
            <ScrollView style={{ width:'100%'}}>
            <FlatList 
                data={data}
                keyExtractor={(item) => item.id }
                renderItem={ ({item})=>(
                    <TouchableOpacity style={{ alignItems:'center'}} onPress={()=>addToFavorite(item.image)}>
                    <Text>{item.image}</Text>
                    <Image source={{uri: item.image}} style={{justifyContent:'center', width:'80%', height:200, borderRadius:30}} />
                    </TouchableOpacity>
                    )}
            /> 
            </ScrollView>
        );
        const comp_usual= (
            <View style={{widht:'100%', opacity:0.7, backgroundColor:'white'}}>
                        <FlatList 
                                style={styles.favorites}
                                data={favorites}
                                keyExtractor={(item,index) => index.toString() }
        renderItem={ ({item})=> (
                            <View style={{flexDirection:'row', borderBottomColor:'silver', borderBottomWidth:1}}>
                                <Image source={{uri:item}} style={{width:100,height:100}} />
                                <Text>{item}</Text>
                            </View>
                            )} 
                        /> 
            </View>
        );
            return(
                <>
                <View style={styles.container}>
            <Text style={{fontSize:40}}>{this.text}</Text>
                    <View style={{width:50,height:50, backgroundColor:'red'}} />
                    <TextInput 
                        style={styles.input}
                        value={text}
                        onChangeText={updateText}
                    />

                    <TouchableOpacity
                        style={styles.button}
                        onPress={searchImages}  >
                            <Text style={styles.buttonText}>Search</Text>
                    </TouchableOpacity>
                    <Text>#{data?'true':'null'}#</Text>
                    { data ? comp_favor : comp_usual}
            <Text style={styles.count} >Images added: {getFavoriteCount} </Text>
                </View>
                </>
            );
}

export default inject("store")(observer(ImageList));

const styles=StyleSheet.create({
    container:{ flex:1, paddingTop:50, flexDirection:'column', backgroundColor:'gray', justifyContent:'center', alignItems:'center'},
    favorites:{color:'red'},
    input:{  width: 200, height:30, justifyContent:'center', backgroundColor:'white'},
    button:{ paddingTop: 20, width:200, justifyContent:'center', alignItems:'center', backgroundColor:'blue', borderRadius:30 },
    buttonText: {fontSize:30, justifyContent:'center', alignItems:'center'},
    count:{flex:1, color:'red', fontSize: 30},

});





