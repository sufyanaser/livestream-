export const GRAPHICS_CHANNELS = {
  get: 'graphics:get',
  update: 'graphics:update',
  changed: 'graphics:changed'
} as const

export interface LowerThirdGraphic {
  visible: boolean
  name: string
  title: string
  organization: string
  accentColor: string
  direction: 'rtl' | 'ltr'
  autoHideSeconds: number | null
}

export interface TickerGraphic {
  visible: boolean
  text: string
  direction: 'rtl' | 'ltr'
  speed: number
}

export interface ClockGraphic {
  visible: boolean
  mode: 'clock' | 'countdown'
  targetTime: string | null
}

export interface GraphicsState {
  endpoint: string
  lowerThird: LowerThirdGraphic
  ticker: TickerGraphic
  clock: ClockGraphic
  logoVisible: boolean
  sponsorVisible: boolean
  revision: number
}

export interface GraphicsPatch {
  lowerThird?: Partial<LowerThirdGraphic>
  ticker?: Partial<TickerGraphic>
  clock?: Partial<ClockGraphic>
  logoVisible?: boolean
  sponsorVisible?: boolean
}

export interface GraphicsBridge {
  get: () => Promise<GraphicsState>
  update: (patch: GraphicsPatch) => Promise<GraphicsState>
  onChanged: (listener: (state: GraphicsState) => void) => () => void
}
