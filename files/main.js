// Форма поиска ( Сразу же помечаем объект поиска, как инициализированный, чтобы случайно не инициализировать его дважды.)
function SearchFieldInit(obj) {
  // Блок в котором лежит поле поиска
  obj.f_search = obj.find('.search__form');
  // Если поля поиска не нашлось, завершаем работу, ничего страшного.
  if(0 == obj.f_search.length) {
    return false;
  }
  // Поле поиска товара
  obj.s_search = obj.f_search.find('.search__input');
  // Обнуление данных в форме поиска
  obj.s_reset  = obj.f_search.find('.search__reset');
  // Проверка на существование функции проверки поля и действий с ним
  if(typeof(obj.SearchFieldCheck) != 'function') {
    console.log('function SearchFieldCheck is not found in object for SearchFieldInit', {status: 'error'});
    return false;
  // Проверка, сколько полей поиска нам подсунули за раз на инициализацию
  } else if(1 < obj.f_search.length) {
    console.log('function SearchFieldInit must have only one search object', {status: 'error'});
    return false;
  }
  // Создаём функцию которая будет отвечать за основные действия с полем поиска
  obj.__SearchFieldCheck = function (isAfter) {
    // Если в поле текста есть вбитые данные
    if(obj.s_search.val().length) {
      obj.f_search.addClass('search__filled');
      obj.f_search.parent().addClass('search__filled');
    } else {
      obj.f_search.removeClass('search__filled');
      obj.f_search.parent().removeClass('search__filled');
    }
    // При нажатии клавиши данных внутри поля ещё нет, так что проверки вернут информацию что менять поле не нужно, хотя как только операция будет завершена данные в поле появятся. Поэтому произведём вторую проверку спустя 2 сотых секунды.
    if(typeof( isAfter ) == "undefined" || !isAfter) {
      setTimeout(function() { obj.__SearchFieldCheck(1); },20);
    }else{
      return obj.SearchFieldCheck();
    }
  }
  // Действия с инпут полем поиска
  obj.s_search.click(function(){
    obj.__SearchFieldCheck();
  }).focus(function(){
    obj.f_search.addClass('search__focused');
    obj.f_search.parent().addClass('search__focused');
    obj.__SearchFieldCheck();
  }).blur(function(){
    obj.f_search.removeClass('search__focused');
    obj.f_search.parent().removeClass('search__focused');
    obj.__SearchFieldCheck();
  }).keyup(function(I){
    switch(I.keyCode) {
      // игнорируем нажатия на эти клавишы
      case 13:  // enter
      case 27:  // escape
      case 38:  // стрелка вверх
      case 40:  // стрелка вниз
      break;
      default:
      obj.f_search.removeClass('search__focused');
      obj.__SearchFieldCheck();
      break;
    }
  }).bind('paste', function(e){
    obj.__SearchFieldCheck();
    setTimeout(function() { obj.__SearchFieldCheck(); },20);
  }).bind('cut', function(e){
    $('#search__result').hide();
    $('#search__result .inner > div').remove();
    obj.__SearchFieldCheck();
  });

  //Считываем нажатие клавиш, уже после вывода подсказки
  var suggestCount;
  var suggestSelected = 0;
  function keyActivate(n){
    var $links = $('#search__result .result__item a');
    $links.eq(suggestSelected-1).removeClass('active');	
    if(n == 1 && suggestSelected < suggestCount){
      suggestSelected++;
    }else if(n == -1 && suggestSelected > 0){
      suggestSelected--;
    }
    if( suggestSelected > 0){
      $links.eq(suggestSelected-1).addClass('active');
    }
  }
  obj.s_search.keydown(function(I){
    switch(I.keyCode) {
    // По нажатию клавиш прячем подсказку
    case 27: // escape
    $('#search__result').hide();
    return false;
    break;
    // Нажатие enter при выделенном пункте из поиска
    case 13: // enter
    if(suggestSelected){
      var $link = $('#search__result .result__item').eq(suggestSelected - 1).find('a');
      var href = $link.attr('href');
      if(href){
        document.location = href
      } else {
        $link.trigger('click')
      }
      return false;
    }
    break;
    // делаем переход по подсказке стрелочками клавиатуры
    case 38: // стрелка вверх
    case 40: // стрелка вниз
    I.preventDefault();
    suggestCount = $('#search__result .result__item').length
    if(suggestCount){
      //делаем выделение пунктов в слое, переход по стрелочкам
      keyActivate(I.keyCode-39);
    }
    break;
    default:
    suggestSelected = 0;
    break;
    }
  });
  // Кнопка обнуления данных в форме поиска
  obj.s_reset.click(function(){
    obj.s_search.val('').focus();
    $('#search__result').hide();
    $('#search__result .inner .result__item').remove();
  });
  // Проверка данных в форме после инициализации функционала. Возможно браузер вставил туда какой-либо текст, нужно обработать и такой вариант
  obj.__SearchFieldCheck();
}

// Аналог php функции.
function htmlspecialchars(text) {
  return text
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#039;");
}
function substr(str,start,len){str+='';var end=str.length;if(start<0){start+=end;}end=typeof len==='undefined'?end:(len<0?len+end:len+start);return start>=str.length||start<0||start>end?!1:str.slice(start,end);}
function md5(str){var xl;var rotateLeft=function(lValue,iShiftBits){return(lValue<<iShiftBits)|(lValue>>>(32-iShiftBits));};var addUnsigned=function(lX,lY){var lX4,lY4,lX8,lY8,lResult;lX8=(lX&0x80000000);lY8=(lY&0x80000000);lX4=(lX&0x40000000);lY4=(lY&0x40000000);lResult=(lX&0x3FFFFFFF)+(lY&0x3FFFFFFF);if(lX4&lY4){return(lResult^0x80000000^lX8^lY8);}
if(lX4|lY4){if(lResult&0x40000000){return(lResult^0xC0000000^lX8^lY8);}else{return(lResult^0x40000000^lX8^lY8);}}else{return(lResult^lX8^lY8);}};var _F=function(x,y,z){return(x&y)|((~x)&z);};var _G=function(x,y,z){return(x&z)|(y&(~z));};var _H=function(x,y,z){return(x^y^z);};var _I=function(x,y,z){return(y^(x|(~z)));};var _FF=function(a,b,c,d,x,s,ac){a=addUnsigned(a,addUnsigned(addUnsigned(_F(b,c,d),x),ac));return addUnsigned(rotateLeft(a,s),b);};var _GG=function(a,b,c,d,x,s,ac){a=addUnsigned(a,addUnsigned(addUnsigned(_G(b,c,d),x),ac));return addUnsigned(rotateLeft(a,s),b);};var _HH=function(a,b,c,d,x,s,ac){a=addUnsigned(a,addUnsigned(addUnsigned(_H(b,c,d),x),ac));return addUnsigned(rotateLeft(a,s),b);};var _II=function(a,b,c,d,x,s,ac){a=addUnsigned(a,addUnsigned(addUnsigned(_I(b,c,d),x),ac));return addUnsigned(rotateLeft(a,s),b);};var convertToWordArray=function(str){var lWordCount;var lMessageLength=str.length;var lNumberOfWords_temp1=lMessageLength+8;var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1%64))/64;var lNumberOfWords=(lNumberOfWords_temp2+1)*16;var lWordArray=new Array(lNumberOfWords-1);var lBytePosition=0;var lByteCount=0;while(lByteCount<lMessageLength){lWordCount=(lByteCount-(lByteCount%4))/4;lBytePosition=(lByteCount%4)*8;lWordArray[lWordCount]=(lWordArray[lWordCount]|(str.charCodeAt(lByteCount)<<lBytePosition));lByteCount++;}
lWordCount=(lByteCount-(lByteCount%4))/4;lBytePosition=(lByteCount%4)*8;lWordArray[lWordCount]=lWordArray[lWordCount]|(0x80<<lBytePosition);lWordArray[lNumberOfWords-2]=lMessageLength<<3;lWordArray[lNumberOfWords-1]=lMessageLength>>>29;return lWordArray;};var wordToHex=function(lValue){var wordToHexValue="",wordToHexValue_temp="",lByte,lCount;for(lCount=0;lCount<=3;lCount++){lByte=(lValue>>>(lCount*8))&255;wordToHexValue_temp="0"+lByte.toString(16);wordToHexValue=wordToHexValue+wordToHexValue_temp.substr(wordToHexValue_temp.length-2,2);}
return wordToHexValue;};var x=[],k,AA,BB,CC,DD,a,b,c,d,S11=7,S12=12,S13=17,S14=22,S21=5,S22=9,S23=14,S24=20,S31=4,S32=11,S33=16,S34=23,S41=6,S42=10,S43=15,S44=21;str=this.utf8_encode(str);x=convertToWordArray(str);a=0x67452301;b=0xEFCDAB89;c=0x98BADCFE;d=0x10325476;xl=x.length;for(k=0;k<xl;k+=16){AA=a;BB=b;CC=c;DD=d;a=_FF(a,b,c,d,x[k+0],S11,0xD76AA478);d=_FF(d,a,b,c,x[k+1],S12,0xE8C7B756);c=_FF(c,d,a,b,x[k+2],S13,0x242070DB);b=_FF(b,c,d,a,x[k+3],S14,0xC1BDCEEE);a=_FF(a,b,c,d,x[k+4],S11,0xF57C0FAF);d=_FF(d,a,b,c,x[k+5],S12,0x4787C62A);c=_FF(c,d,a,b,x[k+6],S13,0xA8304613);b=_FF(b,c,d,a,x[k+7],S14,0xFD469501);a=_FF(a,b,c,d,x[k+8],S11,0x698098D8);d=_FF(d,a,b,c,x[k+9],S12,0x8B44F7AF);c=_FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);b=_FF(b,c,d,a,x[k+11],S14,0x895CD7BE);a=_FF(a,b,c,d,x[k+12],S11,0x6B901122);d=_FF(d,a,b,c,x[k+13],S12,0xFD987193);c=_FF(c,d,a,b,x[k+14],S13,0xA679438E);b=_FF(b,c,d,a,x[k+15],S14,0x49B40821);a=_GG(a,b,c,d,x[k+1],S21,0xF61E2562);d=_GG(d,a,b,c,x[k+6],S22,0xC040B340);c=_GG(c,d,a,b,x[k+11],S23,0x265E5A51);b=_GG(b,c,d,a,x[k+0],S24,0xE9B6C7AA);a=_GG(a,b,c,d,x[k+5],S21,0xD62F105D);d=_GG(d,a,b,c,x[k+10],S22,0x2441453);c=_GG(c,d,a,b,x[k+15],S23,0xD8A1E681);b=_GG(b,c,d,a,x[k+4],S24,0xE7D3FBC8);a=_GG(a,b,c,d,x[k+9],S21,0x21E1CDE6);d=_GG(d,a,b,c,x[k+14],S22,0xC33707D6);c=_GG(c,d,a,b,x[k+3],S23,0xF4D50D87);b=_GG(b,c,d,a,x[k+8],S24,0x455A14ED);a=_GG(a,b,c,d,x[k+13],S21,0xA9E3E905);d=_GG(d,a,b,c,x[k+2],S22,0xFCEFA3F8);c=_GG(c,d,a,b,x[k+7],S23,0x676F02D9);b=_GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);a=_HH(a,b,c,d,x[k+5],S31,0xFFFA3942);d=_HH(d,a,b,c,x[k+8],S32,0x8771F681);c=_HH(c,d,a,b,x[k+11],S33,0x6D9D6122);b=_HH(b,c,d,a,x[k+14],S34,0xFDE5380C);a=_HH(a,b,c,d,x[k+1],S31,0xA4BEEA44);d=_HH(d,a,b,c,x[k+4],S32,0x4BDECFA9);c=_HH(c,d,a,b,x[k+7],S33,0xF6BB4B60);b=_HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);a=_HH(a,b,c,d,x[k+13],S31,0x289B7EC6);d=_HH(d,a,b,c,x[k+0],S32,0xEAA127FA);c=_HH(c,d,a,b,x[k+3],S33,0xD4EF3085);b=_HH(b,c,d,a,x[k+6],S34,0x4881D05);a=_HH(a,b,c,d,x[k+9],S31,0xD9D4D039);d=_HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);c=_HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);b=_HH(b,c,d,a,x[k+2],S34,0xC4AC5665);a=_II(a,b,c,d,x[k+0],S41,0xF4292244);d=_II(d,a,b,c,x[k+7],S42,0x432AFF97);c=_II(c,d,a,b,x[k+14],S43,0xAB9423A7);b=_II(b,c,d,a,x[k+5],S44,0xFC93A039);a=_II(a,b,c,d,x[k+12],S41,0x655B59C3);d=_II(d,a,b,c,x[k+3],S42,0x8F0CCC92);c=_II(c,d,a,b,x[k+10],S43,0xFFEFF47D);b=_II(b,c,d,a,x[k+1],S44,0x85845DD1);a=_II(a,b,c,d,x[k+8],S41,0x6FA87E4F);d=_II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);c=_II(c,d,a,b,x[k+6],S43,0xA3014314);b=_II(b,c,d,a,x[k+13],S44,0x4E0811A1);a=_II(a,b,c,d,x[k+4],S41,0xF7537E82);d=_II(d,a,b,c,x[k+11],S42,0xBD3AF235);c=_II(c,d,a,b,x[k+2],S43,0x2AD7D2BB);b=_II(b,c,d,a,x[k+9],S44,0xEB86D391);a=addUnsigned(a,AA);b=addUnsigned(b,BB);c=addUnsigned(c,CC);d=addUnsigned(d,DD);}
var temp=wordToHex(a)+wordToHex(b)+wordToHex(c)+wordToHex(d);return temp.toLowerCase();}
function utf8_encode(argString){var string=(argString+'');var utftext="";var start,end;var stringl=0;start=end=0;stringl=string.length;for(var n=0;n<stringl;n++){var c1=string.charCodeAt(n);var enc=null;if(c1<128){end++;}else if(c1>127&&c1<2048){enc=String.fromCharCode((c1>>6)|192)+String.fromCharCode((c1&63)|128);}else{enc=String.fromCharCode((c1>>12)|224)+String.fromCharCode(((c1>>6)&63)|128)+String.fromCharCode((c1&63)|128);}
if(enc!==null){if(end>start){utftext+=string.substring(start,end);}
utftext+=enc;start=end=n+1;}}
if(end>start){utftext+=string.substring(start,string.length);}
return utftext;}
function rand(min,max){var argc=arguments.length;if(argc===0){min=0;max=2147483647;}else if(argc===1){throw new Error('Warning: rand() expects exactly 2 parameters, 1 given');}return Math.floor(Math.random()*(max-min+1))+min;}
// Получить md5 хэш
function GenMd5Hash () {
return substr(md5(parseInt(new Date().getTime() / 1000, 10)),rand(0,24),8);
}

