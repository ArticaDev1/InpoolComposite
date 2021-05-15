import Scrollbar, {ScrollbarPlugin} from 'smooth-scrollbar';
class SoftScrollPlugin extends ScrollbarPlugin {
  static pluginName = 'SoftScroll';
  transformDelta(delta, fromEvent) {
    const dirX = delta.x > 0 ? 1 : -1;
    const dirY = delta.y > 0 ? 1 : -1;
    if (dirX === this.lockX || dirY === this.lockY) {
      return {x: 0, y: 0};
    } else {
      this.lockX = null;
      this.lockY = null;
    }
    return delta;
  }
  onRender(Data2d) {
    const {x, y} = Data2d;
    if(y<0 && !this.lockY && Math.abs(y) >= this.scrollbar.scrollTop) {
      this.scrollbar.setMomentum(0, -this.scrollbar.scrollTop);
      this.lockY = -1;
    }
    if(x<0 && !this.lockX && Math.abs(x) >= this.scrollbar.scrollLeft) {
      this.scrollbar.setMomentum(-this.scrollbar.scrollLeft, 0);
      this.lockX = -1;
    }
    if(x>0 && !this.lockX && Math.abs(x) >= (this.scrollbar.limit.x - this.scrollbar.scrollLeft)) {
      this.scrollbar.setMomentum((this.scrollbar.limit.x - this.scrollbar.scrollLeft), 0);
      this.lockX = 1;
    }
    if(y>0 && !this.lockY && Math.abs(y) >= (this.scrollbar.limit.y - this.scrollbar.scrollTop)) {
      this.scrollbar.setMomentum(0, (this.scrollbar.limit.y - this.scrollbar.scrollTop));
      this.lockY = 1;
    }
    if(y === 0) this.lockY = null;
    if(x === 0) this.lockX = null;
  }
}
Scrollbar.use(SoftScrollPlugin);