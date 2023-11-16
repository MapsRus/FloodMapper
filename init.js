var LayerPanel =
    '<div id="layerContent">' +
    '<div id="contentDiv" >' +
    '<div class="bg-gray-800 rounded opacity-90">' +
    '<div id="layerPanelHeader"  class="text-white p-2.5 flex items-center justify-between border-b-2 border-gray-400"><div class="text-[20px] font-medium font-roboto">Sea Level Rise</div></div><div id="divider" class="bg-gray-400 h-[1%] w-full"></div>' +
    '<div id="layerPanelContainer"><div id="layerPanel" class="overflow-auto p-2.5 text-white"></div>' +
    '</div></div></div>';
$(document).ready(function () {
  $("#LayerContainer").append(LayerPanel);
});