// Живой поиск
$(function() {
  // Навигационная таблица над таблицей с данными
  var searchBlock = $('.search');
  var options = {
    target: 'form.store_ajax_catalog',
    url:  '/admin/store_catalog',
    items_target: '#goods',
    last_search_query:  '',
  };
  // По этому хэшу будем обращаться к объекту извне
  var randHash = GenMd5Hash();
  // Если объекта со списком ajax функций не существует, создаём её
  if(typeof(document.SearchInCatalogAjaxQuerySender) == 'undefined') {
  document.SearchInCatalogAjaxQuerySender = {};
  }
  // Поле поиска обновилось, внутри него можно выполнять любые действия
  searchBlock.SearchFieldCheck = function () {
    // Отменяем выполнение последнего запущенного через таймаут скрипта, если таковой был.
    if(typeof(document.lastTimeoutId) != 'undefined') {
      clearTimeout(document.lastTimeoutId);
    }
    document.lastTimeoutId = setTimeout("document.SearchInCatalogAjaxQuerySender['" + randHash + "']('" + htmlspecialchars(searchBlock.s_search.val()) + "');", 300);
  }
  // Отправляет запрос к серверу с задачей поиска товаров
  document.SearchInCatalogAjaxQuerySender[randHash] = function (old_val) {
    var last_search_query_array = [];
    // sessionStorage is available
    if (typeof sessionStorage !== 'undefined') {
      try {
        if(sessionStorage.getItem('lastSearchQueryArray')){
        last_search_query_array = JSON.parse(sessionStorage.getItem('lastSearchQueryArray'));
        // Находим соответствие текущего запроса с sessionStorage
        var currentSearch = $.grep(last_search_query_array, function (item){
          return item.search_query == old_val
        })[0]
        if(currentSearch){
          showDropdownSearch(JSON.parse(currentSearch.content));
          return;
        }
        }else{
        sessionStorage.setItem('lastSearchQueryArray', '[]')
        }
      }catch(e) {
      // sessionStorage is disabled
      }
    }
    // Если текущее значение не изменилось спустя 300 сотых секунды и это значение не то по которому мы искали товары при последнем запросе
    if(htmlspecialchars(searchBlock.s_search.val()) == old_val && searchBlock.s_search.val().length > 1) {
      // Запоминаем этот запрос, который мы ищем, чтобы не произвводить повторного поиска
      options['last_search_query'] = old_val;
      // Добавляем нашей форме поиска поле загрузки
      searchBlock.f_search.addClass('search__loading');
      // Собираем параметры для Ajax запроса
      var params = {
        'ajax_q'                : 1,
        'goods_search_field_id' : 0,
        'q'                     : options['last_search_query'],
      },
      // Объект со значением которого будем в последствии проверять полученные от сервера данные
      search_field_obj = searchBlock.s_search;
      // Аяксом отправляем запрос на поиск нужных товаров и категорий
      $.ajax({
      type: "POST",
      cache: false,
      url: searchBlock.f_search.attr('action'),
      data: params,
      dataType: 'json',
      success: function(data) {
      // Если набранный запрос не соответствует полученным данным, видимо запрос пришёл не вовремя, отменяем его.
      if(search_field_obj.val() != old_val) {
        return false;
      }
      // Записываем в sessionStorage
      if (typeof sessionStorage !== 'undefined') {
        try {
          sessionStorage.setItem('lastSearchQueryArray', JSON.stringify(last_search_query_array))
          // Находим соответствие текущего запроса с sessionStorage
          var currentSearch = $.grep(last_search_query_array, function (item){
            return item.search_query == old_val
          })[0]
          //Если такого запроса ещё не было запишем его в sessionStorage
          if(typeof currentSearch == 'undefined'){
            // Добавляем в массив последних запросов данные по текущему запросу
            last_search_query_array.push({
              search_query: old_val,
              content: JSON.stringify(data)
            })
            sessionStorage.setItem('lastSearchQueryArray', JSON.stringify(last_search_query_array))
          }
        }catch(e){
        // sessionStorage is disabled
        }
      }
      // Показываем результаты на основе пришедших данных
      showDropdownSearch(data);
      // Убираем информацию о том что запрос грузится.
      searchBlock.f_search.removeClass("search__loading");
      }
      });
    }else{
      $("#search__result").hide();
    }
    function showDropdownSearch(data){
      // Отображение категорий в поиске
      if(data.category.length!=undefined && data.category.length>0){
        $(".result__category .result__item").remove();
        $("#search__result").hide();
        for(с=0; с < data.category.length; с++){
          // Проверка наличия изображения
          if (data.category[с].image_icon == null) {
            data.category[с].image_icon = '/design/no-photo-icon.png'
          } else {
            data.category[с].image_icon = data.category[с].image_icon;
          }
          // Отображаем результат поиска
          $("#search__result .result__category").append('<div class="result__item" data-id="'+ data.category[с].goods_cat_id +'"><a href="'+ data.category[с].url +'"><div class="result__image"><img src="'+ data.category[с].image_icon +'" class="goods-image-icon" /></div><div class="result__name"><span>'+ data.category[с].goods_cat_name +'</span></div></a></div>');
        }
      }else{
        $(".result__category .result__item").remove();
        $("#search__result").hide();
      }
      // Отображение товаров в поиске
      if(data.goods.length!=undefined && data.goods.length>0){
        $(".result__goods .result__item").remove();
        $("#search__result").hide();
        for(i=0; i < data.goods.length; i++){
          // Проверка наличия изображения
          if (data.goods[i].image_icon == null) {
            data.goods[i].image_icon = '/design/no-photo-icon.png'
          } else {
            data.goods[i].image_icon = data.goods[i].image_icon;
          }
          // Отображаем результат поиска
          if(i <= 4 ){
            $("#search__result .result__goods").append('<div class="result__item" data-id="'+ data.goods[i].goods_id +'"><a href="'+ data.goods[i].url +'"><div class="result__image"><img src="'+ data.goods[i].image_icon +'" class="goods-image-icon" /></div><div class="result__name"><span>'+ data.goods[i].goods_name +'</span></div></a></div>');
          }
          // Если последняя итерация цикла вставим кнопку "показать все"
          if(i > 4){
            $('.result__showAll').show();
          }
        }
      }else{
        $(".result__goods .result__item").remove();
        $("#search__result").hide();
      }
      // Скрываем результаты поиска если ничего не найдено
      if((data.category.length + data.goods.length) > 0){
        $("#search__result").show();
      }else{
        $("#search__result").hide();
      }
      
      if((data.category.length) > 0){
        $(".result__category").show();
      }else{
        $(".result__category").hide();
      }
      
      if((data.goods.length) > 0){
        $(".result__goods").show();
      }else{
        $(".result__goods").hide();
      }
      // Убираем информацию о том что запрос грузится.
      searchBlock.f_search.removeClass("search__loading");
    }
  }
  SearchFieldInit(searchBlock);
  $('.result__showAll').on('click', function(){
    $('.search__form').submit();
  });
});


// Возвращает правильное окончание для слова
function genWordEnd(num, e, m, mm) {
  // Если забыли указать окончания
  if(typeof (e) == "undefined") { e = ''; }
  if(typeof (m) == "undefined") { e = 'а'; }
  if(typeof (mm) == "undefined"){ e = 'oв'; }
  // Если передали пустую строку, вместо цифры
  if(0 == num.length) { num = 0; }
  // Превращаем цифру в правильный INT
  num = GetSum(num).toString();
  // Получаем последний символ цифры
  ch1 = num.substring(num.length-1);
  // Получаем последний символ цифры
  ch2 = num.length == 1 ? 0 : num.substring(num.length-2, num.length-1);
  // Если последняя цифра - 1, вернем единственное число
  if(ch2!=1 && ch1==1)               {return e;}
  // Если последняя цифра - от 2 до 4х , вернем множественное чило из массива с индексом 2
  else if(ch2!=1 && ch1>1 && ch1<=4) {return m;}
  // Если последняя цифра - от 5 до 0 , вернем множественное чило из массива с индексом 3
  else if(ch2==1 || ch1>4 || ch1==0) {return mm;}
}

