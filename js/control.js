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

    for ( var i = 0; i < arr.length; i++ ) {

        for ( var j = i + 1; j < arr.length; j++ ) {

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

                j -= 1;

            }
        }

    }

    return arr;

}

function formatDataBase(data) {

    var database = angular.copy(data);

    for ( var j = 0; j < database.length; j++ ) {
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

    var cs = arguments[2] ? arguments[2] : 1;

    var sn = index[0];
    var en = index[index.length-1];

    if( cs == 1 ) {

        for ( var i = sn; i < en; i++ ) {
            var anime = data[i];
            outputDataBase.push(anime)
        }

    } else if ( cs == -1 ) {

        for ( var i = 0; i < index.length; i++ ) {
            var anime = data[index[i]];
            outputDataBase.push(anime)
        }

    } else {
        console.log("ERROR: Have an error in conswitch from buildAnimeList.")
    }

    return outputDataBase
}

function buildWaitToCountList(dataItem) {
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

    var dataItem = angular.copy(dataItem);

    var staffList = [];
    var castList  = [];

    function waitToCountList(arr, index) {

        var waitToCountList = [];

        for ( var i = 0; i < arr.length; i++ ) {
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

    for ( var i = 0; i < dataItem.length; i++ ) {
        var anime = dataItem[i];

        var staff = arrCompact(anime.staff,1);
        var cast  = arrCompact(anime.cast,1);

        staff = waitToCountList(staff, i);
        cast = waitToCountList(cast, i);

        staffList = staffList.concat(staff);
        castList = castList.concat(cast);

    }

    return {
        staff: staffList,
        cast : castList
    };
}

function buildCountedList(arr) {
    var result = [], hash = {};
    for ( var i = 0; i < arr.length ; i++ ) {
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
//    return result;
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
        for ( var i = 0; i < input.length; i++ ) {
            var item = input[i];
            if ( item[2] == 1 ) {
                output.push(item)
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

var countedStaff = buildCountedList(waitToCountList.staff);
var countedCast = buildCountedList(waitToCountList.cast);

function animeBox($scope) {

    $scope.animeDataBase = buildAnimeList(shownAnimeData);

    $scope.countedStaff = meaningfulData(countedStaff);

    $scope.countedCast = meaningfulData(countedCast);


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
            case 'staff':
                indexList = countedStaff[str].list;
                break;
            case 'cast':
                indexList = countedCast[str].list;
                break;
        }

        $scope.animeDataBase = buildAnimeList(shownAnimeData, indexList, -1);
    };

    $scope.changeCount = function (item, num) {

        switch ( item ) {
            case 'staff':
                $scope.countedStaff = meaningfulData(countedStaff, num);
                break;

            case 'cast':
                $scope.countedCast = meaningfulData(countedCast, num);
                break;
        }
    };

    var sN = $scope.pageStart ? $scope.pageStart: 0;
    var eN = $scope.pageEnd ? $scope.pageEnd: shownAnimeData.length;

    $scope.unFilt = function() {

        /*
        *
        * The GoBack function for the searchProperty(). Once click this , the member list will come back.
        *
        * */

        $scope.animeDataBase = buildAnimeList(shownAnimeData, [sN, eN], 1);
    };

    $scope.animeNumberInOnePage = function() {
        $scope.animeDataBase = buildAnimeList(shownAnimeData, [sN, eN], 1)
        $scope.countedStaff = meaningfulData()
    };
}
