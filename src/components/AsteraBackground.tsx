import { ShaderFill } from '../lib/custom-effect-runtime/index'
import {
  setup,
  render,
  manifest,
} from '../lib/custom-effects/CodeComponentId_8ce92017e53431a2f04b3574f4ba7c98f6f55f1e_7037'
import './AsteraBackground.css'

// Параметри фону «Moving gradient» з макета (однакові для телефона й комп’ютера).
// Об’єкт створюється один раз, щоб шейдер не перезапускався при кожному рендері.
const backgroundShader = {
  setup,
  render,
  manifest,
  params: {
    intensity: 0.41999998688697815,
    gradient: {
      stops: [
        { position: 0.0625, color: { r: 0.058974359184503555, g: 0, b: 0.11057692021131516, a: 1 } },
        { position: 0.5288461446762085, color: { r: 0.06322018057107925, g: 0.05177514627575874, b: 0.26923078298568726, a: 1 } },
        { position: 1, color: { r: 0.004301618784666061, g: 0, b: 0.08173076808452606, a: 1 } },
      ],
    },
    gradientBalance: 0,
    material: 0,
    morphSpeed: 1.4399999380111694,
    detail: 0.550000011920929,
    twist: 1.0399999618530273,
    zoom: 56,
    gradientMethod: 1,
    warp: 0.029999999329447746,
    rotationSpeed: 12,
  },
}

export default function AsteraBackground() {
  return (
    <div className="astera-background" aria-hidden="true">
      <ShaderFill shader={backgroundShader} />
    </div>
  )
}