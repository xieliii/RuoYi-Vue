import inherits from "inherits";
import Viewer from "bpmn-js/lib/Viewer";
import ZoomScrollModule from "diagram-js/lib/navigation/zoomscroll";
import MoveCanvasModule from "diagram-js/lib/navigation/movecanvas";
function CustomViewer(options) {
  Viewer.call(this, options);
}
inherits(CustomViewer, Viewer);
// 添加图形滑动功能，暂时不需要
// CustomViewer.prototype._modules = [].concat(Viewer.prototype._modules, [ZoomScrollModule, MoveCanvasModule]);
CustomViewer.prototype._modules = [].concat(Viewer.prototype._modules, [MoveCanvasModule]);
export {
  CustomViewer
};
