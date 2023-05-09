
import tr from './lang/tr.json';
import en from './lang/en.json';

let lang=localStorage.getItem('lang') || 'tr-TR';

const a=function(x,y,z) {
    if(lang=='tr-TR'){
        if(x=='toplam-veri') return 'Toplam '+y+' adet veri bulundu';
        else if(x=='arasında-veri') return y+'-'+z+' arasındaki kayıtlar gösteriliyor';
        else{
            return tr[x] || x;
        }
        
    }else if(lang=='en-US'){
        if(x=='toplam-veri') return 'Total '+y+' records found';
        else if(x=='arasında-veri') return 'Showing data from '+y+' to '+z;
        else{
            return en[x] || x;
        }
    }
}
export default a;