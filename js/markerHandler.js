var modelList = []

AFRAME.registerComponent("markerHandler",{
init:async function(){
 var cityObjects = await this.getObjects();

 this.el.setAttribute('markerFound',() => {
    var modelName = this.el.getAttribute('model_name');
    var barcodevalue = this.el.getAttribute('barcode_value');
    modelList.push({model_name: modelName,barcode_value: barcodevalue});

    modelList[barcodevalue]['objects'].map(item =>{
        var object = document.querySelector(`#${item.model_name}-${barcodeValue}`)
        object.setAttribute('visible',false);
    })  
    
 });

 this.el.setAttribute('markerLost',() =>{
    var modelName = this.el.getAttribute('model_name');
    var index = modelList.findIndex(x => x.model_name === modelName);
    if(index > -1){
       modelList.splice(index,1);
    }
 })
},
isModelPresentInArray: function(arr,val){
  for(var i of arr){
     if(i.model_name === val){
        return true;
     }
  }
  return false;
},
tick:async function(){
  if(modelList.length  > 1){
     var isBaseModelPresent = this.isModelPresentInArray(modelList,"base");
     var messageText= document.querySelector('#message-text');

     if(!isBaseModelPresent){
        messageText.setAttribute('visible',true);
     } else {
        if(models === null){
           models = await this.getObjects();
        }

        messageText.setAttribute('visible',false);
        this.placeTheModels("road",models);
        this.placeTheModels("building",models);
        this.placeTheModels("car",models);
     }
  }
},
placeTheModels: function(modelName,models){
  var isListContainModel = thi.isModelPresentInArray(modelList,modelName);
  if(isListContainModel){
    distnace = null;
    var marker1 = document.querySelector(`#marker-base`);
    var marker2 = document.querySelector(`#marker-${modelName}`);

    distance =  this.getDistance(marker1,marker2);

    if(distance < 1.25){
       
      var modelEl = document.querySelector(`#${modelName}`);
      modelEl.setAttribute('visible',false);

      var isModelPlaced = document.querySelector(`#model-${modelName}`);
      if(isModelPlaced === null){
         var el = document.createElement('a-entity');
         var modelGeometry = this.getModelGeometry(models,modelName);
         el.setAttribute('id',`model-${modelName}`);
         el.setAttribute('gltf-model',`url(${modelGeometry.model_url})`);
         el.setAttribute('position',modelGeometry.position);
         el.setAttribute('rotation',modelGeometry.rotation);
         el.setAttribute('scale',modelGeometry.scale);
         marker1.appendChild(el);
      }

    }
  }
},
getDistance: function(elA,elB){
 return elA.object3D.position.distanceTo(elB.object3D.position);
},
getModelGeometry: function(models,modelName){
 var barcodes = object3D.keys(models)
  
 for(var barcode of barcodes){
    if(models[barcode].model_name === modelName){
       return{
        position: models[barcode]["placement_position"],
        rotation: models[barcode]["placement_rotation"],
        scale: models[barcode]["placement_scale"],
        model_url: models[barcode]["model_url"]
       }
    }
 }
},  
getObjects: function(){
  return fetch('js/objectList.json')
  .then(res => res.json())
  .then(data => data)
},
})