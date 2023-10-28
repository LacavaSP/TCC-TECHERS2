const {alertList} = require('../shared/alert.shared')

class AlertService {

  preenchePreview = (objetoProcessado) => {
    alertList.push(
      {
        id:  objetoProcessado.id, 
        previewImg: objetoProcessado && objetoProcessado.dados && objetoProcessado.dados.length > 0 ? objetoProcessado.dados[0].img : null,
        tipo: objetoProcessado.tipo,
        fgProcessado: false
      }
    )
  }
  
  returnAlertInfo = (data) => {
    data = JSON.parse(data) 

    
    let tipo = ''
    let dataSet = null
      //TAG_DETECTION,UNAUTHORIZED_ACESS

      if (data) {
        if (data[0].alertType === 'vehicle') {
          tipo = 'Intrusão Veicular'
          dataSet = data.map((dd) => dd.data.vehicleIntrusionData).map((dd) => {return {carplateText: (dd.anprData? dd.anprData.carplateText : null), img: dd.pictureData.face}})
        } else {
          tipo = 'Facial' 
        }
      }
      
      console.log(data[0])
      return {tipo, dataSet}
  }

}

module.exports = AlertService