import request from '@/utils/request'

// 获取温度
export const TempGetService = (id) =>
  request.get('/get_temperature', {
    params: {
      bmu_id: id
    }
  })

// 获取电压
export const VolGetService = (id) =>
  request.get('/get_voltage', {
    params: {
      bmu_id: id
    }
  })

// 获取报警信息
export const AlarmGetService = (id) =>
  request.get('/get_alarm_report', {
    params: {
      bmu_id: id
    }
  })

// 获取历史温度
export const GetHistoryTempService = (id, datatime) =>
  request.get('get_history_temperature', {
    params: {
      bmu_id: id,
      date: datatime,
      rows: 500
    }
  })

// 获取历史电压
export const GetHistoryVolService = (id, datatime) =>
  request.get('/get_history_voltage', {
    params: {
      bmu_id: id,
      date: datatime,
      rows: 500
    }
  })

// 获取BMU在线状态
export const GetOnlineStateService = (id) =>
  request.get('/get_online_state', {
    params: {
      bmu_id: id
    }
  })

// 获取单个电池包更新数据
export const GetBatteryAllDataService = (id) =>
  request.get('/read_bmu_real_time_data', {
    params: {
      bmu_id: id
    }
  })

// 获取BMU报警参数
export const GetAlarmParamService = (id) =>
  request.get('/get_bmu_alarm_para', {
    params: {
      bmu_id: id
    }
  })

// 设置全部BMU报警参数
export const SetAlarmParamService = (alarmarr) =>
  request.post('/set_bmu_alarm_para', {
    alarm_para: alarmarr
  })

// 获取指定电池簇的50个电压
export const GetClusterVolService = (id) =>
  request.get('/get_bcmu_voltage', {
    params: {
      bcmu_id: id
    }
  })

// 获取指定电池簇的历史电压
export const GetClusterHistoryVolService = (id, datatime) =>
  request.get('/get_bcmu_history_voltage', {
    params: {
      bcmu_id: id,
      date: datatime,
      rows: 500
    }
  })
