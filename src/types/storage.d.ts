interface DataStorage {
  get(key: string): any
  set(key: string, value: any): any
  remove(key: string): any
}
