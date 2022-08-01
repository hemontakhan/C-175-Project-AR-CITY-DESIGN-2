AFRAME.registerComponent('city-objects',{
 init: async function(){
 
  var objects = await this.getObjects();

  var barCodes = Object.keys(objects);

  barCodes.map(barcode => {
    var model = objects[barcode];

    this.createObjects(model);
  })
 },
 getObjects: function(){
    return fetch('js/objectList.json')
      .then(res => res.json())
      .then(data => data);
 },
createObjects: function(model){
  var barcodeValue = model.barcode_value;
  var model_url = model.model_url;
  var modelName = model.model_name;

  var scene = document.querySelector('a-scene');

  var marker = document.createElement('a-marker');
  marker.setAttribute('id',`marker-${modelName}`);
  marker.setAttribute('type','barcode');
  marker.setAttribute('model_name',modelName);
  marker.setAttribute('value',barcodeValue);
  marker.setAttribute('marker-handler',{});
  scene.appendChild(marker);

  if(barcodeValue === 0){
     var modelEl = document.createElement('a-entity');
     modelEl.setAttribute("id",`${modelName}`);
     modelEl.setAttribute('position',model.position);
     modelEl.setAttribute('rotation',model.rotation);
     modelEl.setAttribute('geometry',{
        primitive: 'box',
        width: 10,
        height: 10
     });
     modelEl.setAtrribute('material','color','red');
     marker.appendChild(modelEl)
  } else {
    var modelEl = document.createElement('a-entity');
    modelEl.setAttribute('id',`${modelName}`);
    modelEl.setAttribute('gltf-model','url',model_url);
    modelEl.setAttribute('position',model.position);
    modelEl.setAttribute('rotation',model.rotation);
    modelEl.setAttribute('scale',model.scale);
  }
}
})