//Функция определения браузера
$(document).ready(function() {
  var user = detect.parse(navigator.userAgent);
  if (user.browser.family === 'Safari') {
    $('body').addClass('Safari');
  }
  if (user.browser.family === 'IE') {
    $('body').addClass('IE');
  }
  if (user.browser.family === 'Firefox') {
    $('body').addClass('Firefox');
  }
});

// Работа с cookie файлами. 
// Получение переменной из cookie
function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

// Установка переменной в cookie
function setCookie(name, value, options) {
  options = options || {};
  var expires = options.expires;
  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires*1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) { 
    options.expires = expires.toUTCString();
  }
  value = encodeURIComponent(value);
  var updatedCookie = name + "=" + value;
  for(var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];    
    if (propValue !== true) { 
      updatedCookie += "=" + propValue;
     }
  }
  document.cookie = updatedCookie;
}

// Удаление переменной из cookie
function deleteCookie(name, options ) {
  options = options || {};
  options.expires = -1;
  setCookie(name, "", options)
}

// Отправляет ошибку на сервер, для того чтобы служба тех поддержки могла разобраться в проблеме как можно быстрее.
function sendError (desc, page, line) {
  var img=document.createElement('img');
  img.src = 'https://storeland.ru/error/js?desc='+encodeURIComponent(desc)+'&page='+encodeURIComponent(window.location)+'&line=0';
  img.style.position = 'absolute';
  img.style.top = '-9999px';

  try { document.getElementsByTagName('head').appendChild(img) } catch (e){}
  return false;
}

// Форматирует цену
function number_format(number,decimals,dec_point,thousands_sep){var n=number,prec=decimals;var toFixedFix=function(n,prec){var k=Math.pow(10,prec);return(Math.round(n*k)/k).toString();};n=!isFinite(+n)?0:+n;prec=!isFinite(+prec)?0:Math.abs(prec);var sep=(typeof thousands_sep==='undefined')?',':thousands_sep;var dec=(typeof dec_point==='undefined')?'.':dec_point;var s=(prec>0)?toFixedFix(n,prec):toFixedFix(Math.round(n),prec);var abs=toFixedFix(Math.abs(n),prec);var _,i;if(abs>=1000){_=abs.split(/\D/);i=_[0].length%3||3;_[0]=s.slice(0,i+(n<0))+
_[0].slice(i).replace(/(\d{3})/g,sep+'$1');s=_.join(dec);}else{s=s.replace('.',dec);}
var decPos=s.indexOf(dec);if(prec>=1&&decPos!==-1&&(s.length-decPos-1)<prec){s+=new Array(prec-(s.length-decPos-1)).join(0)+'0';}
else if(prec>=1&&decPos===-1){s+=dec+new Array(prec).join(0)+'0';}
return s;}

// Превращает поле пароля в текстовое поле и обратно
// @LinkObject - ссылка по которой кликнули
// @InputObject - объект у которого нужно изменить тип поля
function ChangePasswordFieldType (LinkObject, InputObject) {
  var 
    // Ссылка по которой кликнули
    LObject = $(LinkObject),
    // Объект у которого изменяем тип с password на text
    IObject = $(InputObject),
    // Старый текст ссылки
    txtOld = LObject.text(),
    // Новый текст ссылки
    txtNew = LObject.attr('rel');

  // Если объекты не получены, завершим работу функции
  if( LObject.length==0 || IObject.length==0 ) {
    return false;
  }

  // Изменяем у ссылки текст со старого на новый
  LObject.html(txtNew);
  // Старый текст ссылки сохраняем в атрибуте rel 
  LObject.attr('rel', txtOld);

  // Изменяем тип input поля
  if(IObject[0].type == 'text') {
    IObject[0].type = 'password';
  } else {
    IObject[0].type = 'text';
  }
}

// Крутит изображение при обновлении картинки защиты от роботов
function RefreshImageAction(img,num,cnt) {
  if(cnt>13) {
    return false;
  }
  $(img).attr('src', $(img).attr('rel') + 'icon/refresh/' + num + '.gif');
  num = (num==6)?0:num;
  setTimeout(function(){RefreshImageAction(img, num+1, cnt+1);}, 50);
}

// Проверка вводимых значений в количестве товара
function keyPress(oToCheckField, oKeyEvent) {
  return oKeyEvent.charCode === 0 || /\d/.test(String.fromCharCode(oKeyEvent.charCode));
}

// Сравнение товаров
jQuery(document).ready(function(){
  // Сравнение товаров. Инвертирование свойств для сравнения товара
  $('.CompareCheckbox.invert').click(function(){
    var checked = true,
        checkboxes = $('.CompareCheckbox:not(.invert)');

    checkboxes.each(function(){
      if($(this).attr('checked')) {
        checked = false;
        return false;
      }
    });
    
    checkboxes.each(function(){
      $(this).attr('checked', checked);
    });
    
    $(this).attr('checked', checked);
  });
  
  // Сравнение товаров. Скрытие характеристик товара, которые выделил пользователь
  $('.CompareGoodsHideSelected').click(function(){

    $('.CompareGoodsTableTbodyComparisonLine').each(function(){
      var CheckedCheckbox = $(this).find('.CompareCheckbox:checked:not(.invert)');
      if(CheckedCheckbox.length>0) {
        $(this).hide();
      }
    });

    // отменяем выделение характеристик товаров
    $('.CompareCheckbox').attr('checked',false);

    return false;
  });
  
  // Сравнение товаров. Скрытие характеристик товара, которые выделил пользователь
  $('.CompareGoodsHideSelected').click(function(){
  $('.CompareGoodsShowAll').show();
    $('.CompareGoodsTableTbodyComparisonLine').each(function(){
      var CheckedCheckbox = $(this).find('.CompareCheckbox:checked:not(.invert)');
      if(CheckedCheckbox.length>0) {
        $(this).hide();
      }
    });

    // отменяем выделение характеристик товаров
    $('.CompareCheckbox').attr('checked',false);

    return false;
  });
  
  // Сравнение товаров. Отображение скрытых характеристик товара
  $('.CompareGoodsShowAll').click(function(){
    $(this).hide();
    $('.CompareGoodsTableTbodyComparisonLine:hidden').show();
    return false;
  });
  
  // Сравнение товаров. Верхняя навигация изменение фильтра на отображение всех характеристик товаров
  $('.CompareGoodsTableFilterShowAll').click(function(){
    $('.CompareGoodsTableFilterSelected').removeClass('CompareGoodsTableFilterSelected');
    $('.CompareGoodsTableTbodyComparisonLine:hidden').show();
    
    $(this).addClass('CompareGoodsTableFilterSelected');
    return false;
  });

  // Сравнение товаров. Фильтр в верхней навигации. Отображение только различающихся характеристик товара
  $('.CompareGoodsTableFilterShowOnlyDifferent').click(function(){
    $('.CompareGoodsTableFilterSelected').removeClass('CompareGoodsTableFilterSelected');
    $('.CompareGoodsTableTbodyComparisonLine:not(.same)').show();
    $('.CompareGoodsTableTbodyComparisonLine.same').hide();

    $(this).addClass('CompareGoodsTableFilterSelected');
    return false;
  });
  
  // При клике по строке выделяем свойство
  $('.CompareGoodsTableTbodyComparisonLine td:not(.ceil1)').click(function(){
    var CompareCheckbox = $(this).parent().find('.CompareCheckbox');

    if(CompareCheckbox.attr('checked')) {
      CompareCheckbox.attr('checked', false);
    } else {
      CompareCheckbox.attr('checked', true);
    }
  });
  
  function compareGetVars () {
    return new Array(
      $('.CompareGoodsTableTbody tr:first td').length - 1,
      parseInt($('.CompareGoodsTableTbody tr:first td:visible:not(.ceil1)').attr('class').replace(new RegExp('compare\-td compare\-td\-'), '')),
      parseInt($('.CompareGoodsTableTbody tr:first td:visible:last').attr('class').replace(new RegExp('compare\-td compare\-td\-'), ''))
    );
  }
  
  // Прокрутка списка сравнения вправо
  $('.CompareGoodsTableNext').click(function(){
    
    // Определяем используемые поля
    var data = compareGetVars(); 
      
    // Изменяем их если это возможно.
    if(data[0] > data[2]) {
      $('.compare-td-' + data[1]).hide();
      $('.compare-td-' + (data[2] + 1)).show();
      if((data[2] + 1) >= data[0]) {
        $(this).find('a').addClass('disable');
      }
      if(data[1] + 1 != 1) {
        $('.CompareGoodsTablePrev a').removeClass('disable');
      }
    }
    
    return false;
  });
  
  // Прокрутка списка сравнения влево
  $('.CompareGoodsTablePrev').click(function(){
    
    // Определяем используемые поля
    var data = compareGetVars(); 
    
    // Изменяем их если это возможно.
    if(1 < data[1]) {
      $('.compare-td-' + (data[1] - 1)).show();
      $('.compare-td-' + data[2]).hide();
      if((data[1] - 1) <= 1) {
        $(this).find('a').addClass('disable');
      }
      if(data[2] - 1 != data[0]) {
        $('.CompareGoodsTableNext a').removeClass('disable');
      }
    }
    
    return false;
  });
});

