export class MapLocation {
  name: string = ''
  description: string = ''
  lng: number = 0
  lat: number = 0

  static with({ name = '', description = '', lng = 0, lat = 0 }: Partial<MapLocation>) {
    const instance = new MapLocation()
    instance.name = name
    instance.description = description
    instance.lng = lng
    instance.lat = lat
    return instance
  }
}
