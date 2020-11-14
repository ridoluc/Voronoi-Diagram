class BTStruct {

  constructor(minorFunc = (a, b) => (a < b), equalFunc = (a, b) => (a == b)) {
    this._list = [];
    this.minor = minorFunc;
    this.equal = equalFunc;

  }

  empty() {
    BTStruct.IDcount = 0;
    this._list = [];
  }

  get latestID() {

    if (!BTStruct.IDcount) {
      BTStruct.IDcount = 0;
    }
    return (++BTStruct.IDcount);
  }


  get last() {
    return (this._list[this._list.length - 1]);
  }

  /* Add a new element in the right position */
  add(elm) {
    let i = this.findPos(elm);
    this._list.splice(i, 0, elm);
  }

  /* Add a new element in the given position 
  addInPos(elm, i) {
    this._list.splice(i, 0, elm);
  }

*/
  /* Removes the element that satisfies the equality condition */
  remove(elm) {

    for (let i=0; i<this._list.length;i++) {
      if (this._list[i]._ID == elm._ID) {
        this._list.splice(i, 1);
        return elm;
      }
    }
    /* 
     let i = this.findPos(elm);
     if (this._list[i] == elm) {
       this._list.splice(i, 1);
       return elm;
     }
     */
    return null;
  }

  removeFirst() {
    if (this._list.length > 0) {
      let elm = this._list[0];
      this._list.splice(0, 1);
      return elm;
    }
    return null;
  }

  /*
    Returns the position of the element if equal otherwise return the position where it should be inserted 
   */
  findPos(elm) {
    let start = 0;
    let end = this._list.length - 1;
    let calcMid = (a, b) => Math.floor((a + b) / 2);
    let mid, comp;

    do {
      mid = calcMid(start, end);
      comp = this.minor(this._list[mid], elm);
      if (comp) {
        start = mid + 1;
      } else if (this.equal(this._list[mid], elm)) {
        return (mid);
      } else {
        end = Math.max(0, mid - 1);
      }

    } while (end > start)

    return ((this._list.length > 0 && this.minor(this._list[end], elm)) ? end + 1 : end);
  }

  /* Returns an array with the element and it's position if it exists otherwise null and the position where this should be*/
  find(elm) {
    let pos = this.findPos(elm);
    let e = this._list[pos];

    if (this.equal(e, elm)) return [e, pos];
    else if (e && pos > 0) return [null, pos];
    else return [null, pos];
  }

  /* Iterator throught the elements contained in the structure */
  [Symbol.iterator]() {
    var index = -1;

    return {
      next: () => ({ value: [++index, this._list[index]], done: !(index in this._list) })
    };
  };
}

/*
$(document).ready(function(){
  let st = new BTStruct();
  st._list = ["a","b","d"];
  st.add("z")
  st.add("0")
  st.add("5")
  st.add("y")
  //let p = st.findPos("a");
  //console.log(p);
  for(e of st){console.log(e);}
})

*/