// Основные функции шаблона для товаров
function MainFunctions() {
$(document).ready(function(){
  
  // Кнопки на сайте если подгружен модуль Jquery.UI
  if(typeof($('button.submit, button:submit, input:submit, input.button').button) == "function" ) {
    $('button.submit, button:submit, input:submit, input.button').button();
  }
  
  // Валидация формы на странице оформления заказа, а так же формы на страницы связи с администрацией
  $("#myform, .feedbackForm, .clientForm, #quickform, .goodsDataOpinionAddForm").validate({
     rules: {
     reg_name: "required"
   }
  });
  
  // Отправка формы по Ctrl+Enter
  $('form').bind('keypress', function(e){
    if((e.ctrlKey) && ((e.which==10)||(e.which==13))) {$(this).submit();}
  // Отправка данных формы по нажатию на Enter в случае если курсор находится в input полях (В некоторых браузерах при нажатии по enter срабатывает клик по первому submit полю, которое является кнопкой назад. Для этого написан этот фикс)
  }).find('input').bind('keypress', function(e){
    if(((e.which==10)||(e.which==13))) { try{$(this.form).submit();} catch(e){} return false; }
  });
  
  // Функция собирает свойства в строку, для определения модификации товара
  function getSlugFromGoodsDataFormModificationsProperties(obj) {
    var properties = new Array();
    $(obj).each(function(i){
      properties[i] = parseInt($(this).val());
    });
    return properties.sort(function(a,b){return a - b}).join('_');
  }
  
  var 
    // Запоминаем поля выбора свойств, для ускорения работы со значениями свойств
    goodsDataProperties = $('form.goodsDataForm select[name="form[properties][]"]'),
    // Запоминаем блоки с информацией по модификациям, для ускорения работы
    goodsDataModifications = $('div.goodsDataMainModificationsList');
    
  // Обновляет возможность выбора свойств модификации, для отключения возможности выбора по характеристикам модификации которой не существует.
  function updateVisibility (y) {
    // Проверяем в каждом соседнем поле выбора модификаций, возможно ли подобрать модификацию для указанных свойств
    goodsDataProperties.each(function(j){
      // Если мы сравниваем значения свойства не с самим собой, а с другим списком значений свойств
      if( j != y ) {
        // Проходим по всем значениям текущего свойства модификации товара
        $(this).find('option').each(function(){
          // Записываем временный массив свойств, которые будем использовать для проверки существования модификации
          var checkProperties = new Array();
          $(goodsDataProperties).each(function(i){
            checkProperties[i] = parseInt($(this).val());
          });
          // Пытаемся найти модификацию соответствующую выбранным значениям свойств
          checkProperties[j] = parseInt($(this).attr('value'));
          // Собираем хэш определяющий модификацию по свойствам
          slug = checkProperties.sort(function(a,b){return a - b}).join('_');
          // Ищем модификацию по всем выбранным значениям свойств товара. Если модификации нет в возможном выборе, отмечаем потенциальное значение выбора как не доступное для выбора, т.к. такой модификации нет.
          if(!goodsDataModifications.filter('[rel="'+slug+'"]').length) {
           $(this).attr('disabled', true);
          // Если выбрав данное значение свойства товара можно подобрать модификацию, то выделяем вариант выбора как доступный.
          } else {
            $(this).attr('disabled', false);
          }
        });
      }
    });
  }
  // Обновляем возможность выбора модификации товара по свойствам. Для тех свойств, выбор по которым не возможен, отключаем такую возможность.
  // Проверяем возможность выбора на всех полях кроме первого, чтобы отключить во всех остальных варианты, которые не возможно выбрать
  updateVisibility (0);
  // Проверяем возможность выбора на всех полях кроме второго, чтобы в первом поле так же отключилась возможность выбора не существующих модификаций
  updateVisibility (1);
  
  //var goodsDataProperties = $('.goodsDataForm [name="form[properties][]"]');
  
  // Изменение цены товара при изменении у товара свойства для модификации
  goodsDataProperties.each(function(){
    $(this).change(function(){
      var slug = getSlugFromGoodsDataFormModificationsProperties(goodsDataProperties),
          modificationBlock             = $('.goodsDataMainModificationsList[rel="'+slug+'"]'),
          modificationId                = parseInt(modificationBlock.find('[name="id"]').val()),
          modificationArtNumber         = modificationBlock.find('[name="art_number"]').val(),
          modificationPriceNow          = parseInt(modificationBlock.find('[name="price_now"]').val()),
          modificationPriceNowFormated  = modificationBlock.find('.price_now_formated').html(),
          modificationPriceOld          = parseInt(modificationBlock.find('[name="price_old"]').val()),
          modificationPriceOldFormated  = modificationBlock.find('.price_old_formated').html(),
          modificationRestValue         = parseFloat(modificationBlock.find('[name="rest_value"]').val()),
          modificationDescription       = modificationBlock.find('.description').html(),
          modificationMeasureId         = parseInt(modificationBlock.find('[name="measure_id"]').val()),
          modificationMeasureName       = modificationBlock.find('[name="measure_name"]').val(),
          modificationMeasureDesc       = modificationBlock.find('[name="measure_desc"]').val(),
          modificationMeasurePrecision  = modificationBlock.find('[name="measure_precision"]').val(),
          modificationIsHasInCompareList= modificationBlock.find('[name="is_has_in_compare_list"]').val(),
          modificationGoodsModImageId   = modificationBlock.find('[name="goods_mod_image_id"]').val(),
          goodsModificationId           = $('.goodsDataMainModificationId'),
          goodsPriceNow                 = $('.goodsDataMainModificationPriceNow'),
          goodsPriceOld                 = $('.goodsDataMainModificationPriceOld'),
          goodsAvailable                = $('.goodsDataMainModificationAvailable'),
          goodsAvailableTrue            = goodsAvailable.find('.available-true'),
          goodsAvailableFalse           = goodsAvailable.find('.available-false'),
          goodsAvailableAddCart         = $('.add-to-box'),
          goodsArtNumberBlock           = $('.goodsDataMainModificationArtNumber'),
          goodsArtNumber                = goodsArtNumberBlock.find('span');
          goodsCompareAddButton         = $('.goodsDataCompareButton.add');
          goodsCompareDeleteButton      = $('.goodsDataCompareButton.delete');
          goodsModDescriptionBlock      = $('.goodsDataMainModificationsDescriptionBlock');
       
       // Изменяем данные товара для выбранных параметров. Если нашлась выбранная модификация
       if(modificationBlock.length) {
         // Цена товара
         goodsPriceNow.html('<span class="price">' + modificationPriceNowFormated + '</span>');
          
         // Старая цена товара
         if(modificationPriceOld>modificationPriceNow) {
          goodsPriceOld.html('<span>' + modificationPriceOldFormated + '</span>');
         } else {
           goodsPriceOld.html('');
         }
         
         // Есть ли товар есть в наличии
         if(modificationRestValue>0) {
           goodsAvailableTrue.show();
           goodsAvailableFalse.hide();
           goodsAvailableAddCart.show();
         // Если товара нет в наличии
         } else {
           goodsAvailableTrue.hide();
           goodsAvailableFalse.show();
           goodsAvailableAddCart.hide();
         }
         // Если товар есть в списке сравнения
         if(modificationIsHasInCompareList>0) {
           goodsCompareAddButton.hide();
           goodsCompareDeleteButton.show();
         // Если товара нет в списке сравнения
         } else {
           goodsCompareAddButton.show();
           goodsCompareDeleteButton.hide();
         }
         
         // Покажем артикул модификации товара, если он указан
         if(modificationArtNumber.length>0) {
           goodsArtNumberBlock.show();
           goodsArtNumber.html(modificationArtNumber);
         // Скроем артикул модификации товара, если он не указан
         } else {
           goodsArtNumberBlock.hide();
           goodsArtNumber.html('');
         }

         // Описание модификации товара. Покажем если оно есть, спрячем если его у модификации нет
         if(modificationDescription.length > 0) {
           goodsModDescriptionBlock.show().html('<div>' + modificationDescription + '</div>');
         } else {
           goodsModDescriptionBlock.hide().html();
         }
         
         // Идентификатор товарной модификации
         goodsModificationId.val(modificationId);
         // Меняет главное изображение товара на изображение с идентификатором goods_mod_image_id
        function changePrimaryGoodsImage(goods_mod_image_id) {
          // Если не указан идентификатор модификации товара, значит ничего менять не нужно.
          if(1 > goods_mod_image_id) {
            return true;
          }
          var 
            // Блок с изображением выбранной модификации товара
            goodsModImageBlock = $('.thumblist [data-id="' + parseInt(goods_mod_image_id) + '"'),
            // Блок, в котором находится главное изображение товара
            MainImageBlock = $('.general-img'),
            // Изображение модификации товара, на которое нужно будет изменить главное изображение товара.
            MediumImageUrl = goodsModImageBlock.find('a').attr('href'),
            // Главное изображение, в которое будем вставлять новое изображение
            MainImage = MainImageBlock.find('img'),
            // В этом объекте хранится идентификатор картинки главного изображения для коректной работы галереи изображений
            MainImageIdObject = MainImageBlock.attr('data-id')
          ;
          
          // Если изображение модификации товара найдено - изменяем главное изображение
          MainImage.attr('src', MediumImageUrl);
          MainImageBlock.find('a').attr('href', MediumImageUrl);
          // Изменяем идентификатор главного изображения
          MainImageBlock.attr("data-id", parseInt(goods_mod_image_id));
          return true;
        }
        // Обновляем изображние модификации товара, если оно указано
        changePrimaryGoodsImage(modificationGoodsModImageId);
       } else {
         // Отправим запись об ошибке на сервер
         sendError('no modification by slug '+slug);
         alert('К сожалению сейчас не получается подобрать модификацию соответствующую выбранным параметрам.');
       }
    });
  });
  
  // Фильтр по ценам
  jQuery(document).ready(function(){
    var
      // Минимальное значение цены для фильтра
      priceFilterMinAvailable = parseInt($('.goodsFilterPriceRangePointers .min').text())
      // Максимальное значение цены для фильтра
      ,priceFilterMaxAvailable = parseInt($('.goodsFilterPriceRangePointers .max').text())
      // Максимальное значение цены для фильтра
      ,priceSliderBlock = $('#goods-filter-price-slider')
      // Поле ввода текущего значения цены "От"
      ,priceInputMin = $( "#goods-filter-min-price" )
      // Поле ввода текущего значения цены "До"
      ,priceInputMax = $( "#goods-filter-max-price" )
      // Блок с кнопкой, которую есть смысл нажимать только тогда, когда изменялся диапазон цен.
      ,priceSubmitButtonBlock = $( ".goodsFilterPriceSubmit" )
    ;
    
    // Изменяет размер ячеек с ценой, т.к. у них нет рамок, есть смысл менять размеры полей ввода, чтобы они выглядили как текст
    function priceInputsChangeWidthByChars() {
      // Если есть блок указания минимальной цены
      if(priceInputMin.length) {
        priceInputMin.css('width', (priceInputMin.val().length*7 + 30) + 'px');
        priceInputMax.css('width', (priceInputMax.val().length*7 + 30) + 'px');
      }
    }
    
    // Слайдер, который используется для удобства выбора цены
    priceSliderBlock.slider({
      range: true,
      min: priceFilterMinAvailable,
      max: priceFilterMaxAvailable,
      values: [
        parseInt($('#goods-filter-min-price').val())
        ,parseInt($('#goods-filter-max-price').val())
      ],
      slide: function( event, ui ) {
        priceInputMin.val( ui.values[ 0 ] );
        priceInputMax.val( ui.values[ 1 ] );
        priceSubmitButtonBlock.show();
        priceInputsChangeWidthByChars();
      }
    });
    
    // При изменении минимального значения цены
    priceInputMin.keyup(function(){
      var newVal = parseInt($(this).val());
      if(newVal < priceFilterMinAvailable) {
             newVal = priceFilterMinAvailable;
      }
      priceSliderBlock.slider("values", 0, newVal);
      priceSubmitButtonBlock.show();
      priceInputsChangeWidthByChars();
    });
    
    // При изменении максимального значения цены
    priceInputMax.keyup(function(){
      var newVal = parseInt($(this).val());
      if(newVal > priceFilterMaxAvailable) {
             newVal = priceFilterMaxAvailable;
      }
      priceSliderBlock.slider("values", 1, newVal);
      priceSubmitButtonBlock.show();
      priceInputsChangeWidthByChars();
    });
    // Обновить размеры полей ввода диапазона цен
    priceInputsChangeWidthByChars();
  });
  
  // Добавление товара в корзину через ajax
  $('.goodsDataForm, .goodsToCartFromCompareForm, .goodsListForm').submit(function() {
    // Выносим функции из шаблонов
    if ($(this).attr('rel') === 'quick') {
      quickOrder(this);
      return (false);
    }
    $('.mycart').addClass('have-items');
    // Находим форму, которую отправляем на сервер, для добавления товара в корзину
    var formBlock = $($(this).get(0));
    var adresCart = '/cart';
    // Проверка на существование формы отправки запроса на добавление товара в корзину
    if (1 > formBlock.length || formBlock.get(0).tagName != 'FORM') {
      alert('Не удалось найти форму добавления товара в корзину');
      return false;
    }
    // Получаем данные формы, которые будем отправлять на сервер
    var formData = formBlock.serializeArray();
    // Сообщаем серверу, что мы пришли через ajax запрос
    formData.push({name: 'ajax_q', value: 1});
    // Так же сообщим ему, что нужно сразу отобразить форму быстрого заказа
    //formData.push({name: 'fast_order', value: 1});
    // Аяксом добавляем товар в корзину и вызываем форму быстрого заказа товара
    $.ajax({
      type: "POST",
      cache: false,
      url: formBlock.attr('action'),
      data: formData,
      success: function(data) {
        $.fancybox({
          content: data,
          // При изменении размера окна изменяем размер окна оформления заказа
          onUpdate: function() {
            return false;
          }
        });
        setTimeout(function() {
          $.fancybox.update();
        }, 500);
      }
    });
    return false;
  });
  
  // Добавление/удаление товара на сравнение/избранное через ajax
  $('.add-compare').click(function(){
    // Объект ссылки, по которой кликнули
    var 
      a = $(this)
      ,addUrl = a.attr('data-action-add-url')
      ,delUrl = a.attr('data-action-delete-url')
      ,addTitle = a.attr('data-action-add-title')
      ,delTitle = a.attr('data-action-delete-title')
      ,isAdd = a.attr('data-action-is-add')
      ,pName = a.attr('data-prodname')
      ,pUrl = a.attr('data-produrl')
      ,pDataid = a.attr('data-id')
      ,pDataprice = a.attr('data-mod-id')
      ,pDataGoodsid = a.attr('data-goodsid')
      ,aText = a.parent().find('.add-compare')
      requestUrl = a.attr('href')
    ;
    var flag = 0;
    $('#compare-items li').each(function(){       
      if($(this).find('a.dataid').text() == pDataid){  
      flag = 1;
      }
      if(flag == 1){
        $(this).remove();
        return false;
      }
      return flag;
    })   
      
      
    // Если в ссылке присутствует идентификатор, который мы можем узнать только вытащив его с текущей страницы
    if( /GET_GOODS_MOD_ID_FROM_PAGE/.test(requestUrl)) {
      requestUrl = requestUrl.replace(new RegExp('GET_GOODS_MOD_ID_FROM_PAGE'), $('.goodsDataMainModificationId').val());
    }
    
    // Если есть информация о том какие URL адреса будут изменены, то можено не перегружать страницу и сделать запрос через ajax
    if(addUrl && delUrl) {
      $.ajax({
        type : "POST",
        dataType: 'json',
        cache : false,
        url : requestUrl,
        data : {
          'ajax_q': 1
        },
        success: function(data) {
          if(flag == 0){   
            $('#compare-items').prepend('<li class="item"><a data-href="'+ delUrl +'?id='+ pDataprice +'" data-goods-mod-id="'+ pDataprice +'" class="remove-compare fa fa-close" title="Убрать товар из списка сравнения"></a><div class="product-name"><a href="'+ pUrl +'" class="title" title="'+ pName +'">'+ pName +'</a></div><a href="#" class="dataid">'+ pDataid +'</a></li>');
          }
          if('ok' == data.status) {
            if(isAdd == 1) {
              var 
                from = addUrl
                ,to = delUrl
                ,newIsAddStatus = 0
                ,newTitle = delTitle ? delTitle : ''
              ;
              a.addClass('added');
            } else {
              var 
                from = delUrl
                ,to = addUrl
                ,newIsAddStatus = 1
                ,newTitle = addTitle ? addTitle : ''
              ;
              a.removeClass('added');
            }
            
            // Если указано, что изменилось число товаров на сравнении
            if(typeof(data.compare_goods_count) != 'undefined') {
              // Блок информации о том, что есть товары на сравнении
              var sidecount = $('.compare-num');
              // Если на сравнении больше нет товаров
              // Указываем информацию о новом количестве товаров на сравнении
              // Блок обновления списка сравнения в каталога
              sidecount.animate({opacity: 0,display: "none"},500,function(){
              sidecount.text(data.compare_goods_count);                 
                if(data.compare_goods_count > 0){
                  $('.block.block-compare').addClass('have-items');
                }else{
                  $('.block.block-compare').removeClass('have-items');
                }
              }).animate({display: "inline",opacity: 1} , 500 );
              
            }
            
            // Обновляем ссылку, на которую будет уходить запрос и информацию о ней
            a.attr('href', a.attr('href').replace(new RegExp(from), to))
             .attr('title', newTitle)
             .attr('data-action-is-add', newIsAddStatus);
            
            // Если есть функция, которая отображает сообщения пользователю
            if(typeof(noty) == "function") {
              noty({
                text:data.message
                ,layout:"center"
                ,type:"success"
                ,textAlign:"center"
                ,easing:"swing"
                ,animateOpen:{"height":"toggle"}
                ,animateClose:{"opacity":"hide"}
                ,speed:"500"
                ,timeout:"3000"
                ,closable: false
                ,modal: false
                ,dismissQueue: true
                ,onClose: true
                ,killer: true
              });
            }
              
          } else if('error' == data.status) {
            // Если есть функция, которая отображает сообщения пользователю
            if(typeof(noty) == "function") {
              noty({
                text:data.message
                ,layout:"center"
                ,type:"error"
                ,textAlign:"center"
                ,easing:"swing"
                ,animateOpen:{"height":"toggle"}
                ,animateClose:{"opacity":"hide"}
                ,speed:"500"
                ,timeout:"3000"
                ,closable: false
                ,modal: false
                ,dismissQueue: true
                ,onClose: true
                ,killer: true
              });
            }
          }
        }
      });
      
      return false;
    }
  });

  // Добавление/удаление товара на сравнение/избранное через ajax
  $('.add-wishlist').click(function(){
    // Объект ссылки, по которой кликнули
    var 
      a = $(this)
      ,addUrl = a.attr('data-action-add-url')
      ,delUrl = a.attr('data-action-delete-url')
      ,addTitle = a.attr('data-action-add-title')
      ,delTitle = a.attr('data-action-delete-title')
      ,isAdd = a.attr('data-action-is-add')
      ,aText = a.parent().find('.add-wishlist')
      requestUrl = a.attr('href')
    ;
    
    // Если в ссылке присутствует идентификатор, который мы можем узнать только вытащив его с текущей страницы
    if( /GET_GOODS_MOD_ID_FROM_PAGE/.test(requestUrl)) {
      requestUrl = requestUrl.replace(new RegExp('GET_GOODS_MOD_ID_FROM_PAGE'), $('.goodsDataMainModificationId').val());
    }
    
    // Если есть информация о том какие URL адреса будут изменены, то можено не перегружать страницу и сделать запрос через ajax
    if(addUrl && delUrl) {
      $.ajax({
        type : "POST",
        dataType: 'json',
        cache : false,
        url : requestUrl,
        data : {
          'ajax_q': 1
        },
        success: function(data) {
          if('ok' == data.status) {
            if(isAdd == 1) {
              var 
                from = addUrl
                ,to = delUrl
                ,newIsAddStatus = 0
                ,newTitle = delTitle ? delTitle : ''
              ;
              a.addClass('added');
            } else {
              var 
                from = delUrl
                ,to = addUrl
                ,newIsAddStatus = 1
                ,newTitle = addTitle ? addTitle : ''
              ;
              a.removeClass('added');
            }
            
            // Если указано, что изменилось число товаров на сравнении
            if(typeof(data.compare_goods_count) != 'undefined') {
              // Блок информации о том, что есть товары на сравнении
              var compareBlock = $('#compareInfoBlock');
              // Если на сравнении больше нет товаров
              if(0 < data.compare_goods_count) {
                compareBlock.show();
              // Если на сравнении есть новые товары
              } else {
                compareBlock.hide();
              }
              // Указываем информацию о новом количестве товаров на сравнении
              compareBlock.find('.nb_goods').text( data.compare_goods_count + ( typeof(genWordEnd) == 'function' ? ' товар' + genWordEnd(data.compare_goods_count, "", "а", "ов") : '') );
            }
            
            // Обновляем ссылку, на которую будет уходить запрос и информацию о ней
            a.attr('href', a.attr('href').replace(new RegExp(from), to))
             .attr('title', newTitle)
             .attr('data-action-is-add', newIsAddStatus);
            
            // Если есть функция, которая отображает сообщения пользователю
            if(typeof(noty) == "function") {
              noty({
                text:data.message
                ,layout:"center"
                ,type:"success"
                ,textAlign:"center"
                ,easing:"swing"
                ,animateOpen:{"height":"toggle"}
                ,animateClose:{"opacity":"hide"}
                ,speed:"500"
                ,timeout:"3000"
                ,closable: false
                ,modal: false
                ,dismissQueue: true
                ,onClose: true
                ,killer: true
              });
            }
              
          } else if('error' == data.status) {
            // Если есть функция, которая отображает сообщения пользователю
            if(typeof(noty) == "function") {
              noty({
                text:data.message
                ,layout:"center"
                ,type:"error"
                ,textAlign:"center"
                ,easing:"swing"
                ,animateOpen:{"height":"toggle"}
                ,animateClose:{"opacity":"hide"}
                ,speed:"500"
                ,timeout:"3000"
                ,closable: false
                ,modal: false
                ,dismissQueue: true
                ,onClose: true
                ,killer: true
              });
            }
          }
        }
      });
      
      return false;
    }
  });
  
  // Фильтры по товарам. При нажании на какую либо характеристику или свойство товара происходит фильтрация товаров
  $('.contentTbodySearchFilterBlock input').click(function(){
    $(this)[0].form.submit();
  });
  
  // Форма регистрации нового пользователя, действие ссылки "показать пароль"
  $('.showPass').click(function(){
    ChangePasswordFieldType(this, $('#sites_client_pass'));
    return false;
  });
  
  // В форме оформления заказа при клике на кнопку назад просто переходим на предыдущую страницу
  $('.order form input:submit[name="toprev"]').click(function(){
    var act = this.form.action;
    this.form.action = act + ( act.indexOf( '\?' ) > -1 ? '&' : '?' ) + 'toprev=1';
    this.form.submit();
    return false;
  });
  
});
}

