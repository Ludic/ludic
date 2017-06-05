import Dialog from './Dialog'
import app from '../app/app'

export default class MenuDialog extends Dialog {
  constructor(options) {
    super(options)

    this.menuItems = [];

  }

  render(delta, ctx){
    super.render(delta, ctx);

    // render the menu items
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    this.menuItems.forEach((item, index) => {
      item.render(delta,ctx,index);
    });
    ctx.restore();
  }

  addMenuItem(item){
    if(item instanceof MenuDialog.MenuItem){
      this.menuItems.push(item);
    } else {
      console.warn("Parameter needs to be of type MenuDialog.MenuItem");
    }
  }

  show(){
    super.show();
    // take input control
    this.input = app.input.newEventListener({
      stopPropagation: true,
      keyConfig: {
        'w': 'up',
        's': 'down',
        'esc.once.down': 'start'
      },
      methods: {
        up: this.selectPreviousItem,
        down: this.selectNextItem,
        start: this.toggleMenuOpen
      }
    }, this, true)

    this.selectedItemIndex = 0;
    this.selectItem(this.selectedItemIndex);
  }

  hide(){
    super.hide();
    app.input.removeEventListener(this.input);
  }

  selectItem(index){
    if(this.selectedItem){
      this.selectedItem.deselect();
    }
    this.selectedItem = this.menuItems[index];
    this.selectedItem.select();
  }

  selectNextItem(keyDown, e){
    if(keyDown && !e.button.lastState.pressed){
      this.selectItem(++this.selectedItemIndex%this.menuItems.length);
      // this.selectedItemIndex++;
    }
  }
  selectPreviousItem(keyDown, e){
    if(keyDown && !e.button.lastState.pressed){
      this.selectItem((this.menuItems.length-1)-(++this.selectedItemIndex%this.menuItems.length));
      // this.selectedItemIndex++;
    }
  }

  toggleMenuOpen(keyDown, e){
    if(keyDown && !e.button.lastState.pressed){
      this.toggle();
    }
  }
}

MenuDialog.MenuItem = class MenuItem {
  constructor(text) {
    this.text = text;
  }

  render(delta, ctx, index){
    ctx.save();
    ctx.fillStyle = this.selected ? 'red' : 'white';
    ctx.font = '22px serif';
    ctx.fillText(this.text, 10, 59 + (index*27)); // y = fontSize + 10 + distance from title = 22+10+27
    ctx.restore();
  }

  select(){
    this.selected = true;
  }

  deselect(){
    this.selected = false;
  }
}
