class Baseline {
  nextPrice: number;

  x1: number;
  x2: number;
  w: number;
  z: number;
  value: number = 0;
  points = [];
  t: number;

  boxMuller(r) {
    let phase = 0
    if (!phase) {
      this.x1 = 2.0 * r[0] - 1.0
      this.x2 = 2.0 * r[1] - 1.0
      this.w = this.x1 * this.x1 + this.x2 * this.x2
      if (this.w >= 1.0){
        this.w = Math.sqrt((-2.0 * Math.log(this.w)) / this.w)
        this.z = this.x1 * this.w
      } else {
        this.z = this.x2 * this.w
      }
    } else {
      this.z = this.x2 * this.w
    }

    if(this.z == this.z){
      this.value += this.z
      this.points.push([this.t, this.value]);
      this.points.map((point) => {
          this.calculations(point[1])
          point = point.slice(-1)
      })
      this.points = this.points.slice(-1)
    }
    phase ^= 1
  }

  calculations(result){
    let base = 0
    let scale = 100

    if(base != 0 && scale != 100){
      result = base + (result*(base/scale))
    } else if(base != 0){
      result = base + (result*(base/100))
    }

    this.nextPrice = result;
  }

  generateNextPrice(): number {
    this.boxMuller([Math.random(), Math.random()])
    return this.nextPrice;
  }
}