// Регистрация и выбор доставки
function OrderScripts(){
$(document).ready(function(){
  // Форма регистрации нового пользователя, при оформлении заказа
  $('.OrderShowPass').click(function(){
    ChangePasswordFieldType(this, $('#contactPassWord'));
    return false;
  });
  
  // При оформлении заказа дадим возможность зарегистрироваться пользователю
  $('#contactWantRegister').click(function(){
    if($(this).prop("checked")) {
      $('.contactRegisterNeedElement').show();
      $('#contactEmail, #contactPassWord').addClass('required');
    } else {
      $('.contactRegisterNeedElement').hide();
      $('#contactEmail, #contactPassWord').removeClass('required');
    }
  });
  
  // Действия при выборе варианта доставки на этапе оформления заказа
  $(function(){
   sd = $($('.deliveryRadio')[0]);
   id = sd.val()
   ,fz = $($('.deliveryZoneRadio[deliveryid='+id+']')[0]);
   sd.prop('checked',true);
   fz.prop('checked',true);
   if($('.zones').length){  
     price = fz.next().find('.num').text();
     oldPrice = $('tbody[rel='+ id +']').find('.pricefield').find('.num');
     oldPrice.text(price);
   }
  });
  $(function(){
    $('.deliveryRadio').each(function(){
     var 
      id = $(this).val()
      ,fz = $($('.deliveryZoneRadio[deliveryid='+id+']')[0]);  
      if($('.zones').length){  
        price = fz.next().find('.num').text();
        oldPrice = $('tbody[rel='+ id +']').find('.pricefield').find('.num');
        if(price != ''){
         oldPrice.text(price);
        }
      }
    })
  });
  $(function(){   
    $('.orderStageDeliveryListTable').on('change','.deliveryRadio',function(){
      $('.deliveryRadio,.deliveryZoneRadio').each(function(){
        $(this).removeAttr('checked');
      })
      var id = $(this).val()
         ,fz = $($('.deliveryZoneRadio[deliveryid='+id+']')[0]);          
      $(this).prop('checked',true);
      fz.prop('checked',true);   
      if($('.zones').length){  
        price = fz.next().find('.num').text();
        oldPrice = $('tbody[rel='+ id +']').find('.pricefield').find('.num');
        if(price != ''){
          oldPrice.text(price);
        }
      }
    }) 
  });
  // Действия при выборе зоны внутри варианта доставки на этапе оформления заказа
  $('.deliveryZoneRadio').click(function(){
    var id = $(this).attr('deliveryid'),
    price = $(this).next().find('.num').text()
    ,oldPrice = $('tbody[rel='+ id +']').find('.pricefield').find('.num');
    if(price != ''){
      oldPrice.text(price);
    }
    $('.deliveryRadio').each(function(){ 
      $(this).removeAttr('checked');   
      if($(this).val() == id){
       $(this).prop('checked',true);
      }else{
        $(this).removeAttr('checked');
      }
    })
  });
  // Выбор даты доставки
  $("#deliveryConvenientDate").datepicker({
    dayNames        : ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
    dayNamesMin  	  : ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб' ],
		closeText		    : 'Готово',
		currentText		  : 'Сегодня' ,
		duration		    : '',
		monthNames		  : ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
		monthNamesShort : ['Янв','Фев','Март','Апр','Май','Июнь','Июль','Авг','Сен','Окт','Ноя','Дек'],
		yearRange		    : "-6:+6",
		dateFormat		  : 'dd.mm.yy',
		minDate         : new Date(),
		firstDay		    : 1
	});
});
}

