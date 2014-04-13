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

    var arrLength = arr.length;

    for ( var i = 0; i < arrLength; i++ ) {

        for ( var j = i + 1; j < arrLength; j++ ) {

            if ( ( style == 1 || style == 3 ) && arr[i][1] === arr[j][1] ) {

                /*多职位同人
                arr[i - 1][0] = arr[i - 1].shift() + "/" + arr[i][0];
                arr[i - 1][1] = arr[i][1];
                arr[i - 1][2] = arr[i][2]
                arr.splice(i, 1);
                */
                arr[i][0] = arr[i][0] + "/" + arr[j][0];
                arr.splice(j,1);
                j -= 1;
                arrLength -= 1;
                continue

            }

            if ( ( style == 2 || style == 3 ) && arr[i][0] === arr[j][0] ) {

                /*多人同职位
                arr[i - 1][0] = arr[i][0];
                arr[i - 1][1] = arr[i - 1][1] + "、" + arr[i][1];
                arr.splice(i, 1);
                 */

                arr[i][1] = arr[i][1] + "、" + arr[j][1];
                arr.splice(j,1);

                arrLength -= 1;
                j -= 1;
            }
        }

    }

    return arr;

}

function formatDataBase(data) {

    var database = angular.copy(data);

    var databaseLength = database.length;

    for ( var j = 0; j < databaseLength; j++ ) {
        var obj = database[j];
        obj.staff = arrCompact(obj.staff,3);
        obj.cast = arrCompact(obj.cast,3);
    }

    return database
}

function buildAnimeList(data, indexlist, conswitch) {
    /*
    *
    * Import a database
    *
    * for the MAIN ANIME SHOWN
    *
    * can build the anime list by a indexlist,
    *
    * or between the start number and end number
    *
    * when the conswitch is on( 1 by default ), and the indexlist just have 2 elements
    *
    * [24, 37]
    *
    * then the animes between 24 and 37 would output
    *
    * when the switch is off( -1 ), just 24 and 37 will output
    *
    * NOTE: the indexlist have a default value = [0, data.length]
    *
    * */

    var outputDataBase = [];

    var index = arguments[1] ? arguments[1] : [0, data.length];

    var indexLength = index.length;

    var cs = arguments[2] ? arguments[2] : 1;

    var sn = index[0];
    var en = index[indexLength - 1];

    if( cs == 1 ) {

        for ( var i = sn; i < en; i++ ) {
            var anime = data[i];
            outputDataBase.push(anime)
        }

    } else if ( cs == -1 ) {

        for ( var i = 0; i < indexLength; i++ ) {
            var anime = data[index[i]];
            outputDataBase.push(anime)
        }

    } else {
        console.log("ERROR: Have an error in conswitch from buildAnimeList.")
    }

    return outputDataBase
}

