import Asset from './asset'

export default interface AssetLoader {
  load(name: string, url: string, type: string, options: any): Asset
}
