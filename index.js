const uuid = require('uuid').v4
const _ = require('lodash')
const { DOMAIN } = require('../config')



var mysql      = require('sync-mysql');                                 //mysql 동기화 해주기 위한 것
var connection = new mysql({                                            //mysql 접속
  host     : 'localhost',
  user     : 'root',
  password : 'asasas12',
  database : 'NG_DB',
  multipleStatements: true
});
function outs(solution) {
  let results = solution
  let space1 = ''
  let space2 = ''
  //넘기는 인자는 3개이나 필요한 리턴 값은 1개

  return {space1, results, space2}
}

class NPKRequest {
  constructor (httpReq) {
    this.action = httpReq.body.action
    console.log(`NPKRequest: ${JSON.stringify(this.context)}, ${JSON.stringify(this.action)}`)
  }
  do(npkResponse) {
    this.actionRequest(npkResponse)
  }
  actionRequest(npkResponse) {
    console.log('actionRequest')
    let a1;
    let a2;
    var sql;
    var para;
  const actionName = this.action.actionName
    const parameters = this.action.parameters
    switch(actionName) {
        case 'Action.brokenteeth':
                a1 =parameters.affected_brokenteeth.value;
                a2 =parameters.sympton_brokenteeth.value;
                var sql = 'SELECT 응급조치 FROM NG_T where 환부 = ? and 증상 = ?';  //DB에서 검색해야하는 것
                var para =[a1,a2];     //sql문 조건절의 인자
                break;
        case 'Action.nosebleed':
                a1 =parameters.affected_nosebleed.value;
                a2 =parameters.symptom_nosebleed.value;
                var sql = 'SELECT 응급조치 FROM NG_T where 환부 = ? and 증상 = ?';
                var para =[a1,a2];
                break;
        case 'Action.burn':
                a1 =parameters.symptom_burn.value;
                var sql = 'SELECT 응급조치 FROM NG_T where 증상 = ?';
                var para =[a1];
                break;
        case 'Action.scratch':
                a1 =parameters.symptom_scratch.value;
                var sql = 'SELECT 응급조치 FROM NG_T where 증상 = ?';
                var para =[a1];
                break;
        case 'Action.eyesensation':
                a1 =parameters.affected_eyesensation.value;
                a2 =parameters.situation_eyesensation.value;
                var sql = 'SELECT 응급조치 FROM NG_T where 환부 = ? and 상황 = ?';
                var para =[a1,a2];     //sql문 조건절의 인자
                break;
        case 'Action.convulsion':
                a1 =parameters.symptom_convulsion.value;
                a2 =parameters.situation_convulsion.value;
                var sql = 'SELECT 응급조치 FROM NG_T where 증상 = ? and 상황 = ?';
                var para =[a1,a2];
                break;
        case 'Action.beesting':
                a1 =parameters.situation_beesting.value;
                var sql = 'SELECT 응급조치 FROM NG_T where 상황 = ?';
                var para =[a1];
                break;
                case 'Action.abrasion':
                  a1 =parameters.symptom_abrasion.value;
                  var sql = 'SELECT 응급조치 FROM NG_T where 증상 = ?';
                  var para =[a1];
                  break;
          case 'Action.bruise':
                  a1 =parameters.symptom_bruise.value;
                  var sql = 'SELECT 응급조치 FROM NG_T where 증상 = ?';
                  var para =[a1];
                  break;
          case 'Action.sprain':
                  a1 =parameters.symptom_sprain.value;
                  var sql = 'SELECT 응급조치 FROM NG_T where 증상 = ?';
                  var para =[a1];
                  break;
          case 'Action.earbug':
                  a1 =parameters.affected_earbug.value;
                  a2 =parameters.situation_earbug.value;
                  var sql = 'SELECT 응급조치 FROM NG_T where 환부 = ? and 상황 = ?';
                  var para =[a1,a2];
                  break;
          case 'Action.pimple':
                  a1 =parameters.symptom_pimple.value;
                  var sql = 'SELECT 응급조치 FROM NG_T where 증상 = ?';
                  var para =[a1];
                  break;
          case 'Action.stomachache':
                  a1 =parameters.symptom_stomachache.value;
                  var sql = 'SELECT 응급조치 FROM NG_T where 증상 = ?';
                  var para =[a1];
                  break;
          case 'Action.mosquito':
                  a1 =parameters.situation_mosquito.value;
                  var sql = 'SELECT 응급조치 FROM NG_T where 상황 = ?';
                  var para =[a1];
                  break;
          case 'Action.dryeye':
                  a1 =parameters.symptom_dryeye.value;
                  var sql = 'SELECT 응급조치 FROM NG_T where 증상 = ?';
                  var para =[a1];
                  break;
  
      }
  
  
      let solution=connection.query(sql,para);                             //동기화된 쿼리문
      console.log(solution[0].응급조치);
  
      const Result = outs(solution[0].응급조치)                            //응급 조치를 nugu play kit에 보낼수 있도록 응급 조치를 변수에 넣음
      npkResponse.setOutputParameters(Result)                              //응급 조치 변수를 nugu play kit에 보내기 위한 함수
    }
  
  }
  
  class NPKResponse {
    constructor () {
      console.log('NPKResponse constructor')
  
      this.version = '2.0'
      this.resultCode = 'OK'
      this.output = {}
      this.directives = []
    }
  
    setOutputParameters(Result) {
  
      this.output = {
        space1: Result.space1,
        results_brokenteeth: Result.results,
        space2: Result.space2,
        results_nosebleed: Result.results,
        results_scratch: Result.results,
        results_burn: Result.results,
        results_eyesensation: Result.results,
        results_convulsion: Result.results,
        results_beesting: Result.results,
        results_abrasion: Result.results,
        results_bruise: Result.results,
        results_sprain: Result.results,
        results_earbug: Result.results,
        results_pimple: Result.results,
        results_stomachache: Result.results,
        results_mosquito: Result.results,
        results_dryeye: Result.results,
      } //출력될 결과
    }
  }
  const nuguReq = function (httpReq, httpRes, next) {
    npkResponse = new NPKResponse()
    npkRequest = new NPKRequest(httpReq)
    npkRequest.do(npkResponse)
    console.log(`NPKResponse: ${JSON.stringify(npkResponse)}`)
    return httpRes.send(npkResponse)
  };
  
  module.exports = nuguReq;
  