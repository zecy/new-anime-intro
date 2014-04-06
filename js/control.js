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

function hideItem(items) {

    /*
    *
    * for the BBS or other website, I don't want so many items, so i want to hide sth
    * the items won't show have a target number
    * when that number is '0', the item won't be shown.
    *
    * use this function on a items array, then it would return a new array without those 0 items
    *
    * ATTENTION: this fuction SPLICE the array without a deep copy.
    *
    * the item should like this:
    *
    *   this would be shown at any time             : ['原作', '伊藤彰', '1'],
    *   this would be hidden when use this function : ['连载', '月刊ブシロード', '0'],
    *
    * */


    for ( var i = 0; i < items.length; i++ ) {

        for ( var j = 0; j < items[i].length; j++ ) {

            if ( items[i][j][2] === '0' ) {

                items[i].splice(j, 1);

                j -= 1;

            }
        }

    }

    return items;

}

function buildStaList(dataItem, startNum, endNum) {
    /*
     *
     *  The List Struture:
     *
     *  staList = [
     *
     *      { member  : [ position, animeDataBase下标] },
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

    var starNum = arguments[1] ? arguments[1] : 0;
    var endNum  = arguments[2] ? arguments[2] : dataItem.length;

    var staList = [];
//    console.log(dataItem[1].info);

//    for ( var i = 0; i < dataItem.length; i++ ) {
    for ( var i = starNum; i < endNum; i++ ) {
//    for ( var i = 0; i < 1; i++ ) {
//        var staItem = [];
        var staffItem = arrCompact( dataItem[i].staff, 1);
//        staItem["dbid"] = i;
//        staItem["title"] = item.name[1];
        for ( var j = 0; j < staffItem.length; j++ ) {
            var obj = staffItem[j];
            var objList = [];
            var objItem = {};
            objList[0] = obj[0];
            objList[1] = i;
            objItem[obj[1]] = objList;
//            staItem.push(obj);
            staList.push(objItem);
//            console.log(objItem);
        }

//        staList.push(staItem);
    }

//    console.log(staList);
    return staList;
}

function dataCount(arr) {
    var result = [], hash = {};
//    console.log(arr);
//    for ( var i = 0, elem; (elem = Object.keys( staList[i] ) ) != null; i++ ) {
    for ( var i = 0; i < arr.length ; i++ ) {
//        console.log('hash: ' + hash);
//        console.log('elem: ' + elem);
//        console.log('hash[elem]: ' + hash[elem]);
//        console.log('!hash[elem]: ' + !hash[elem]);
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

function searchAnime(str, staList, dataBase) {
    /*
    *  Search the Anime with 'str'
    *  and returen a list with the index numbers
    *  so you can get the Anime datas from the database using the this index numbers list
    *
    *  the data is from staList
    *
    *  staList stuture
    *  {member : [position, animeDatabseIndex]}
    *  {新房昭之: [总监督,  14]}
    *
    *
    * */

    var newDataBase = [];
    for ( var i = 0; i < staList.length; i++ ) {
        var staff = staList[i];
        var staffMember = Object.keys(staList[i]);
        if( staffMember == str ) {
//            console.log(staff[staffMember][1]);
            var index = staff[staffMember][1];
            newDataBase.push(dataBase[index]);
        }
    }
//    console.log(newDataBase);
    return newDataBase;
}

//var dataList = buildDataList(animeDataBase, 0);

/* list all the staff members for the statitcs */
//var staList = buildStaList(animeDataBase);

/* count every staff member  */
//var dataCounted = dataCount(staList);

function animeBox($scope) {


//    function showAnime(dataList) {
//
//        /*
//        *
//        * For showing the Anime List. Including the guiding image and the detail.
//        *
//        * */
//
//        $scope.animeName = dataList.animeName;
//        $scope.animeInfo = dataList.animeInfo;
//        $scope.animeOnair = dataList.animeOnair;
//        $scope.animeHp = dataList.animeHp;
//        $scope.animeStaff = dataList.animeStaff;
//        $scope.animeCast = dataList.animeCast;
//        $scope.animeComment = dataList.animeComment;
//    }

    $scope.animeDataBase = animeDataBase;

    /* default : show the Animes  */
//    showAnime(dataList);


    /* --------------------------------------------------------------
     *
     * SHOW ANIME IN SPECITIFY NUMBERS
     *
     * --------------------------------------------------------------*/

//    $scope.animeNumberInOnePage = function() {
//
//        var sN = $scope.pageStart;
//        var eN = $scope.pageEnd;
//
//        var newDataList    = buildDataList(animeDataBase, 0, sN, eN);
//        staList            = buildStaList(animeDataBase, sN, eN);
//        dataCounted        = dataCount(staList);
//
//        // show the new anime list
//        showAnime(newDataList);
//
//        // update the selectors at the same time
//        $scope.staffs = meaningfulData(dataCounted);
//    };

    /* --------------------------------------------------------------
    *
    *  SELECT THE ANIME BY DIFFERENT PROPERTIES
    *
    * --------------------------------------------------------------*/

    $scope.searchProperty = function (property) {

        /*
         *
         * Search the Members like this :
         *
         * buttons : [ MAD HOUSE ( 2 ) ]  [ BONES ( 4 ) ]  [ 新房昭之 ( 3 ) ]
         *
         * click one of the buttons , and then the Anime with that member will be selected.
         *
         * */

        var newDataBase = searchAnime(property, staList, animeDataBase);
        var newDataList = buildDataList(newDataBase, 0);
        showAnime(newDataList);
    };

    /*
    *
    *  STAFF
    *
    * */

    /* display the staffs list in page */
//    $scope.countedStaffs = meaningfulData(dataCounted);


    $scope.staffsUndo = function() {

        /*
        *
        * The GoBack function for he searchProperty(). Once click this , the member list will come back.
        *
        * */

        var sN = $scope.pageStart;
        var eN = $scope.pageEnd;

        var dataList = buildDataList(animeDataBase, 0, sN, eN);
        console.log(sN);
        showAnime(dataList);
    };

    $scope.staffCount = function(num) {
        var number = $scope.staffCountNumber ? $scope.staffCountNumber : num;
        $scope.staffs = meaningfulData(dataCounted, number);
        $scope.staffCountNumber = "";
    }



}
