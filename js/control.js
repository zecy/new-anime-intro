/**
 * Created by zecy on 14-3-29.
 */

function arrCompact(arr, style) {

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

    var list = items;


    for ( var i = 0; i < list.length; i++ ) {

        for ( var j = 0; j < list[i].length; j++ ) {

            if ( list[i][j][2] === '0' ) {

                list[i].splice(j, 1);

                j -= 1

                continue

            }
        }

    }

    return list;

}

function buildDataList(dataItem) {

    var itemHidden = arguments[1] ? arguments[1] : 0;

    var animeName = [];
    var animeInfo = [];
    var animeOnair = [];
    var animeHp = [];
    var animeStaff = [];
    var animeCast = [];
    var animeComment = [];

    //for ( var i = 0; i< dataItem.length; i++) {
    for ( var i = 43; i < 66; i++ ) {

        var name = dataItem[i].name;
        var info = dataItem[i].info;
        var staff = arrCompact(dataItem[i].staff);
        var cast = arrCompact(dataItem[i].cast);
        var comment = dataItem[i].comment;

        animeName.push(name);
        animeInfo.push(info);
        animeStaff.push(staff);
        animeCast.push(cast);
        animeComment.push(comment);
    }

//    console.log(animeName);
//    console.log(animeInfo);
//    console.log(animeCast);
//    console.log(animeStaff);

    for ( var i = 0; i < animeInfo.length; i++ ) {

        for ( var j = 0; j < animeInfo[i].length; j++ ) {

            if ( animeInfo[i][j][0] === '官方网站' ) {

                animeHp.push(animeInfo[i][j]);

                animeInfo[i].splice(j, 1);

            } else if ( animeInfo[i][j][0] === '时间' ) {

                animeOnair.push(animeInfo[i][j]);

            }

        }

//        console.log("抽出的官网 " + animeHp);
//        console.log("抽出的官网列表 " + animeHp);
//        console.log("没有官网的信息列表 " + animeInfo[i]);
    }

//    console.log(itemHidden);

    if( itemHidden === 1 ) {

        animeStaff = hideItem(animeStaff);
        animeCast = hideItem(animeCast);

    }

//    for ( var i = 0; i < animeStaff.length; i++ ) {
//
//        for ( var j = 0; j < animeStaff[i].length; j++ ) {
//
//            if ( animeStaff[i][j][2] === '0' ) {
//
//                animeStaff[i].splice(j - 1, 1);
//
//                j = j - 1;
//
//                continue
//
//            }
//        }
//    }
//
//    for ( var i = 0; i < animeCast.length; i++ ) {
//
//        for ( var j = 0; j < animeCast[i].length; j++ ) {
//
//            if ( animeCast[i][j][2] === '0' ) {
//
//                animeCast[i].splice(j - 1, 1);
//
//                j = j - 1;
//
//                continue
//
//            }
//        }
//    }

    var dataList = {
        'animeName'   : animeName,
        'animeInfo'   : animeInfo,
        'animeOnair'  : animeOnair,
        'animeHp'     : animeHp,
        'animeStaff'  : animeStaff,
        'animeCast'   : animeCast,
        'animeComment': animeComment
    };

    return dataList

}

function staList(dataItem) {
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

    var staList = [];
//    console.log(dataItem[1].info);

    for ( var i = 0; i < dataItem.length; i++ ) {
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
    console.log(arr);
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
    };
    console.log(hash);
//    return result;
    return hash;

}


function meaningfulMembers(obj) {
    var meaningList = [];
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

var dataList = buildDataList(animeDataBase, 1);

/* list all the staff members for the statitcs */
var staList = staList(animeDataBase);

/* count every staff member  */
var dataCount = dataCount(staList);

/* select the members join more then 'number' animes, return that list */
var staResult = meaningfulMembers(dataCount);

function animeBox($scope) {

    $scope.animeName = dataList.animeName;
    $scope.animeInfo = dataList.animeInfo;
    $scope.animeOnair = dataList.animeOnair;
    $scope.animeHp = dataList.animeHp;
    $scope.animeStaff = dataList.animeStaff;
    $scope.animeCast = dataList.animeCast;
    $scope.animeComment = dataList.animeComment;

    /* display the staffs list in page */
    $scope.staffs = staResult;

}
