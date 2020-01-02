[ React Native x MobX ]

상태(State) 관리가 정말 쉬워 졌다. ^^
참조 사이트 : https://alligator.io/react/mobx-react-native-simpleified

주의사항 1: 적용이 완료 되었어도, StyleSheet에 따라서 출력이 안될 수 도 있다. (이점을 명시하자)
주의사항 2: action / computed 가 => arrow 함수, bind, 호출할 때 arrow/call 에 따라서 출력되지 않는 경우가 발생하므로 유의하도록 한다. 
주의사항 3: props를 전달해 줄 때, 미리 개체를 빼두는 것을 잊지 않도록 하자.
주의사항 4: App.js에서 <Provider store={store}> <SomeComponent /> </Provider>로 감싸주어야 한다. 
주의사항 5: @observable 등의 데코레이션을 개별로 사용하거나, decorate 함수를 통하여 일괄 적용할 수 있다.

전반적인 흐름

Provider를 최상위 개체로 하고, Provider에서 child component에 store를 Props로 자동 전달해 주는 구조이다. 
즉, Provider 의 Child에서는 암시적으로 store라는 props가 이미 전달되어 있다. 
@observable로 등록되어 있는 store 내부의 변수는 global state가 된다. 
모든 action은 store에서 action으로 등록하며, action을 통해서 state를 변경한다.
흥미로운 점은 Store 내부에서 볼 때, @observable 변수는 일반변수와 동일하기 때문에, setState로 변경하지 않고, 멤버변수로 직접 변경 처리 한다는 것이다. 
ex) 
@observable 
text = ‘’;
@action
updateText = (text) => { 
	this.text = text;}
MobX를 사용하는 Component에서는, inject, observer 를 사용하여 연결하여 준다. 

import {inject, observer } from ‘mobx-react’;
…
function ImageList(props){
codes….
…}

export default inject(“store”)(observer(ImageList));

	이러한 부분은 props Mapping, dispatch Mapping을 매번 해야하는 Redux와 비교하여 
   	매우 단순해진 부분이다. 




yarn add mobx mobx-react



https://image.freepik.com/free-vector/galaxy-mobile-phone-background-blue-purple-tones_79603-549.jpg


좀 더 현실을 반영한 테스트를 위해서 Network로 이미지 리스트를 받아오는데, JSON 파일 샘플
이미지 리스트 (JSON) : https://raw.githubusercontent.com/paypal/react-engine/master/examples/movie%20catalog/movies.json




App.js
import React from 'react';
import ImageList from './src/components/ImageList';
import {Provider} from 'mobx-react';
import store from './src/store';

const App = () => {
 return(
   <Provider store={store}>
     <ImageList />
   </Provider>
 );
};
export default App;



./src/store/index.js 
   ⇒  import store from ‘./src/store’ 로 참조
import {decorate, observable, computed, action} from 'mobx';

class Store {
   // observalbe -> decorate 사용
   text = 'init';
   data = null; // to save image response
   favorites =[];

   uri = 'https://raw.githubusercontent.com/paypal/react-engine/master/examples/movie%20catalog/movies.json';


   // actions
   updateText = (text) => {
       this.text = text;
       console.log(text);
   };

   searchImages = () => {
       console.log('[START] searchImages');
       fetch(this.uri)
       .then(response =>response.json())
       .then(data=>this.setData(data))
       .catch(error => console.error(error));
       console.log('[END] searchImages');
//       console.log(' [Data]:' + this.data);

   };
  
   setData = (data) => {
       this.data = data;
       console.log(data);
   };


   addToFavorite = (image) => {
       this.favorites.push(image);
       this.data = null;
       this.text = '';
       console.log('[favor #]:'+ this.favorites.length);
   };

   get getFavoriteCount() {
       console.log('[Favor]: '+ this.favorites);
       return this.favorites.length;
   };

}

decorate(Store, {
   text: observable,
   data: observable,
   favorites: observable,
   updateText: action,
   searchImages: action,
   setData: action,
   addToFavorite: action,
   getFavoriteCount: computed,
});

export default new Store();






./src/components/ImageList.js
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