// Скрипты для Быстрого заказа
function quickOrderScripts(){
$(document).ready(function(){
    
  var ID = $('input[name="form[delivery][id]"]:checked').val();  
    
  $('.payment').hide();
  $('.payment[rel="' + ID + '"]').show();
  $('.payment[rel="' + ID + '"]').find('input:first').prop('checked', true);
    
  $('.deliveryRadio').click(function(){  
    var ID = $('input[name="form[delivery][id]"]:checked').val();  
    $('.payment').hide();
    $('.payment[rel="' + ID + '"]').show();
    $('.payment[rel="' + ID + '"]').find('input:first').prop('checked', true);
  });
    
  // Валидация формы на странице оформления заказа
  $("#quickform").submit(function(){
    // Если форма невалидна не отправляем её на сервер
    if(!$(this).valid()) {
      return false;
    }
    // Получаем данные формы, которые будем отправлять на сервер
    var formData = $(this).serializeArray();
    // Сообщаем серверу, что мы пришли через ajax запрос
    formData.push({name: 'ajax_q', value: 1});
    // Аяксом добавляем товар в корзину и вызываем форму быстрого заказа товара
    $.ajax({
      type    : "POST",
      dataType: 'json',
      cache    : false,
      url  	  : $(this).attr('action'),
      data		: formData,
      success: function(data) {
        // Если заказ был успешно создан
        if( data.status == 'ok' ) {
          window.location = data.location;
        } else if( data.status == 'error' ) {
          alert(data.message);
        } else {
          alert('Во время оформления заказа возникла неизвестная ошибка. Пожалуйста, обратитесь в службу технической поддержки.');
        }
      }
    });
    return false;      
  }).validate();
 
});
}
// Быстрый заказ
function quickOrder(formSelector) {

  // Находим форму, которую отправляем на сервер, для добавления товара в корзину
  var formBlock = $($(formSelector).get(0));

  // Проверка на существование формы отправки запроса на добавление товара в корзину
  if(1 > formBlock.length || formBlock.get(0).tagName != 'FORM') {
    alert('Не удалось найти форму добавления товара в корзину');
    return false;
  }
  
  // Получаем данные формы, которые будем отправлять на сервер
  var formData = formBlock.serializeArray();

  // Сообщаем серверу, что мы пришли через ajax запрос
  formData.push({name: 'ajax_q', value: 1});
  // Так же сообщим ему, что нужно сразу отобразить форму быстрого заказа 
  formData.push({name: 'fast_order', value: 1});

  // Аяксом добавляем товар в корзину и вызываем форму быстрого заказа товара
  $.ajax({
    type    : "POST",
		cache	  : false,
		url		  : formBlock.attr('action'),
		data		: formData,
		success: function(data) {
			$.fancybox({
        content : data,
        // При изменении размера окна изменяем размер окна оформления заказа
        onUpdate  : function(){
          ppModal();
          var w = $(window).width()*0.8;
          if(w < 800) {
            // Автоматический ресайз внутреннего блока fancybox-а
            $('.fancybox-inner').css('width', 'auto');
            // Изменяем размер fancybox окна
            $('.fancybox-wrap').css({'width': w + 'px'});
          }
          return false;
        }
			});
      setTimeout(function(){$.fancybox.update();}, 500);
		}
	});
  return false;
}

// Функция быстрого оформления заказа в корзине
function startOrder(){  
    var globalOrder = $('#globalOrder');
    var closeOrder = $('#closeOrder'); // объект кнопки отмены заказа
    var textCloseOrder = '#closeOrder';
    // Если форма уже открыта то ничего не делаем.
    if (globalOrder.css('display') != 'none') {
      // Если блок с формой заказа не скрыт то выходим из функции
      return false;
    }
    //объект блока куда будет выводиться форма быстрого заказа
    var OrderAjaxBlock = $('#OrderAjaxBlock');
    // объект кнопки "Заказать"
    var buttonStartOrder = $('#startOrder');
    //объект блока с ajax анимацией
    var ajaxLoaderQuickOrder = $('.ajaxLoaderQuickOrder');
    var urlQuickForm = '/cart/add'; // адрес страницы с формой
    // данные которые отарвятся на сервер чтобы получить только форму быстрого заказа без нижней части и верхней части сайта
    var quickFormData = [
        {name: 'ajax_q', value: 1},
        {name: 'fast_order', value: 1}
    ];
    // Скрываем кнопку "Заказать"
    buttonStartOrder.hide();
    // Отключаем возможность редактирования формы
    var cartTable = $('.cartTable');
    // открываем общий, глобальный блок
    globalOrder.show();
    $('html, body').delay(400).animate({scrollTop : jQuery('#globalOrder').offset().top - 100}, 800);
    // включаем gif анимацию загрузки
    ajaxLoaderQuickOrder.show('slow');
       $.ajax({
        type: "POST",
        cache: false,
        url: urlQuickForm,
        data: quickFormData,
        success: function(data) {     
            OrderAjaxBlock.html($(data).find('.quickformfast').wrap('<div></div>').html());
            // скрываем блок с анимацией
            ajaxLoaderQuickOrder.hide();
            // раскрываем блок с формаой
            OrderAjaxBlock.show('slow');
            // удалим обработчик события на кнопке отмена
            closeOrder.css('display','block');
            cartTable.toggleClass('disable');
            q = cartTable.find('.cartqty');
            if(q.prop('disabled') == true){q.prop('disabled',false)}else{q.prop('disabled',true)}
            quickOrderScripts();
            OrderScripts();
            ppModal();
            $('.cart-info').on('click', textCloseOrder, function() {
                //Скрываем блок оформления заказа
                ajaxLoaderQuickOrder.hide('fast');
                OrderAjaxBlock.hide('fast');
                globalOrder.hide('fast');
                closeOrder.css('display','none'); // Скрываем кнопку "Отменить"
                buttonStartOrder.css('display','block'); // Возврощаем кнопку "Заказать"
                // Включаем возможность редактирования формы
                cartTable.toggleClass('disable');                
                if(q.prop('disabled') == true){q.prop('disabled',false)}else{q.prop('disabled',true)}
                return false;
            });
        }
    });
  return false;
}

// Валидаторы для Имени и телефона
function validName(){ 
  name = $('#callback_person').val();
  if(name != ''){
    $('.name-error').remove();
    q2 = true;
  }else{
    $('.name-error').remove();
    $('#callback_person').after('<div class="name-error">Вы не указали ваше Имя</div>');
  } 
}
function validPhone(){ 
  tel = $('#callback_phone').val();
  check = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/.test(tel);
  if(check == true && check != ''){
    $('.phone-error').remove();
    q1 = true;
  }
  else{
    $('.phone-error').remove();
    $('#callback_phone').after('<div class="phone-error">Вы ввели неверный номер телефона</div>');
  }
}
//Проверка телефона в обратном звонке.
function validCallBack(){q1 = false;q2 = false;validName();validPhone();return q1 && q2;}

// Скрипты для карточки товара Галерея изображения и Фильтры
function goodspage() {
// Открытие изображения товара при клике
$(document).ready(function() {
  $('.popup-gallery').magnificPopup({
    delegate: 'a',
    type: 'image',
  	tLoading: 'Загружаем изображение #%curr%...',
		mainClass: 'mfp-img-mobile',
		gallery: {
			enabled: true,
			navigateByImgClick: true,
			preload: [0,1] // Will preload 0 - before current, and 1 after the current image
		},
		image: {
			tError: '<a href="%url%">Изображение #%curr%</a> не загружено.',
			titleSrc: function(item) {
				return item.el.attr('title') + '<small>StoreLand.ru</small>';
			}
		}
	});
});

// Другие изображение товара
$(document).ready(function(){
  var $ = jQuery;
  
  if ($('#thumblist').length) {
    $('#thumblist').carouFredSel({
      prev  : '.thumblist-box .prev',
      next  : '.thumblist-box .next',
      width : '100%',
      auto  : false,
      padding: [0, 20],
      swipe : {
      onMouse : false,
      onTouch : true
    }
    }).parents('.thumblist-box').removeClass('load');
  }
});

// Фильтр отзывов
$(document).ready(function(){
  $('.goodsDataOpinionListNavigateTop > a').click(function(){
    a = $(this).html();
    if($(this).hasClass('goodOpinions')){
      $('.good').show();
      $('.bad').hide();
    }
    else if($(this).hasClass('badOpinions')){
      $('.good').hide();
      $('.bad').show();
    }else{
      $('.bad').show();
      $('.good').show();
    }
  })
});

//Regulator Up копки + в карточке товара при добавлении в корзину
$('.quantity-plus').click(function(){
  var 
    quantity = $(this).parent().find('.qty'),
    currentVal = parseInt(quantity.val());
  if (!isNaN(currentVal)){
    quantity.val(currentVal + 1);
    quantity.trigger('keyup');
  }
  return false;
});
//Regulator Down копки - в карточке товара при добавлении в корзину
$('.quantity-minus').click(function(){
  var 
    quantity = $(this).parent().find('.qty'),
    currentVal = parseInt(quantity.val());
  if (!isNaN(currentVal) && !(currentVal <= 1) ){
    quantity.val(currentVal - 1);
    quantity.trigger('keyup');
  }
  return false;
});
// Если вводят 0 то заменяем на 1
$('.qty-wrap .qty').change(function(){
  if($(this).val() < 1){
    $(this).val(1); 
  }
});

// Добавление отзыва о товаре. Рейтинг
if(typeof($('.goodsDataOpinionRating').rating) == "function" ) {
  $('.goodsDataOpinionRating input').rating({
    split: 2,
    required: true
  });
}

// Список отзывов о товаре. Ссылка на отображение формы для добавление отзыва о товаре
$('.goodsDataOpinionShowAddForm').click(function(){
  if(0 == $('#goodsDataOpinionAddBlock:visible').length) {
    $('#goodsDataOpinionAddBlock').show('blind');
    $('html, body').animate({scrollTop : jQuery('.goodsDataOpinionAddForm').offset().top - 90}, 400);
  } else {
    $('#goodsDataOpinionAddBlock').hide('blind');
    $('html, body').animate({scrollTop : jQuery('.goodsDataOpinion').offset().top - 160}, 400);
    return false;
  }
});

// Добавление отзыва о товаре. кнопка reset скрывающая форму добавления отзыва о товаре
$('.goodsDataOpinionFormReset').click(function(){
  $('#goodsDataOpinionAddBlock').hide('blind');
  $('html, body').animate({scrollTop : jQuery('.goodsDataOpinion').offset().top - 160}, 400);
  return false;
});

// Иконка для обновления изображение капчи
$('.goodsDataOpinionCaptchaRefresh').click(function(){
  RefreshImageAction(this,1,1);
  $('.goodsDataOpinionCaptchaImg').attr('src',$('.goodsDataOpinionCaptchaImg').attr('src')+'&rand'+Math.random(0,10000));
  return false;
});

}

