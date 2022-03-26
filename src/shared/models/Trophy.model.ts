export class Trophy {
  public score: number;
  public name: string;
  public index: number;

  constructor(obj: Trophy) {
    this.score = obj.score;
    this.name = obj.name;
    this.index = obj.index;
  }
}
