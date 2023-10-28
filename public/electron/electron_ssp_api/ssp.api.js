const axios = require('axios')

let INITIAL_DATE = new Date(new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString());
INITIAL_DATE.setDate(INITIAL_DATE.getDate() - 20);
-
async function getLicense() {
    const query = `
        query plate {
            licensePlates {
            tag
            licensePlates
            }
        }
    `;
  
    const options = {
        method: 'POST',
        url: `https://ssp-brazil-local-02.staging-virginia.remarkai.org/api_gps-coordinates/license_plates`,
        headers: { 'content-type': 'application/json' },
        data: {
            query: query,
        }
    }; 
    
    let dados = await axios.request(options)
    dados = dados.data.data.licensePlates.licensePlates
    return await getVehicle(dados)
}
  
async function getVehicle(blackList) {
  const query = `
      query Alerts($page: Int, $alertIds: [String], $dateFilters: DateFilter, $timeframeFilters: DateTimeFramesFilter, $areas: [Int], $vehicleFilter: CarplateFilter) {
          alerts(
          limit: 30
          page: $page
          alertIdsFilter: { alertIds: $alertIds }
          alertTypeFilter: { type: VEHICLE }
          dateFilter: $dateFilters
          devicesListFilter: { areas: $areas }
          timeFramesFilter: $timeframeFilters
          vehicleFilter: $vehicleFilter
          ) {
          total
          result {
              insertedLocaltime
              data {
              vehicleIntrusionData {
                  pictureData {
                  face
                  carplate
                  }
                  anprData {
                  carplateText
                  }
              }
              }
          }
          }
      }
  `
  
  const options = {
      method: 'POST',
      url: `https://ssp-intelicity.staging-virginia.remarkai.org/api_history/alerts`,
      headers: { 'content-type': 'application/json' },
      data: {
          query: query,
          variables: {
              dateFilters: {
                  dateLocaltimeQuery: true,
                  fromDate: INITIAL_DATE,
                  toDate: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
              }
          }
      }
  };
  
  
  const response = await axios.request(options)
  const carplates = response.data.data.alerts.result

  return carplates
}


async function obterVeiculo() {
    const payload = {
        "operationName": "Alerts",
        "variables": {},
        "query": "query Alerts($page: Int, $alertIds: [String], $dateFilters: DateFilter, $timeframeFilters: DateTimeFramesFilter, $areas: [Int], $vehicleFilter: CarplateFilter) {\n  alerts(limit: 30, page: $page, alertIdsFilter: {alertIds: $alertIds}, alertTypeFilter: {type: VEHICLE}, dateFilter: $dateFilters, devicesListFilter: {areas: $areas}, timeFramesFilter: $timeframeFilters, vehicleFilter: $vehicleFilter) {\n    total\n    result {\n      insertedLocaltime\n      data {\n        vehicleIntrusionData {\n          pictureData {\n            face\n            carplate\n          }\n          anprData {\n            carplateText\n          }\n        }\n      }\n    }\n  }\n}\n"
      }
    
      const options = {
        method: 'POST',
        url: `https://ssp-intelicity.staging-virginia.remarkai.org/api_history/alerts`,
        headers: { 'content-type': 'application/json' },
        data: payload
    };
    
    
    const response = await axios.request(options)

    return response.data.data.alerts.result
}

async function obterFace() {
    const query = `
  fragment UnauthorizedAccessResultFields on OutputResult {
    id
    insertedTimestamp
    insertedLocaltime
    timezone
    deviceId
    eventId
    alertType
    alertTypes
    deviceData {
      venueName
      floorName
      locationName
      functionArea
      __typename
    }
    alertPictureData {
      face
      __typename
    }
    gpsCoordinates {
      latitude
      longitude
      __typename
    }
    data {
      thermalData {
        temperature
        scale
        __typename
      }
      personData {
        mask
        personId
        age
        gender
        qualityLevel
        __typename
      }
      identityData {
        identityName
        id
        staffType
        pictureData
        tags
        __typename
      }
      __typename
    }
    __typename
  }

  query Alerts(
    $page: Int, 
    $alertIds: [String], 
    $dateFilters: DateFilter, 
    $timeframeFilters: DateTimeFramesFilter, 
    $areas: [Int], 
    $personId: String, 
    $personIds: [String], 
    $personFeaturesFilter: PersonFeaturesFilter, 
    $staffTypes: [String], 
    $tags: [String], 
    $noTags: Boolean
  ) {
    alerts(
      limit: 300
      page: $page
      alertIdsFilter: { alertIds: $alertIds }
      alertTypeFilter: { type: TAG_DETECTION }
      devicesListFilter: { areas: $areas }
      dateFilter: $dateFilters
      timeFramesFilter: $timeframeFilters
      personFeaturesFilter: $personFeaturesFilter
      personFilter: {
        personId: $personId, 
        personIds: $personIds, 
        tags: $tags, 
        noTags: $noTags, 
        staffTypes: $staffTypes
      }
    ) {
      total
      result {
        ...UnauthorizedAccessResultFields
        __typename
      }
      __typename
    }
  }
`
    const payload = {
        "operationName": "Alerts",
        "variables": {
            dateLocaltimeQuery: true,
            fromDate: INITIAL_DATE,
            toDate: new Date(Date.now() - 145 * 60 * 60 * 1000).toISOString()
        },
        "query": query
        }
    
      const options = {
        method: 'POST',
        url: `https://ssp-intelicity.staging-virginia.remarkai.org/api_history/alerts`,
        headers: { 'content-type': 'application/json' },
        data: payload
    };
    
    
    const response = await axios.request(options) 
    return response.data.data.alerts.result
}
 
module.exports = {obterVeiculo, obterFace}