// Инициализация табов на странице товара
function initTabs() {
  // Блок в котором находятся табы
  var tabBlock = $('.tab_products');
  if(!tabBlock.length) {
    return false;
  }
  // По умолчанию делаем отметку о том что активного таба не найдено
  var isFind = 0;
  tabBlock.find('.tabs a').each(function(i){
    // Если нашёлся активный там
    if($(this).hasClass('active')) {
      // Инициализируем найденный таб
      $(this).click();
      // Ставим отметку, о том что не нужно инициализировать первый таб на странице
      isFind = 1;
    }
  });
  // Если не найдено ни одного таба с отметкой о том что он активен
  if(!isFind) {
    // Ставим активным первый таб на странице.
    var tab = $('ul.tabs > li > a').attr('id').slice(-1);
    tabSwitch(tab);
  }
  // Проверяет хэш и если по нему была открыта вкладка, то эта функция автоматически откроет её.
  checkTabHash();
  
  // Если текущий адрес страницы предполагает добавление отзыва
  if('#goodsDataOpinionAdd' == document.location.hash) {
    $('#goodsDataOpinionAddBlock').show();
    $('html, body').animate({scrollTop : jQuery('.goodsDataOpinion').offset().top - 160}, 400);
  }

  // Биндим изменение хэша - проверка какой таб нужно открыть.
  $(window).bind('hashchange', function() { checkTabHash(); });
}

// Проверяет хэш, переданый пользователем и открывает соответствующий раздел
function checkTabHash() {

  // Определяем текущий хэш страницы
  var hash = window.location.hash.substr(1);


  if(hash == 'goodsDataOpinionAdd') {
    hash = 'show_tab_4';
  }

  if(!hash.length || hash.indexOf('show_tab_') == -1) {
    return false;
  }

  // Открываем тот таб, который был указан в hash-е
  tabSwitch(hash.replace("show_tab_", ''))
}

// Выбор вкладки на странице товара
function tabSwitch(nb) {
  var tabBlock = $('.tab_products');
  tabBlock.find('.tabs a').removeClass('active');
  tabBlock.find('div.tab-content').hide();
  $('#tab_' + nb).addClass('active');
  $('#content_' + nb).show();
  if('#goodsDataOpinionAdd' != document.location.hash) {
    // Записываем в хэш информацию о том какой таб сейчас открыт, для возможности скопировать и передать ссылку с открытым нужным табом
    document.location.hash = "#show_tab_" + nb;  
  }
}

// Инициализируем табы на странице
$(function() { initTabs(); });

// Выносим функции из шаблонов
function outFunctions() {
$(document).ready(function(){
  
  // Вызов функции быстрого заказа в корзине
  $('#startOrder').on('click', function() {
    startOrder();
    return false;
  });
  
  // Вызов функции редиректа при обратном звонке
  $('.callbackForm').submit(validCallBack);
  
  // Возврашаем пользователя на страницу с которой был сделан обратный звонок
  $('.callbackredirect').val(document.location.href);
  
  // Поиск
  $('#search_mini_form').submit(function() {
    return ($(this).find('.search-string').val() ? true : false);
  });
  
  // Добавление отзыва
  $('.goodsDataOpinionAddTable').on('click', '.button[type="button"]', function() {
    $(this).closest('form').trigger('submit');
  });
  
  // Добавление товара в корзину
  $('#wrapper').on('click', '.add-cart', function() {
    var form = $(this).closest('form');
    if ($(this).hasClass('quick')) {
      form.attr('rel', 'quick');
    } else {
      var rel = form.attr('rel');
      if (rel) {
        form.attr('rel', rel.replace('quick', ''));
      }
    }
    form.trigger('submit');
    return (false);
  })
  
  // Подпись формы по классу .form-submit
  .on('click', '.form-submit', function() {
    var form = $(this).closest('form');
    if ($(this).hasClass('denybot')) {
      form.append('<input type="hidden" name="next_step" value="1" />');
    }
    form.submit();
    return (false);
  })
  .on('click', '.redirect[rel]', function() {
    window.location = $(this).attr('rel');
    return (false);
  });
  
  // Удаление товара из корзины
  $('.dropdown-cart').on('click', '.product-remove', function() {
    removeFromCart($(this));
  });
  // Удаление всех товаров из корзины
  $('.dropdown-cart').on('click', '.remove-products', function() {
    removeFromCartAll($(this));
  });
  // Удаление товара из сравнения
  $('#compare-items').on('click', '.remove-compare', function() {
    removeFromCompare($(this));
  });
  
  // Сортировка каталога
  $('.change-submit').on('change', 'select', function() {
    $(this).closest('form').submit();
    return (false);
  });
  
  // Фильтры по характеристикам товаров и свойствам товарных модификаций
  $('.filter').on('change', '.form-control', function() {
    $(this).attr('name', $(this).find('option:selected').attr('value') == -1 ? 
      '' : $(this).find('option:selected').attr('rel'));
    $(this).closest('form').submit();
    return (false);
  });
  
  // Счетчик оставшихся секунд до перенаправления
  if($('#time').length) {
    setInterval(function() {
      var timer = $('#time');
      var counter = parseInt(timer.attr('rel'));
      if (!counter) {
        window.location = timer.closest('.location[rel]').attr('rel');
        return (false);
      }
      counter--;
      timer.text(counter).attr('rel', counter);
    }, 1000);
  }
});
}

// Удаление товара из сравнения без обновлении страницы
function removeFromCompare(e){
  if(confirm('Вы точно хотите удалить товар из сравнения?')){
  var del = e;
  var num = $('.compare-num').text();
  e.parent().fadeOut().remove();
  url = del.data('href');
  goodsModId = $(del).attr('data-goods-mod-id');
  $.ajax({ 
    cache    : false,
  	url		  : url,
    success: function(d){
  	  var oldCount = $('.compare-num').text();
      var newCount = oldCount - 1;
      $('.compare-num').text(newCount);
      
      var flag = 0;
      if(newCount != 0){
        $('#compare-items li.item').each(function(){
          if(flag == 0){
          if($(this).css('display') == 'none'){
        $(this).show();
          flag++;
          }
        }})}else{
          $('.block.block-compare').removeClass('have-items');
        }
      
      var obj = $('.add-compare[data-mod-id="' + goodsModId + '"]');
      if(obj.length) {
        obj.attr("data-action-is-add", "1")
          .removeAttr("title")
          .removeClass("added")
          .attr("href", obj.attr("href").replace(obj.attr('data-action-delete-url'), obj.attr('data-action-add-url')));
      }
		}
  })
  }
}

// Удаление товара из корзины без обновлении страницы
function removeFromCart(e){
  if(confirm('Вы точно хотите удалить товар из корзины?')){
  var del = e;  
  e.parent().fadeOut().remove();
  url = del.data('href');
  quantity = del.data('count');
  $('.total-sum').animate({opacity: 0},500);
  $.ajax({ 
    cache   : false,
		url		  : url,
    success: function(d){
      var oldCount = $('.cart-count').text();
      var oldQuantity = quantity;
      var newCount = oldCount - oldQuantity;
      $('.cart-count').text(newCount);
      $('.total-sum').animate({opacity: 1},500);
      $('.total-sum').html($(d).find('.total-sum').html());
        var flag = 0; 
        if(newCount != 0){
        $('#cart-sidebar li.cart-item').each(function(){
          if(flag == 0){
            if($(this).css('display') == 'none'){
              $(this).show();
            flag++;
            }
          }
        })}else{
          $('.mycart').removeClass('have-items');
        }
      }
    })
  }
}

// Удаление ВСЕХ товаров из корзины без обновлении страницы
function removeFromCartAll(e){
  if(confirm('Вы точно хотите очистить корзину?')){
  var del = e;  
  e.parent().fadeOut().remove();
  url = del.data('href');
  $.ajax({ 
    cache   : false,
  	url		  : url,
    success: function(d){
      $('.mycart').removeClass('have-items');
      $('.cart-count').text('0');
		}
  })
  }
}

// Корзина
function ajaxnewqty(){
  $('.cartqty').change(function(){
    $(this).attr('readonly','readonly');
    if($(this).val() < 1){
      $(this).val(1); 
    }
    s = $(this);
    id = $(this).closest('tr').data('id');
    qty = $(this).val();
    data = $('.cartForm').serializeArray();
    data.push({name: 'only_body', value: 1});
    $('tr[data-id="' + id + '"] .ajaxtotal').css('opacity','0');
    $('.TotalSum').css('opacity','0');
    $.ajax({
      data: data,
      cache:false,
      success:function(d){        
        s.val($(d).find('tr[data-id="' + id + '"] .cartqty').val())
        $('tr[data-id="' + id + '"] .ajaxtotal').css('opacity','1');
        $('.TotalSum').css('opacity','1');
        tr = $('tr[data-id="' + id + '"]');
        tr.find('.ajaxtotal').html($(d).find('tr[data-id="' + id + '"] .ajaxtotal').html()); 
        $('.TotalSum').html($(d).find('.TotalSum').html());
          $('.discounttr').each(function(){
            $(this).remove();
          })
          $(d).find('.discounttr').each(function(){
            $('.cartTable tbody tr:last-child').after($(this));
          })
        c = $(d).find('tr[data-id="' + id + '"] .qty');
        qw = c.val();
        $('.cartqty').removeAttr('readonly');
        if(qty > qw){
          $('.cartErr').remove();
          $('.cartTable').before('<div class="cartErr warning">Вы пытаетесь положить в корзину товара больше, чем есть в наличии</div>');
          $('.cartErr').fadeIn(500).delay(2500).fadeOut(500, function(){$('.cartErr').remove();});
          $('.cartqty').removeAttr('readonly');
        }
      }
    })
  })
}

