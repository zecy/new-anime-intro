/**
 * Created by zecy on 14-3-29.
 */

/* ----------------------------------------
 *
 *        THE METHOD FUNCTIONS
 *
 * ----------------------------------------*/


function arrCompact(arr, style) {

    /*
    *
    *  compact the items
    *
    *  style = 1: positon1/positon2... : member
    *
    *  or
    *
    *  style = 2: position: member1、member2...
    *
    *  or
    *
    *  style = 3: both of these.
    *
    * */


    var style = arguments[1] ? arguments[1] : 3;

    for ( var i = 1; i < arr.length; i++ ) {

//        if (arr[i + 1][1] === arr[i][1]) {
//
//            /*多职位同人*/
//            arr[i][0] = arr[i].shift() + "/" + arr[i + 1][0];
//            arr[i][1] = arr[i + 1][1];
//
//            /*删除下一项*/
//            arr.splice(i + 1, 1);
//
//            /*倒退回前一项继续比较*/
//            i = i - 1;
//
//            continue;
//
//        }

//        if (arr[i][0] === arr[i + 1][0]) {
//
//            /*多人同职位*/
//            arr[i][0] = arr[i + 1][0];
//            arr[i][1] = arr[i][1] + "、" + arr[i + 1][1];
//            arr.splice(i + 1, 1);
//            /*删除下一项*/
//
//            /*倒退回前一项继续比较*/
//            i = i - 1;
//
//            continue;
//
//        }

        if ( ( style == 1 || style == 3 ) && arr[i][1] === arr[i - 1][1] ) {


            /*多职位同人*/
            arr[i - 1][0] = arr[i - 1].shift() + "/" + arr[i][0];
            arr[i - 1][1] = arr[i][1];
            arr.splice(i, 1);

        }

        if ( ( style == 2 || style == 3 ) && arr[i][0] === arr[i - 1][0] ) {

            /*多人同职位*/
            arr[i - 1][0] = arr[i][0];
            arr[i - 1][1] = arr[i - 1][1] + "、" + arr[i][1];
            arr.splice(i, 1);

        }

    }

    return arr;

}

function buildWaitToCountList(dataItem, index) {
    /*
     *  The dataitem struture:
     *  [
     *      ['原作', 'くずしろ', '1'],  waitToCountData[i] = obj
     *      ['监督', '永居慎平', '1'],
     *      ['脚本', '永居慎平', '1'],
     *      ['演出', '永居慎平', '1'],
     *      ['人物设定', 'みうらたけひろ', '1'],
     *      ['作画监督', 'みうらたけひろ', '1'],
     *  ]
     *
     *  The List Struture:
     *
     *  staList = [
     *
     *      { member  : [ position, animeDataBase下标] },   waitToCountItem
     *      { obj[1]  : [ obj[0], i ] => objList }
     *      { 新房昭之 : [ 总监督, 14] },
     *      { Shaft   : [ 动画制作, 14] },
     *      { 高村和宏 : [ 监督, 4] },
     *      { GONZO   : [ 动画制作, 50] },
     *      { GONZO   : [ 动画制作, 3] },
     *      { 新房昭之 : [ 总监督, 2] },
     *
     *  ]
     *
     * */

    var waitToCountData = arrCompact(dataItem, 1);

    var waitToCountList = [];

    for ( var i = 0; i < waitToCountData.length; i++ ) {
            var obj = waitToCountData[i];
            var objList = [];
            var waitToCountItem = {};
            objList[0] = obj[0];
            objList[1] = index;
            waitToCountItem[obj[1]] = objList;
            waitToCountList.push(waitToCountItem);

    }

    return waitToCountList;
}

function buildCountedList(arr) {
    var result = [], hash = {};
    for ( var i = 0; i < arr.length ; i++ ) {
        var elem = Object.keys(arr[i]);
        if ( !hash[elem] ) {
            result.push(elem);
            hash[elem] = 1;
        } else if ( hash[elem] ) {
            hash[elem] += 1;
        }
    }
//    console.log(hash);
//    return result;
    return hash;

}

function meaningfulData(obj, number) {
    var meaningList = [];

    // set the default value, just show a member take part in more than one anime
    var number = arguments[1] ? arguments[1] : 2;

    for ( var i in obj ) {
//        console.log(obj[i]);
        if( obj[i] >= number) {
            var item = {};
            item['name'] = i;
            item['number'] = obj[i];
            meaningList.push(item);
        }
    }
//    console.log(meaningList);
    meaningList.sort(function(a, b) {
        return b.number - a.number
    });

//    console.log(meaningList);
    return meaningList;
}

function filtAnimeIndex(str, waittocountlist) {
    /*
    *  Search the Anime with 'str'
    *  and returen a list with the index numbers
    *  so you can get the Anime datas from the database using the this index numbers list
    *
    *  the data is from waittocountlist
    *
    *  waittocountlist struture
    *  {member : [position, animeDatabseIndex]}
    *  {新房昭之: [总监督,  14]}
    *
    *  the function return the index of animedatabse
    *
    * */

    var indexList = [];
    for ( var i = 0; i < waittocountlist.length; i++ ) {
        var item = waittocountlist[i];
        var itemStr = Object.keys(waittocountlist[i]);
        if( itemStr == str ) {
            var index = item[str][1];
            indexList.push(index);
        }
    }

    return indexList;
}

