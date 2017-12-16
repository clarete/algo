Array.prototype.swap = function (x, y) {
  var b = this[x];
  this[x] = this[y];
  this[y] = b;
  return this;
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Terminal() {
  this.element = document.createElement('ul');
}

Terminal.prototype = {
  wrapper: function() {
    var div = document.createElement('div');
    div.setAttribute('class', 'terminal');
    div.appendChild(this.element);
    return div;
  },

  push: function(line) {
    var li = document.createElement('li');
    li.innerHTML = line;
    this.element.appendChild(li);
    li.scrollIntoView();
  }
};

function Stage(id) {
  this.element = document.getElementById(id);
  this.values = [];

  if (this.element.children.length == 0) {
    this.canvas = document.createElement('canvas');
    this.terminal = new Terminal();
    this.element.appendChild(this.canvas);
    this.element.appendChild(this.terminal.wrapper());
    this.ctx = this.canvas.getContext('2d');
  }
}

Stage.prototype = {
  getDimensions: function() {
    return {
      w: this.canvas.width,
      h: this.canvas.height,
    };
  },

  createRandomValues: function(max) {
    var d = this.getDimensions();
    var vals = [];
    for (var i = 0; i < max; i++) {
      var val = rand(0, d.h);
      vals.push(val);
    }
    return vals;
  },

  clean: function() {
    var d = this.getDimensions();
    this.ctx.fillStyle = "#fff";
    this.ctx.fillRect(0, 0, d.w, d.h);
  },

  drawValues: function(vals, marked) {
    var d = this.getDimensions();
    var width = (d.w / vals.length) -1;
    for (var i = 0; i < vals.length; i ++) {
      if (i == marked) {
        this.ctx.fillStyle = "#f00";
      } else {
        this.ctx.fillStyle = "#fc0";
      }

      this.ctx.fillRect((width+1) * i,
                        d.h - vals[i],
                        width, d.h);
    }
  },

  queueDrawValues: function(values, marked, index) {
    setTimeout(function () {
      this.clean();
      this.drawValues(values, marked)
    }.bind(this), 50 * index)
  },

  populate: function() {
    this.clean();
    this.values = this.createRandomValues(30);
    this.terminal.push('Values: ' + this.values);
    this.drawValues(this.values);
  },

  /* -- Insertion Sort -- */

  insertionSort: function() {
    var values = this.values.slice();
    var animationIndex = 0;

    for (var i = 1; i < values.length; i++) {
      for (var k = i; k > 0 && values[k] < values[k - 1]; k--) {
        values.swap(k, k - 1);
        this.queueDrawValues(values.slice(), k, animationIndex++);
      }
    }

    this.terminal.push('Sorted: ' + values);
    this.queueDrawValues(values, -1, animationIndex++);
  },

  selectionSort: function() {
    var values = this.values.slice();
    var animationIndex = 0;

    for (var i = 0; i < values.length; i++) {
      var k = i;
      for (var j = i+1; j < values.length; j++) {
        if (values[j] < values[k]) k = j;
        this.queueDrawValues(values.slice(), k, animationIndex++);
      }
      values.swap(i, k);
    }

    this.terminal.push('Sorted: ' + values);
    this.queueDrawValues(values, -1, animationIndex++);
  },

  /* -- -- Merge Sort -- -- */

  _merge: function (values, left, mid, right, level) {
    var tmp = [];
    var i, pos = 0, lpos = left, rpos = mid + 1;
    /* var p = this._debugHeader(level);
     * console.log('|' + p + '* conquer [' + left+ '..' + mid + '..' + right + '] = ' + values.slice(left, right+1) + '{'+ values[left] + ', ' + values[right]+'} {');*/
    while (lpos <= mid && rpos <= right) {
      if (values[lpos] < values[rpos]) {
        tmp[pos++] = values[lpos++];
      } else {
        tmp[pos++] = values[rpos++];
      }
    }
    /* console.log('|' + p + '--[V:' + values + ']');
     * console.log('|' + p + '--[T:' + tmp + ']');*/
    while (lpos <= mid) {
      tmp[pos++] = values[lpos++];
    }
    while (rpos <= right) {
      tmp[pos++] = values[rpos++];
    }
    /* console.log('|' + p + '--[V:' + values + ']');
     * console.log('|' + p + '--[T:' + tmp + ']');*/
    for (i = 0; i < pos; i++) {
      /* console.log('|' + p + '-- I:' +i+ ',L:' +left+'='+(i+left) +'{'+tmp+'}');
       * console.log('|' + p + '-- SWAP[' + values[i+left] + ', ' + tmp[i] + ']');*/
      values[i + left] = tmp[i];
      this.queueDrawValues(values.slice(), i+left, this.animationIndex++);
    }
    /* console.log('|' + p + '}');*/
  },

  _debugHeader: function (level) {
    var p = '';
    var l = level;
    while (l-- > 0) p+= '-';
    return p;
  },
  _mergeSort: function (values, left, right, level) {
    /* var p = this._debugHeader(level); */
    var mid = Math.floor((left + right) / 2);
    if (left < right) {
      /* console.log('|' + p + '* divide [' + left+ '..' + mid + '..' + right + '] = ' + values.slice(left, right+1) + '{'+ values[left] + ', ' + values[right]+'}');*/
      this._mergeSort(values, left, mid, level+1);
      this._mergeSort(values, mid+1, right, level+1);
      this._merge(values, left, mid, right, level+1);
    }
  },

  mergeSort: function() {
    var values = this.values.slice();
    this.animationIndex = 0;
    this._mergeSort(values, 0, values.length -1 , 0);
    this.terminal.push('Sorted: ' + values);
  }
};
