class VoronoiEvent{

  constructor(type, pos, elm){
    this.type = type;
    this.position = pos;
    this.element = elm;
    this.valid = true;
  }


  /*================================================== */
  /*----------------  STATIC METHODS  -----------------*/
  /*================================================== */

  static equal(eA, eB) {
    if (eA != null && eA.position == eB.position) return true;
    return false;
  }
  static minor(eA, eB) {
    if (eA != null && eA.position < eB.position) return true;
    return false;
  }

}