// Удаление товара из корзины
function ajaxdelete(s){
  var yep = confirm('Вы точно хотите удалить товар из корзины?');
  if(yep == true){
    var closeimg = s;
    s.closest('tr').fadeOut();
    url = closeimg.data('href');
    $.ajax({
      url:url,
      cache:false,
      success:function(d){
        $('.cart-info').html($(d).find('.cart-info').html());
        ajaxnewqty();
        $('#startOrder').on('click', function() {
          startOrder();
          return false;
        });
       }      
    })}else{
        return false;
  }      
}

// Инициализация функции удаления товаров из корзины
$(function() { ajaxnewqty(); });
$(document).ready(ajaxnewqty);

// Загрузка основных функций шаблона
jQuery(document).ready(function($){
  MainFunctions();
  outFunctions();
  ajaxnewqty();
  ppModal();
});

// Функция вывода каталога left right
(function($){
  $.fn.liMenuRespHard = function(params){
		this.each(function(){
			menuWrap = $(this);
			var menuWrapWidth = menuWrap.outerWidth();
			var menuWrapLeft = menuWrap.offset().left;
			var menuSub = menuWrap.children('li').children('ul');
			var menuSubSub = $('ul',menuSub);
			menuSub.each(function(){
				var mSub = $(this);
			});
			menuSubSub.each(function(){
				var mSubSub = $(this);
				var mSubList = mSubSub.closest('li');
				var mSubLink = mSubList.children('a').append();
				mSubLink.on('mouseenter',function(){
					var mSubSubLeft = mSubLink.position().left + mSubLink.outerWidth();
					mSubSub.css({top:(mSubLink.position().top - (mSubLink.closest('ul').outerWidth()-mSubLink.closest('ul').width())/2)});	
					mSubSub.css({left:mSubSubLeft});
					mSubSub.show();
					var w3 = (menuWrapLeft + menuWrapWidth);
					var w6 = (mSubSub.offset().left + mSubSub.outerWidth());
					if(w6 >= w3){
						mSubSub.closest('ul').addClass('toLeft');
						mSubSubLeft = -mSubSub.outerWidth();
					}
					if(mSubSub.parents('ul').hasClass('toLeft')){
						mSubSubLeft = -mSubSub.outerWidth();
					}
					mSubSub.css({left:mSubSubLeft});				
					mSubLink.addClass('active');
				})
				mSubList.on('mouseleave',function(){
					mSubSub.hide();
					mSubLink.removeClass('active');
				});
			});
			menuWrapWidth = menuWrap.outerWidth();
			menuWrapLeft = menuWrap.offset().left;
			$(window).resize(function(){
				menuWrapWidth = menuWrap.outerWidth();
				menuWrapLeft = menuWrap.offset().left;	
			});
		});
	};
})(jQuery);
// активируем каталог меню
jQuery(document).ready(function ($) {
  $('.mainnav').liMenuRespHard({
    type:'button' //'button', 'select'	
  });
});

// Адаптивное меню
jQuery(document).ready(function ($) {
	$('#mommenu .btn-navbar').on('click', function () {
		if ($('#menu_offcanvas').hasClass('active')) {
			$(this).find('.overlay').fadeOut(250);
			$('#menu_offcanvas').removeClass('active');
			$('body').removeClass('show-sidebar');
		} else {
			$('#menu_offcanvas').addClass('active');
			$(this).find('.overlay').fadeIn(250);
			$('body').addClass('show-sidebar');
		}
	});
  $('#mommenu .canvas-title').on('click', function () {
    $('#mommenu').find('.overlay').fadeOut(250);
    $('#menu_offcanvas').removeClass('active');
    $('body').removeClass('show-sidebar');
  });
  $('#mommenu .parent a .open-menu').click(function(event){
  event.preventDefault();
    if ($(this).closest('.parent').hasClass('active')) {
      $(this).parent().next('.sub').slideUp(600);
      $(this).closest('.parent').removeClass('active');
      $(this).closest('.open-menu').removeClass('active');
    } else {
      $(this).parent().next('.sub').slideDown(600);
      $(this).closest('.parent').addClass('active');
      $(this).closest('.open-menu').addClass('active');
    }
  });
});

// Menu > Sidebar Боковое меню > сохранение открытой вложенности
jQuery(document).ready(function($){
  $('.block.menu .parent a .open-sub').click(function(event){
  event.preventDefault();
    if ($(this).closest('.parent').hasClass('active')) {
      $(this).parent().next('.sub').slideUp(600);
      $(this).closest('.parent').removeClass('active');
      $(this).closest('.open-sub').removeClass('active');
    } else {
      $(this).parent().next('.sub').slideDown(600);
      $(this).closest('.parent').addClass('active');
      $(this).closest('.open-sub').addClass('active');
    }
  });
});

// Товары на главной
jQuery(document).ready(function($){
  (function(element){
    	$element = $(element);
			itemNav = $('.item-nav',$element);
			itemContent = $('.pdt-content',$element);
			ajax_url= "/";
			label_allready = 'Все готово';
      
			itemNav.click(function(){
				var $this = $(this);
				if($this.hasClass('tab-nav-actived')) return false;
				itemNav.removeClass('tab-nav-actived');
				$this.addClass('tab-nav-actived');
				var itemActive = '.'+$this.attr('data-href');
				itemContent.removeClass('tab-content-actived');
				$(".pdt-list").removeClass("play");$(".pdt-list .item").removeAttr('style');
				$('.item',$(itemActive, $element)).addClass('item-animate').removeClass('animated');
				$(itemActive, $element).addClass('tab-content-actived');
        
				contentLoading = $('.content-loading',$(itemActive, $element));
				isLoaded = $(itemActive, $element).hasClass('is-loaded');
				if(!isLoaded && !$(itemActive, $element).hasClass('is-loading')){
					$(itemActive, $element).addClass('is-loading');
					contentLoading.show();
					orderby = $this.attr('data-orderby');
					$.ajax({
						type: 'POST',
						url: ajax_url,
						data:{
							numberstart: 0,
							orderby: orderby
						},
						success: function(result){
							if(result.listProducts !=''){
								$('.pdt-list',$(itemActive, $element)).html(result.listProducts);
								$(itemActive, $element).addClass('is-loaded').removeClass('is-loading');
								contentLoading.remove();
							}
						},
						dataType:'json'
					});
				}else{
					$('.item', itemContent ).removeAttr('style');
				}
			});
	})('#producttabs');
});

//Функция показать больше для Товаров на главной
$(function(){
  var i = 0;
  $('.pdt_best_sales .item').each(function(){
    i++;
  })
  if(i<=8){$('.pdt_best_sales .button-load').hide()}
    $('.pdt_best_sales .loadGoods').on('click',function(){
  if($(this).hasClass('loaded')){
    $(this).removeClass('loaded');
    $('.pdt_best_sales .item').removeClass('showThis');
    $(this).attr('title', 'Показать все');
  }else{ 
    $('.pdt_best_sales .item').addClass('showThis');
    $(this).addClass('loaded');
    $(this).attr('title', 'Скрыть');
  }
})
});
//Функция показать больше для Новинок
$(function(){
  var i = 0;
  $('.pdt_created_at .item').each(function(){
    i++;
  })
  if(i<=8){$('.pdt_created_at .button-load').hide()}
    $('.pdt_created_at .loadGoods').on('click',function(){
  if($(this).hasClass('loaded')){
    $(this).removeClass('loaded');
    $('.pdt_created_at .item').removeClass('showThis');
    $(this).attr('title', 'Показать все');
  }else{ 
    $('.pdt_created_at .item').addClass('showThis'); 
    $(this).addClass('loaded');
    $(this).attr('title', 'Скрыть');
  }
})
});
//Функция показать больше для Хитов продаж
$(function(){
  var i = 0;
  $('.pdt_top_rating .item').each(function(){
    i++;
  })
  if(i<=8){$('.pdt_top_rating .button-load').hide()}
    $('.pdt_top_rating .loadGoods').on('click',function(){
  if($(this).hasClass('loaded')){
    $(this).removeClass('loaded');
    $('.pdt_top_rating .item').removeClass('showThis');
    $(this).attr('title', 'Показать все');
  }else{ 
    $('.pdt_top_rating .item').addClass('showThis'); 
    $(this).addClass('loaded');
    $(this).attr('title', 'Скрыть');
  }
})
});

//Функция показать больше для недавно просмотренных товаров
$(function(){
  var i = 0;
  $('.recently-item').each(function(){
    i++;
  })
  if(i<=3){$('.showAllRecent').hide()}
    $('.showAllRecent').on('click',function(){
  if($(this).hasClass('active')){
    $(this).removeClass('active');
    $('.recently-item').removeClass('showThis');   
    $(this).text('Показать все');
    $(this).attr('title', 'Показать все');
  }else{ 
    $('.recently-item').addClass('showThis'); 
    $(this).addClass('active');
    $(this).text('Скрыть');
    $(this).attr('title', 'Скрыть');
  }
})
});

// Сопутствующие товары
jQuery(function($) {
  var carouselU = $('.related-goods .product-grid');
    carouselU.owlCarousel({
      items: 4,
      pagination: false,
      itemsScaleUp : true,
      slideSpeed : 800,
      autoPlay: true,
      addClassActive: true,
      autoHeight: true,
      afterAction: function (e) {
        if(this.$owlItems.length > this.options.items){
          $('.related-goods .navigation').show();
        }else{
          $('.related-goods .navigation').hide();
        }
      }
    });
  jQuery('.related-goods .navigation .prev').on('click', function(e){
    e.preventDefault();
    carouselU.trigger('owl.prev');
  });
  jQuery('.related-goods .navigation .next').on('click', function(e){
    e.preventDefault();
    carouselU.trigger('owl.next');
  });
});

// С этим товаром смотрят
jQuery(function($) {
  var carouselU = $('.related-views .product-grid');
    carouselU.owlCarousel({
      items: 4,
      pagination: false,
      itemsScaleUp : true,
      slideSpeed : 800,
      autoPlay: true,
      addClassActive: true,
      autoHeight: true,
      afterAction: function (e) {
        if(this.$owlItems.length > this.options.items){
          $('.related-views .navigation').show();
        }else{
          $('.related-views .navigation').hide();
        }
      }
    });
  jQuery('.related-views .navigation .prev').on('click', function(e){
    e.preventDefault();
    carouselU.trigger('owl.prev');
  });
  jQuery('.related-views .navigation .next').on('click', function(e){
    e.preventDefault();
    carouselU.trigger('owl.next');
  });
});

// Каталог на главной
jQuery(function($) {
  var carouselU = $('.categories.index');
    carouselU.owlCarousel({
      items: 4,
      pagination: true,
      itemsScaleUp : true,
      slideSpeed : 800,
      autoPlay: true,
      addClassActive: true,
      autoHeight: true,
    });
});

// Наверх
$(document).ready(function(){
  // hide #back-top first
  $("#back-top").hide();
	// fade in #back-top
	$(function () {
		$(window).scroll(function () {
			if ($(this).scrollTop() > 100) {
				$('#back-top').fadeIn();
			} else {
				$('#back-top').fadeOut();
			}
		});
		// scroll body to 0px on click
		$('#back-top').click(function () {
			$('body,html').animate({
				scrollTop: 0
			}, 800);
			return false;
		});
	});
});

// Политика конфиденциальности в модальном окне
function ppModal() {
  $(".pp a").click(function(event){
    event.preventDefault();
    var data = $("#fancybox-pp").html();
    $.fancybox({
      autoSize: true,
      maxWidth: 700,
      padding: 30,
      content: data
    });
  });
}


    