function buildWaitToCountList(dataItem, indexlist) {
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
     *  waittocountlist = [
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

    var dataItem = angular.copy(dataItem);

    var index = arguments[1] ? arguments[1] : [0, dataItem.length];
    var sn = index[0];
    var en = index[index.length-1];

    var onairList       = [];
    var genreList       = [];
    var origintypeList  = [];
    var sequelList      = [];
    var staffList       = [];
    var castList        = [];

    function staffAndCastConvert(arr, index) {

        var waitToCountList = [];

        var arrLength = arr.length;

        for ( var i = 0; i < arrLength;  i++ ) {
            var obj = arr[i];
            var objList = [];
            var waitToCountItem = {};
            objList[0] = obj[0];
            objList[1] = index;
            waitToCountItem[obj[1]] = objList;
            waitToCountList.push(waitToCountItem);
        }
        return waitToCountList
    }

    function covert(arr, name, index) {

        var waitToCountList = [];

        var arrLength = arr.length

        for ( var i = 0; i < arrLength; i++ ) {
            var obj = arr[i];
//            console.log(arr);
            var objList = [];
            var waitToCountItem = {};
            objList[0] = name;
            objList[1] = index;
            waitToCountItem[obj] = objList;
            waitToCountList.push(waitToCountItem);
        }
        return waitToCountList
    }

    for ( var i = sn; i < en; i++ ) {
        var anime = dataItem[i];

        var onair          = anime.info.onair[0].split(" ");
        var genre          = anime.info.genre[0].split(",");
        var origintype     = [];
        origintype[0]      = anime.info.origintype[0];
        var sequel         = [];
        sequel[0]          = anime.info.sequel[0];
        var staff          = arrCompact(anime.staff,1);
        var cast           = arrCompact(anime.cast,1);

        onair       = covert(onair, 'onair', i);
        genre       = covert(genre, 'genre', i);
        origintype  = covert(origintype, 'origintype', i);
        sequel      = covert(sequel, 'sequel', i)
        staff       = staffAndCastConvert(staff, i);
        cast        = staffAndCastConvert(cast, i);

        onairList       = onairList.concat(onair);
        genreList       = genreList.concat(genre);
        origintypeList  = origintypeList.concat(origintype);
        sequelList      = sequelList.concat(sequel);
        staffList       = staffList.concat(staff);
        castList        = castList.concat(cast);

    }

    return {
        onair      : onairList,
        genre      : genreList,
        origintype : origintypeList,
        sequel     : sequelList,
        staff      : staffList,
        cast       : castList
    };
}

function buildCountedList(arr) {
    var result = [], hash = {};

    var arrLength = arr.length;

    for ( var i = 0; i < arrLength; i++ ) {
        var elem = Object.keys(arr[i]);
        var value = arr[i][elem];
        if ( !hash[elem] ) {
            result.push(elem);
            hash[elem] = {'counted': 1, 'list': [value[1]]};
        } else if ( hash[elem] ) {
            hash[elem].counted += 1;
            hash[elem].list.push(value[1]);
        }
    }
//    console.log(hash);
    return hash;
}

function meaningfulData(obj, number) {
    var meaningList = [];

    // set the default value, just show a member take part in more than one anime
    var number = arguments[1] ? arguments[1] : 2;

    for ( var i in obj ) {
//        console.log(obj[i]);
        if( obj[i].counted >= number) {
            var item = {};
            item['name'] = i;
            item['number'] = obj[i].counted;
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

/*------------------------------------------------------------
*
*  THE FILTERS
*
* ------------------------------------------------------------*/

var animeIntro = angular.module('AnimeIntro', []);

// Hide Item
animeIntro.filter('hideItem', function () {
    return function (input) {

        var output = [];
        var inputLength = input.length;

        for ( var i = 0; i < inputLength; i++ ) {
            var item = input[i];
            if ( item[2] == 1 ) {
                output.push(item)
            }
        }
        return output;
    };
});

//sort the weekdays
animeIntro.filter('weekDays', function () {
    return function (input) {
        var output = [];
        var inputLength = input.length;
        for ( var i = 0; i < inputLength; i++ ) {
            var item = input[i];
            switch (item.name) {
                case '星期一':
                    output[0] = item;
                    break;
                case '星期二':
                    output[1] = item;
                    break;
                case '星期三':
                    output[2] = item;
                    break;
                case '星期四':
                    output[3] = item;
                    break;
                case '星期五':
                    output[4] = item;
                    break;
                case '星期六':
                    output[5] = item;
                    break;
                case '星期日':
                    output[6] = item;
                    break;
            }
        }
        return output;
    };
});

/*------------------------------------------------------------
*
*                   MAIN FUNCTION
*
* ------------------------------------------------------------*/

/*
*
*  SHOW ANIME
*
* */

// format the staff and cast list

var shownAnimeData = formatDataBase(animeDataBase);

var waitToCountList = buildWaitToCountList(animeDataBase);

var countedOnair      = buildCountedList(waitToCountList.onair);
var countedGenre      = buildCountedList(waitToCountList.genre);
var countedOrigintype = buildCountedList(waitToCountList.origintype);
var countedSequel     = buildCountedList(waitToCountList.sequel);
var countedStaff      = buildCountedList(waitToCountList.staff);
var countedCast       = buildCountedList(waitToCountList.cast);

function animeBox($scope) {

    $scope.animeDataBase     = buildAnimeList(shownAnimeData);

    $scope.countedOnair      = meaningfulData(countedOnair, 1);
    $scope.countedGenre      = meaningfulData(countedGenre, 1);
    $scope.countedOrigintype = meaningfulData(countedOrigintype, 1);
    $scope.countedSequel     = meaningfulData(countedSequel, 1);
    $scope.countedStaff      = meaningfulData(countedStaff, 2);
    $scope.countedCast       = meaningfulData(countedCast, 3);

    $scope.currentName       = "";

    $scope.searchProperty = function (str, type) {

        /*
         *
         * Search the Members like this :
         *
         * buttons : [ MAD HOUSE ( 2 ) ]  [ BONES ( 4 ) ]  [ 新房昭之 ( 3 ) ]
         *
         * click one of the buttons , and then the Anime with that member will be selected.
         *
         * */

        var indexList = [];

        switch (type) {
            case 'onair' :
                indexList = countedOnair[str].list;
                break;
            case 'genre' :
                indexList = countedGenre[str].list;
                break;
            case 'origintype':
                indexList = countedOrigintype[str].list;
                break;
            case 'sequel':
                indexList = countedSequel[str].list;
                break;
            case 'staff':
                indexList = countedStaff[str].list;
                break;
            case 'cast':
                indexList = countedCast[str].list;
                break;
            default :
                break
        }

        $scope.animeDataBase = buildAnimeList(shownAnimeData, indexList, -1);
        $scope.currentName = str;
    };

    $scope.changeCount = function (item, num) {

        switch ( item ) {
            case 'staff':
                $scope.countedStaff = meaningfulData(countedStaff, num);
                $scope.staffCountNum = "10";
                break;

            case 'cast':
                $scope.countedCast = meaningfulData(countedCast, num);
                $scope.castCountNum = "";
                break;
        }
    };

    $scope.unFilt = function() {

        /*
        *
        * The GoBack function for the searchProperty(). Once click this , the member list will come back.
        *
        * */

        var sN = $scope.pageStart ? $scope.pageStart - 1 : 0;
        var eN = $scope.pageEnd ? $scope.pageEnd : shownAnimeData.length;

        $scope.animeDataBase = buildAnimeList(shownAnimeData, [sN, eN], 1);

    };

    $scope.animeNumberInOnePage = function() {

        var sN = $scope.pageStart ? $scope.pageStart - 1 : 0;
        var eN = $scope.pageEnd ? $scope.pageEnd: shownAnimeData.length;

        var animeDataBase = buildAnimeList(shownAnimeData, [sN, eN], 1);

        $scope.animeDataBase = animeDataBase;

        /*
        var waitToCountList = buildWaitToCountList(animeDataBase);

        var countedOnair      = buildCountedList(waitToCountList.onair);
        var countedGenre      = buildCountedList(waitToCountList.genre);
        var countedOrigintype = buildCountedList(waitToCountList.origintype);
        var countedSequel     = buildCountedList(waitToCountList.sequel);
        var countedStaff      = buildCountedList(waitToCountList.staff);
        var countedCast       = buildCountedList(waitToCountList.cast);

        $scope.countedOnair      = meaningfulData(countedOnair, 1);
        $scope.countedGenre      = meaningfulData(countedGenre, 1);
        $scope.countedOrigintype = meaningfulData(countedOrigintype, 1);
        $scope.countedSequel     = meaningfulData(countedSequel, 1);
        $scope.countedStaff      = meaningfulData(countedStaff, 2);
        $scope.countedCast       = meaningfulData(countedCast, 3);
        */

        $scope.currentName = "";

        $scope.pageStart = "";
        $scope.pageEnd   = "";
    };

    $scope.selector = 'pages';

    $scope.tabChange = function(selector) {
        $scope.selector = selector;
    }
}