/*------------------------------------------------------------
*
*  THE FILTERS
*
* ------------------------------------------------------------*/

var animeIntro = angular.module('AnimeIntro', []);

// Hide Item
animeIntro.filter('hideItem', function(){
    var hideItemFilter = function(input) {
        var output = [];
        for ( var i = 0; i < input.length; i++ ) {
            var item = input[i];
            if(item[2] == 1) {
                output.push(item)
            }
        }
        return output;
    }
    return hideItemFilter;
})

/*------------------------------------------------------------
*
*                   MAIN FUNCTION
*
* ------------------------------------------------------------*/

/* STATICS THE PROPERTIES */

function waitToCountProperties(data) {
    /*
     *
     * return the wait to count proterty lists,
     *
     * include original type, staffs, casts, onair etc.
     *
     * */

     var dataBase = angular.copy(data);

    var waitToCountOriginType   = [];
    var waitToCountGenre        = [];
    var waitToCountStaff        = [];
    var waitToCountCast         = [];

    /* BUILD THE WAIT TO COUNT LIST */
    for ( var i = 0; i < dataBase.length; i++ ) {

        var anAnime = dataBase[i];

        var genre = [];
        genre     = anAnime.info.genre[0].split(",");

        var origintype = {};
        origintype[anAnime.info.origintype[0]] = ['origintype', i];

        waitToCountOriginType.push(origintype);
        waitToCountGenre = waitToCountGenre.concat(buildWaitToCountList(genre, i));
        waitToCountStaff = waitToCountStaff.concat(buildWaitToCountList(anAnime.staff, i));
        waitToCountCast  = waitToCountCast.concat(buildWaitToCountList(anAnime.cast, i));
    }

    /* BUILD THE COUNTED LIST */

    var waitToCountList = {
        'origintype' : waitToCountOriginType,
        'genre'      : waitToCountGenre,
        'staff'      : waitToCountStaff,
        'cast'       : waitToCountCast
    }

    return waitToCountList

}

function countedProperties(data) {
    /*
    *
    * return the counted proterty lists,
    *
    * include original type, staffs, casts, onair etc.
    *
    * */

    /* BUILD THE COUNTED LIST */
    var countedOriginType = buildCountedList(data.origintype);
    var countedGenre      = buildCountedList(data.genre);
    var countedStaff      = buildCountedList(data.staff);
    var countedCast       = buildCountedList(data.cast);

    var countedList = {
        'origintype': countedOriginType,
        'genre'     : countedGenre,
        'staff'     : countedStaff,
        'cast'      : countedCast
    };

    return countedList
}


/* SHOW ANIMES */
var dataBase = angular.copy(animeDataBase);

for ( var i = 0; i < dataBase.length; i++ ) {
    var obj = dataBase[i];
    obj.staff = arrCompact(obj.staff,3);
    obj.cast = arrCompact(obj.cast,3);
}

function animeBox($scope) {

    $scope.animeDataBase = dataBase;

    var waitToCountItems = waitToCountProperties(animeDataBase);

    var countedItems = countedProperties(waitToCountItems);

    $scope.countedStaff = meaningfulData(countedItems.staff);

    var searchedList = [];
    searchedList = searchedList.concat(waitToCountItems.origintype);
    searchedList = searchedList.concat(waitToCountItems.genre);
    searchedList = searchedList.concat(waitToCountItems.staff);
    searchedList = searchedList.concat(waitToCountItems.cast);

    $scope.searchProperty = function (str) {

        /*
         *
         * Search the Members like this :
         *
         * buttons : [ MAD HOUSE ( 2 ) ]  [ BONES ( 4 ) ]  [ 新房昭之 ( 3 ) ]
         *
         * click one of the buttons , and then the Anime with that member will be selected.
         *
         * */

        var indexList = filtAnimeIndex(str, searchedList);

        var newDataBase = [];

        for ( var i = 0; i < indexList.length; i++ ) {
            var index = indexList[i];
            newDataBase.push(dataBase[index]);
        }

        $scope.animeDataBase = newDataBase
    };

    $scope.changeCount = function(item, num) {
        switch (item) {
            case 'staff':
                $scope.countedStaff = meaningfulData(countedItems.staff, num);
                break;

            case 'cast':
                $scope.countedCast = meaningfulData(countedItems.cast, num);
                break;
        }
    }

    $scope.unFilt = function() {

        /*
        *
        * The GoBack function for the searchProperty(). Once click this , the member list will come back.
        *
        * */

        var sN = $scope.pageStart;
        var eN = $scope.pageEnd;

        var dataList = buildDataList(animeDataBase, 0, sN, eN);
        showAnime(dataList);
    };

}
