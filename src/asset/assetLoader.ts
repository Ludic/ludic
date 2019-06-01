import Asset from './asset'

export default interface AssetLoader {
  load(name: string, url: string, type: string, options: any): Asset
}
export const t = {} // this is a hack to make this file generate a declaration file in dist. (https://github.com/s-panferov/awesome-typescript-loader/issues/432)