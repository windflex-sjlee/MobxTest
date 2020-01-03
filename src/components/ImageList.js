import React from 'react';
import {
    View, Text, Button,
    Container, Header, Content, Input, Item, Form, Label,
} from 'native-base';

import {TextInput, TouchableOpacity, FlatList, Image, StyleSheet, ScrollView } from 'react-native';

import {inject, observer} from 'mobx-react';


function MyForm(props) {
    return(
      
          <Form>
            <Item floatingLabel>
              <Label>Username</Label>
              <Input />
            </Item>
            <Item floatingLabel last>
              <Label>Password</Label>
              <Input />
            </Item>
          </Form>
       
    );
};

function ImageList(props) {
        // destructure vars from store to use
        const { text, updateText, data, searchImages, favorites, addToFavorite, getFavoriteCount } = props.store;
        const comp_favor = (
            <ScrollView style={{ width:'100%'}}>
            <FlatList 
                data={data}
                keyExtractor={(item) => item.id }
                renderItem={ ({item})=>(
                    //<TouchableOpacity style={{ alignItems:'center'}} onPress={()=>addToFavorite(item.image)}>
                    <Button onPress={()=>addToFavorite(item.image) } >
                    <Text>{item.image}</Text>
                    <Image source={{uri: item.image}} style={{justifyContent:'center', width:'80%', height:200, borderRadius:30}} />
                    </Button>//</TouchableOpacity>
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
                <Container>
                    <Header ><Text>MobX TEST</Text></Header>
                <Content>
                <Item regular>
            <Input placeholder='Regular Textbox' />
          </Item>
                <View style={styles.container, {borderWidth:2}}>
                    <Input 
                        style={styles.input}
                        value={text}
                        onChangeText={updateText}
                    />
                    <View>
                        <MyForm />
                    </View>
                    <Button
                        style={styles.button}
                        onPress={searchImages}  >
                            <Text style={styles.buttonText}>Search</Text>
                    </Button>
                    <Text>#{data?'true':'null'}#</Text>
                    { data ? comp_favor : comp_usual}
            <Text style={styles.count} >Images added: {getFavoriteCount} </Text>
                </View>
                </Content>
                </Container>
            );
}


export default inject("store")(observer(ImageList));

const styles = StyleSheet.create({
    container:{ flex:1, flexDirection:'column', justifyContent:'flex-start'},
    favorites:{},
    input:{  },
    button:{ },
    buttonText: {},
    count:{},

});





