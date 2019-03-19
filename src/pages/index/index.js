// 在开发版热更新当前html
if(process.env.NODE_ENV === 'development'){
    require('./index.html');
    console.log('env:', process.env.NODE_ENV);
}
// import './index.html';

import './index.scss';
// import './s.css';


// if (module.hot) {
//     console.log(module.hot);
//     module.hot.accept('./index.html', ()=> location.reload());
// }