import { Dom, Vector, KeyValue } from '@antv/x6-common'
import { Registry } from '../registry'
import * as patterns from './main'

export class Grid {
  root: Element
  patterns: { [id: string]: Element }

  constructor(options?: Grid.GridRegisterProps) {
    let width: number | string = '100%'
    let height: number | string = '100%'
    if (options) {
      const { size, sx, sy } = options
      width = size * sx
      height = size * sy
    }
    this.patterns = {}
    this.root = Vector.create(
      Dom.createSvgDocument(),
      {
        width,
        height,
      },
      [Dom.createSvgElement('defs')],
    ).node
  }

  add(id: string, elem: Element) {
    const firstChild = this.root.childNodes[0]
    if (firstChild) {
      firstChild.appendChild(elem)
    }

    this.patterns[id] = elem

    Vector.create('rect', {
      width: '100%',
      height: '100%',
      fill: `url(#${id})`,
    }).appendTo(this.root)
  }

  get(id: string) {
    return this.patterns[id]
  }

  getRoot() {
    return this.root
  }

  has(id: string) {
    return this.patterns[id] != null
  }
}

export namespace Grid {
  export interface Options {
    color: string
    thickness: number
  }

  interface BaseDefinition<T extends Options = Options> extends Options {
    markup: string
    update: (
      elem: Element,
      options: {
        sx: number
        sy: number
        ox: number
        oy: number
        width: number
        height: number
      } & T,
    ) => void
  }

  export type Definition<T extends Options = Options> = T & BaseDefinition<T>
  export type CommonDefinition =
    | Definition<Grid.Options>
    | Definition<Grid.Options>[]
}

export namespace Grid {
  export const presets = patterns
  export const registry = Registry.create<CommonDefinition, Presets>({
    type: 'grid',
  })

  registry.register(presets, true)
}

export namespace Grid {
  export interface GridRegisterProps {
    size: number
    sx: number
    sy: number
  }

  export type Presets = typeof Grid['presets']

  export type OptionsMap = {
    dot: patterns.DotOptions
    fixedDot: patterns.FixedDotOptions
    mesh: patterns.MeshOptions
    doubleMesh: patterns.DoubleMeshOptions[]
  }

  export type NativeNames = keyof Presets

  export interface NativeItem<T extends NativeNames = NativeNames> {
    type: T
    args?: OptionsMap[T]
  }

  export interface ManaualItem {
    type: Exclude<string, NativeNames>
    args?: KeyValue
  }
}
