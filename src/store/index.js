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



